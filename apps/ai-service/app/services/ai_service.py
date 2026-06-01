"""
AI 服务层 —— 封装 Provider 调用逻辑，对上层（router）屏蔽实现细节。
"""
from sse_starlette.sse import EventSourceResponse

from app.models import ChatMessage, ChatResponse
from app.providers.factory import ProviderFactory
from app.models.ai_platform import AiModelConf

def get_prompt(content: str) -> str:
    """构造作文批改 prompt"""
    prompt = f"""
    你是一位专业英语老师。
    请分析以下英文作文。
    必须返回 JSON
    必须中文回答
    禁止 markdown
    返回 JSON 格式：
    {{
        "score": 0,
        "grammar_errors": [{{error_type: "语法|拼写|风格|...", error_tag: "动词时态错误", error_desc: "主语是第一人称 I，过去式应该用 went 而不是 goes", error_word: "I goes to", correct_word: "I went to"}}],
        "overall_comment": "",
        "idea":["改进意见",...],
        "ai_idea":"AI 改写建议，直接返回改写后的内容，不要加入其他说明词"
    }}
    作文：
    {content}
    """
    return prompt


def _to_chat_messages(messages: list[dict]) -> list[ChatMessage]:
    """将前端传来的 dict 消息转为 ChatMessage，并对 user 消息注入批改 prompt"""
    result: list[ChatMessage] = []
    for m in messages:
        content = get_prompt(m["content"]) if m["role"] == "user" else m["content"]
        result.append(ChatMessage(role=m["role"], content=content))
    return result


def stream_chat(
    messages: list[dict],
   config: AiModelConf,
    **kwargs,
) -> EventSourceResponse:
    """流式对话 —— 返回 SSE 事件流"""
    provider = ProviderFactory.create("common")
    return provider.stream_chat(
        messages=_to_chat_messages(messages),
        model=config.model,
        **kwargs,
    )


async def chat(
    messages: list[dict],
    config: AiModelConf,
    **kwargs,
) -> ChatResponse:
    """非流式对话 —— 返回完整响应"""
    provider = ProviderFactory.create('common')
    return await provider.chat(
        messages=_to_chat_messages(messages),
        model=config.model,
        **kwargs,
    )
