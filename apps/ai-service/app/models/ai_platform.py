"""AI 平台与模型 — 数据库 ORM 模型"""

from datetime import datetime

from sqlalchemy import ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from dataclasses import dataclass
from app.db.database import Base


class AIPlatform(Base):
    __tablename__ = "ai_platforms"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, comment="平台标识，如 zhipu / deepseek")
    label: Mapped[str] = mapped_column(String(100), nullable=False, comment="展示名称，如 智谱 AI (GLM)")
    auth_url: Mapped[str] = mapped_column(String(500), default="", comment="默认 API 地址")
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, onupdate=datetime.utcnow)

    models: Mapped[list["AIModel"]] = relationship(back_populates="platform", cascade="all, delete-orphan")


class AIModel(Base):
    __tablename__ = "ai_models"
    __table_args__ = (UniqueConstraint("platform_id", "value", name="uq_platform_model"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    platform_id: Mapped[int] = mapped_column(ForeignKey("ai_platforms.id", ondelete="CASCADE"))
    value: Mapped[str] = mapped_column(String(100), nullable=False, comment="模型标识，如 deepseek-chat")
    label: Mapped[str] = mapped_column(String(100), nullable=False, comment="展示名称，如 DeepSeek-V3 (Chat)")
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, onupdate=datetime.utcnow)

    platform: Mapped["AIPlatform"] = relationship(back_populates="models")


@dataclass
class AiModelConf:
    """用户提供的 AI 配置（非数据库表，仅作请求参数载体）"""
    provider: str
    model: str
    api_key: str
    auth_url: str