"""
全局异常处理模块 —— 统一捕获各类异常并返回标准 JSON 响应。
在 main.py 中通过 app.add_exception_handler() 注册。
"""
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException


class AppException(Exception):
    """
    业务异常基类 —— 业务层抛出此异常即可被 app_exception_handler 捕获，
    自动按 code/message 格式返回给客户端。
    """

    def __init__(self, message: str, code: int = 400):
        self.message = message
        self.code = code


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """处理 Starlette/FastAPI 标准 HTTP 异常（如 404, 401 等）"""
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.status_code, "message": exc.detail},
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    处理 Pydantic 请求参数校验失败 —— 返回 422 并附带具体字段错误，
    方便前端展示表单验证提示。
    """
    return JSONResponse(
        status_code=422,
        content={
            "code": 422,
            "message": "请求参数校验失败",
            "errors": exc.errors(),
        },
    )


async def app_exception_handler(request: Request, exc: AppException):
    """
    处理业务异常 —— 直接透传异常的 code 和 message，
    业务层只需 raise AppException(code=xxx, message='xxx')。
    """
    return JSONResponse(
        status_code=exc.code,
        content={"code": exc.code, "message": exc.message},
    )


async def general_exception_handler(request: Request, exc: Exception):
    """
    兜底异常处理器 —— 捕获未被上述 handler 覆盖的所有异常，
    返回 500 通用错误，避免内部细节泄露到前端。
    """
    return JSONResponse(
        status_code=500,
        content={"code": 500, "message": "服务器内部错误"},
    )
