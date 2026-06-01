"""
AI 对话路由 —— 流式 + 非流式对话接口。
"""
from fastapi import APIRouter
from pydantic import BaseModel

from app.services import ai_service
from app.utils.response import success
from app.models.ai_platform import AiModelConf

router = APIRouter(prefix="/ai", tags=["ai"])


class ChatRequest(BaseModel):
    messages: list[dict] = [{"role": "", "content": ""}]
    provider: str = "zhipu"
    model: str | None = None
    api_key: str
    auth_url: str


# ==== 流式 ====

@router.post("/chat/stream")
async def chat_stream(body: ChatRequest):
    """
    流式对话 —— 返回 SSE 事件流，前端通过 EventSource 逐字展示。
    """
    return ai_service.stream_chat(
        provider_name=body.provider,
        messages=body.messages,
        model=body.model,
    )


# ==== 非流式 ====

@router.post("/chat")
async def chat(body: ChatRequest):
    """
    非流式对话 —— 返回完整响应，适用于批处理、摘要等场景。
    """
    config: AiModelConf = {
        "provider": body.provider,
        "model": body.model,
        "auth_url": body.auth_url,
        "api_key": body.api_key
    }
    result = await ai_service.chat(
        messages=body.messages,
        config=config
    )
    return success(data=result.model_dump())
