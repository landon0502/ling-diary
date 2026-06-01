"""
全局中间件 —— CORS、请求日志、耗时追踪。
在 main.py 中通过 app.add_middleware() 注册。
"""
import time
import uuid
import logging

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.config import settings

logger = logging.getLogger("ai-service")


def setup_cors(app):
    """CORS 跨域中间件 —— 仅允许 settings.CORS_ORIGINS 列表中的来源"""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    请求日志中间件 —— 记录每个请求的 method、路径、状态码和耗时，
    并为每个请求注入 X-Request-ID 方便链路追踪。
    """

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request_id = uuid.uuid4().hex[:12]
        request.state.request_id = request_id

        start = time.monotonic()
        response = await call_next(request)
        elapsed = (time.monotonic() - start) * 1000

        # 注入响应头
        response.headers["X-Request-ID"] = request_id

        logger.info(
            "%s %s -> %s  |  %.1fms  |  rid=%s",
            request.method,
            request.url.path,
            response.status_code,
            elapsed,
            request_id,
        )
        return response
