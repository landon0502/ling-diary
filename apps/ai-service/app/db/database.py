"""
MySQL 异步连接池 — 基于 SQLAlchemy 2.0 async engine。
应用启动时初始化连接池，关闭时释放。通过 get_session() 依赖注入使用。
"""
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

# 异步引擎 — echo 仅开发环境开启
engine = create_async_engine(
    settings.database_url,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    echo=settings.DB_ECHO,
    pool_pre_ping=True,  # 连接前检查可用性
)

# 会话工厂
async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """ORM 基类 — 所有数据模型继承自此"""
    pass


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI 依赖注入 — 每次请求获取独立 session。
    用法: @router.get("/") async def foo(session = Depends(get_session))
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
