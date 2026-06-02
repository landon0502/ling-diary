"""
Provider 基类 —— 定义统一的大模型调用接口。
- stream_chat() → SSE 流式响应
- chat()        → 非流式，返回完整文本
新增 Provider 需实现 _generate_stream() 和 _generate()。
"""
from abc import ABC, abstractmethod
from typing import AsyncGenerator

from sse_starlette.sse import EventSourceResponse

from app.models import ChatMessage, ChatResponse


class BaseProvider(ABC):
    """
    大模型 Provider 抽象基类。
    子类需覆盖: name, default_model, _generate_stream(), _generate()。
    """

    name: str = ""
    model: str = ""
    auth_url: str = ""
    api_key: str = ""
    # ===== 公开方法 =====

    def stream_chat(
        self,
        messages: list[ChatMessage],
        model: str | None = None,
        **kwargs,
    ) -> EventSourceResponse:
        """SSE 流式对话 —— 返回 EventSourceResponse"""

        async def event_generator() -> AsyncGenerator[dict, None]:
            try:
                async for chunk in self._generate_stream(messages, model, **kwargs):
                    yield chunk
            except Exception as e:
                yield {"event": "error", "data": str(e)}

        return EventSourceResponse(event_generator())

    async def chat(
        self,
        messages: list[ChatMessage],
        **kwargs,
    ) -> ChatResponse:
        """非流式对话 —— 返回完整 ChatResponse"""
        try:
            return await self._generate(messages, **kwargs)
        except Exception as e:
            raise e

    # ===== 子类需实现 =====

    @abstractmethod
    async def _generate_stream(
        self,
        messages: list[ChatMessage],
        **kwargs,
    ) -> AsyncGenerator[dict, None]:
        """流式生成 —— 逐 chunk yield {"data": "文本"} 和 {"event": "done", "data": ""}"""
        ...

    @abstractmethod
    async def _generate(
        self,
        messages: list[ChatMessage],
        **kwargs,
    ) -> ChatResponse:
        """非流式生成 —— 等待完整响应后返回"""
        ...
