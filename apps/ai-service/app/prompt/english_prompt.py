# 英语相关的prompt
def build_content_prompt(content: str) -> str:
    """构造作文批改 prompt"""
    prompt = f"""
    请分析以下英文作文/日记。
    其中包含标题：xxx 和 内容：xxx
    必须中文回答
    禁止 markdown
    作文：
    {content}
    """
    return prompt


def build_grammar_prompt(article: str) -> str:
    """
    构造英文语法检查 Prompt
    """

    return f"""
    You are a professional English grammar correction assistant.

    Analyze the following English text and identify grammar, spelling, vocabulary, punctuation, and style issues.

    Rules:

    1. Do NOT rewrite the entire article.
    2. Keep the original article unchanged.
    3. Return ONLY valid JSON.
    4. Do NOT return markdown.
    5. Do NOT wrap the response with ```json.
    6. Every error must contain:
    - error_text
    - suggestion
    - error_type
    - message
    - before_text
    - after_text
    7. error_text must exactly match the original article.
    8. before_text and after_text should provide surrounding context for accurate positioning.
    9. If there are no errors, return an empty array.

    Response Schema:

    {{
    "grammar_errors": [
        {{
        "error_text": "string",
        "before_text": "string",
        "after_text": "string",
        "suggestion": "string",
        "error_type": "Grammar | Spelling | Vocabulary | Punctuation | Style",
        "message": "string"
        }}
    ]
    }}

    Article:

    {article}
    """
