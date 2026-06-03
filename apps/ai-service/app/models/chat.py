"""
对话相关数据模型。
"""
from typing import Any, Literal
from pydantic import BaseModel

class ChatMessage(BaseModel):
    """对话消息"""
    role: str   # system / user / assistant
    content: str


class ChatResponse(BaseModel):
    """非流式对话响应 —— content 类型由具体 Provider 决定"""
    content: Any
    model: str = ""
    usage: dict | None = None


# ===== 作文批改业务模型 =====

class GrammarError(BaseModel):
    """语法错误项"""
    error_type: Literal["语法", "拼写", "风格", "词汇"]
    error_tag: str
    error_desc: str
    error_word: str
    correct_word: str


class EssayAnalyzeResult(BaseModel):
    """AI 作文批改结果"""
    score: int
    grammar_errors: list[GrammarError]
    overall_comment: str
    idea: list[str]
    ai_idea: str
