from app.providers.base import BaseProvider
from openai import OpenAI, AsyncOpenAI
from typing import List
from app.models import ChatMessage, ChatResponse
from app.models.ai_platform import AiModelConf
import json
import re
from app.prompt.english_prompt import build_grammar_prompt
from app.providers.tools import get_essay_analyze_tool, get_grammar_tool


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


def parse_essay_result(response):
    """解析模型返回的 essay_analyze 结果，兼容 tool_calls 在 content 中的场景"""
    message = response.choices[0].message

    # 标准路径：message.tool_calls 有值
    if message.tool_calls:
        tool_call = message.tool_calls[0]
        if tool_call.function.name != "essay_analyze":
            raise Exception("返回了错误的工具")
        return json.loads(tool_call.function.arguments)

    # 兼容路径：部分大模型把 tool_calls 放在 content 中返回
    content = message.content or ""

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


class CommonProviders(BaseProvider):

    def __init__(self, config: AiModelConf):
        self.model = config.model
        self.auth_url = config.auth_url
        self.name = config.provider
        self.api_key = config.api_key
        self._client = OpenAI(
            api_key=config.api_key,
            base_url=config.auth_url,
        )
        self._async_client = AsyncOpenAI(
            api_key=config.api_key,
            base_url=config.auth_url,
        )

    async def grammar_handler(self, content: str, **kwargs):
        # 5. 💡 二次请求LLM，整理出错误单词语法以及坐标位置
        grammar_messages = [{"role": "user", "content": build_grammar_prompt(content)}]
        grammarRes = await self._async_client.chat.completions.create(
            model=self.model,
            messages=grammar_messages,  # 💡 使用清洗后的干净参数
            stream=False,
            top_p=0.8,
            temperature=0.2,
            reasoning_effort=kwargs.get("reasoning_effort", "low"),
            tools=[get_grammar_tool()],
            tool_choice={"type": "function", "function": {"name": "grammar_check"}},
        )
        print(grammarRes)
        yield grammarRes

    async def _generate_stream(self, messages: List[ChatMessage], **kwargs):
        # 1. 💡 核心清洗：剔除前端传来的多余字段，只留下大模型要求的标准字段
        cleaned_messages = [
            {"role": msg.role, "content": msg.content} for msg in messages
        ]

        # 2. 💡 修正致命错误：必须在前面加上 await 激活异步流对象
        response = await self._async_client.chat.completions.create(
            model=self.model,
            messages=cleaned_messages,  # 💡 使用清洗后的干净参数
            stream=True,
            reasoning_effort=kwargs.get("reasoning_effort", "high"),
            top_p=0.8,
            temperature=0.2,
        )

        # 3. 💡 修正运行错误：遍历异步流必须使用 async for
        async for chunk in response:
            if not chunk.choices:
                continue

            delta = chunk.choices[0].delta
            content = ""
            reasoning_content = ""

            # 💡 进阶定制：完美兼容深度思考模型（如 o1, o3-mini, DeepSeek-R1）
            if hasattr(delta, "reasoning_content") and delta.reasoning_content:
                reasoning_content = delta.reasoning_content
            elif hasattr(delta, "content") and delta.content:
                content = delta.content

            # 4. 💡 定制核心：格式化为包含结构化数据的标准 SSE 字符串
            if content or reasoning_content:
                payload = {
                    "type": "content",
                    "data": content,
                    "reasoning": reasoning_content,  # 留作后续前端实现“思考折叠面板”的高级扩展
                }

                # 用 json.dumps 转换为标准字符串，并严格拼装 data: 前缀与双换行
                yield f"{json.dumps(payload, ensure_ascii=False)}\n\n"
        # yield (await self.grammar_handler(messages[0].content, **kwargs))
        # 5. 💡 定制流结束标识：向全链路（Go/Next.js）传递标准 DONE 信号
        yield "[DONE]\n\n"

    async def _generate(self, messages, **kwargs):
        response = await self._client.chat.completions.create(
            model=self.model,
            messages=[message.model_dump() for message in messages],
            stream=False,
            reasoning_effort=kwargs.get("reasoning_effort", "low"),
            top_p=0.8,
            temperature=0.2,
            tools=[get_essay_analyze_tool()],
            tool_choice={"type": "function", "function": {"name": "essay_analyze"}},
        )
        data = parse_essay_result(response)
        return ChatResponse(
            content=data,
            model=response.model,
            usage=response.usage.model_dump() if response.usage else None,
        )
