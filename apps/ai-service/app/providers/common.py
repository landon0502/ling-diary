"""
通用 Provider —— 基于 LangChain ChatOpenAI 封装 OpenAI 兼容接口。
支持流式对话（SSE）与非流式结构化输出（作文批改）。
兼容 DeepSeek-R1 等深度思考模型的 reasoning_content。
"""

import json
import re
from typing import List

from langchain.chat_models import init_chat_model
from langchain_core.messages import AIMessage

from app.providers.base import BaseProvider
from app.providers.tools import get_essay_analyze_tool, get_grammar_tool
from app.models import ChatMessage, ChatResponse
from app.models.ai_platform import AiModelConf
from app.prompt.english_prompt import build_grammar_prompt

# ===== 工具函数 =====


def _is_essay_result(data: dict) -> bool:
    """检查 JSON 是否包含 essay_analyze 的预期字段"""
    required = {"score", "grammar_errors", "overall_comment", "idea", "ai_idea"}
    return required.issubset(data.keys())


def _try_extract_json(text: str) -> dict | None:
    """从文本中尝试提取 JSON 对象，兼容 markdown 包裹等格式"""
    if not text:
        return None
    text = text.strip()

    # 直接解析
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        pass

    # ```json ... ``` 包裹
    m = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if m:
        try:
            return json.loads(m.group(1))
        except (json.JSONDecodeError, TypeError):
            pass

    # 提取第一个完整的 JSON 对象
    m = re.search(r"\{[\s\S]*\}", text)
    if m:
        try:
            return json.loads(m.group(0))
        except (json.JSONDecodeError, TypeError):
            pass

    return None


def parse_essay_result(response: AIMessage) -> dict:
    """解析 LangChain AIMessage 中的 essay_analyze 结果，兼容 tool_calls 在 content 中的场景"""
    # 标准路径：AIMessage.tool_calls 有值（LangChain 格式）
    if response.tool_calls:
        tool_call = response.tool_calls[0]
        if tool_call["name"] != "essay_analyze":
            raise Exception("返回了错误的工具")
        # LangChain 的 tool_calls args 已经是 dict
        return tool_call["args"]

    # 兼容路径：部分大模型把 tool_calls 放在 content 中返回
    content = response.content or ""
    if isinstance(content, list):
        content = "".join(str(c) for c in content)

    if content:
        result = _try_extract_json(content)
        if result:
            # 格式1: content 就是 essay_analyze 的结果 JSON
            if _is_essay_result(result):
                return result

            # 格式2: {"name": "essay_analyze", "arguments": {...}}
            if isinstance(result, dict) and "arguments" in result:
                args = result["arguments"]
                if isinstance(args, str):
                    args = json.loads(args)
                if isinstance(args, dict) and _is_essay_result(args):
                    return args

    raise Exception("模型未返回tool调用")


# ===== Provider =====


class CommonProviders(BaseProvider):
    """
    通用 Provider，基于 LangChain 的 init_chat_model 初始化。
    自动适配 OpenAI / DeepSeek / 智谱 等 OpenAI 兼容 API。
    """

    def __init__(self, config: AiModelConf):
        self.model = config.model
        self.auth_url = config.auth_url
        self.name = config.provider
        self.api_key = config.api_key

        # 使用 LangChain 的 init_chat_model 统一初始化
        # model 格式 "openai:xxx" 会自动委托给 langchain-openai 的 ChatOpenAI
        self._chat_model = init_chat_model(
            model=f"openai:{config.model}",
            api_key=config.api_key,
            base_url=config.auth_url,
        )

    # ===== 公开方法实现 =====

    async def grammar_handler(self, content: str, **kwargs):
        """二次请求 LLM，进行语法检查（非流式）"""
        grammar_messages = [{"role": "user", "content": build_grammar_prompt(content)}]

        llm_with_tools = self._chat_model.bind_tools(
            [get_grammar_tool()],
            tool_choice="grammar_check",
        )

        response = await llm_with_tools.ainvoke(
            grammar_messages,
            temperature=0.2,
            top_p=0.8,
            reasoning_effort=kwargs.get("reasoning_effort", "low"),
        )
        print(response)
        yield response

    async def _generate_stream(self, messages: List[ChatMessage], **kwargs):
        # 1. 核心清洗：剔除前端传来的多余字段，只留下标准字段
        cleaned_messages = [
            {"role": msg.role, "content": msg.content} for msg in messages
        ]

        # 2. 使用 LangChain astream 进行流式调用
        #    reasoning_effort 等 model_kwargs 会透传给底层 ChatOpenAI → OpenAI API
        stream = self._chat_model.astream(
            cleaned_messages,
            temperature=0.2,
            top_p=0.8,
            reasoning_effort=kwargs.get("reasoning_effort", "high"),
        )

        # 3. 遍历 LangChain AIMessageChunk 流
        async for chunk in stream:
            content = ""
            reasoning_content = ""

            # AIMessageChunk.content 可能是 str 或 list
            if isinstance(chunk.content, str) and chunk.content:
                content = chunk.content

            # 深度思考模型的 reasoning_content 存放在 additional_kwargs 中
            if chunk.additional_kwargs:
                reasoning_content = chunk.additional_kwargs.get("reasoning_content", "")

            # 也检查 response_metadata（部分版本存放位置不同）
            if not reasoning_content and chunk.response_metadata:
                reasoning_content = chunk.response_metadata.get("reasoning_content", "")

            # 4. 格式化为与旧实现完全一致的 SSE 字符串
            if content or reasoning_content:
                payload = {
                    "type": "content",
                    "data": content,
                    "reasoning": reasoning_content,
                }
                yield f"{json.dumps(payload, ensure_ascii=False)}\n\n"

        # 5. 流结束标识
        yield "[DONE]\n\n"

    async def _generate(self, messages, **kwargs):
        # 绑定 essay_analyze tool 并强制调用
        llm_with_tools = self._chat_model.bind_tools(
            [get_essay_analyze_tool()],
            tool_choice="essay_analyze",
        )

        # 使用 LangChain ainvoke 进行非流式调用
        response: AIMessage = await llm_with_tools.ainvoke(
            [message.model_dump() for message in messages],
            temperature=0.2,
            top_p=0.8,
            reasoning_effort=kwargs.get("reasoning_effort", "low"),
        )

        data = parse_essay_result(response)

        # 提取 usage 信息，兼容 LangChain 不同版本
        usage = response.response_metadata.get("token_usage", {})
        if not usage:
            # 兼容 usage_metadata（较新 LangChain 版本）
            um = getattr(response, "usage_metadata", None) or {}
            if um:
                usage = dict(um)

        return ChatResponse(
            content=data,
            model=response.response_metadata.get("model_name", ""),
            usage=usage,
        )
