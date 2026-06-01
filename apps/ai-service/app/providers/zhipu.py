"""
智谱 GLM Provider —— 通过 OpenAI 兼容接口调用。
"""
from typing import AsyncGenerator

from openai import OpenAI
from json_repair import repair_json

from app.core.config import settings
from app.models import ChatMessage, ChatResponse, EssayAnalyzeResult
from app.providers.base import BaseProvider
from app.providers.tools import tools


class ZhipuProvider(BaseProvider):
    name = "zhipu"
    default_model = "GLM-4.5-Air"

    def __init__(self):
        self._client = OpenAI(
            api_key=settings.ZAI_API_KEY,
            base_url=settings.ZAI_BASE_URL,
        )

    # ==== 流式 ====

    async def _generate_stream(
        self,
        messages: list[ChatMessage],
        model: str | None,
        **kwargs,
    ) -> AsyncGenerator[dict, None]:
        model = model or self.default_model

        response = self._client.chat.completions.create(
            model=model,
            messages=[m.model_dump() for m in messages],
            stream=True,
            reasoning_effort=kwargs.get("reasoning_effort", "high"),
            extra_body=kwargs.get("extra_body", {"thinking": {"type": "enabled"}}),
            top_p=0.2,
            temperature=0.9,
        )

        for chunk in response:
            delta = chunk.choices[0].delta
            if delta.content:
                yield {"data": delta.content}

        yield {"event": "done", "data": ""}

    # ==== 非流式 ====

    async def _generate(
        self,
        messages: list[ChatMessage],
        model: str | None,
        **kwargs,
    ) -> ChatResponse:
        model = model or self.default_model

        response = self._client.chat.completions.create(
            model=model,
            messages=[m.model_dump() for m in messages],
            stream=False,
            reasoning_effort=kwargs.get("reasoning_effort", "high"),
            extra_body=kwargs.get("extra_body", {"thinking": {"type": "enabled"}}),
            top_p=0.2,
            temperature=0.9,
            response_format={"type": "json_object"},
            tools=tools,
            tool_choice="auto",
        )

        data = repair_json(
            json_str=response.choices[0].message.content or "",
            return_objects=True,
        )
        return ChatResponse(
            content=data,
            model=response.model,
            usage=response.usage.model_dump() if response.usage else None,
        )
