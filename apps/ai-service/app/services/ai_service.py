"""
AI 服务层 —— 封装 Provider 调用逻辑，对上层（router）屏蔽实现细节。
"""

from sse_starlette.sse import EventSourceResponse

from app.models import ChatMessage, ChatResponse
from app.providers.factory import ProviderFactory
from app.models.ai_platform import AiModelConf
from app.prompt.english_prompt import build_content_prompt


def _to_chat_messages(messages: list[dict]) -> list[ChatMessage]:
    """将前端传来的 dict 消息转为 ChatMessage，并对 user 消息注入批改 prompt"""
    result: list[ChatMessage] = [
        ChatMessage(role="system", content="你是一个专业的英语专家")
    ]
    for m in messages:
        content = (
            build_content_prompt(m["content"]) if m["role"] == "user" else m["content"]
        )
        result.append(ChatMessage(role=m["role"], content=content))
    return result


async def stream_chat(
    messages: list[dict],
    config: AiModelConf,
    **kwargs,
) -> EventSourceResponse:
    """流式对话 —— 返回 SSE 事件流"""
    provider = ProviderFactory.create("common", config=config)
    return await provider.stream_chat(
        messages=_to_chat_messages(messages),
        model=config.model,
        **kwargs,
    )


async def ai_analyze(
    messages: list[dict],
    config: AiModelConf,
    **kwargs,
) -> ChatResponse:
    """非流式对话 —— 返回完整响应"""
    provider = ProviderFactory.create("common", config)
    return await provider.chat(
        messages=_to_chat_messages(messages),
        model=config.model,
        **kwargs,
    )
