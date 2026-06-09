def get_essay_analyze_tool():
    return {
        "type": "function",
        "function": {
            "name": "essay_analyze",
            "description": "分析英语作文并返回评分、语法错误和改进建议",
            "parameters": {
                "type": "object",
                "properties": {
                    "score": {"type": "integer", "description": "作文评分，0-100"},
                    "grammar_errors": {
                        "type": "array",
                        "description": "语法错误列表",
                        "items": {
                            "type": "object",
                            "properties": {
                                "error_type": {
                                    "type": "string",
                                    "description": "错误类型，例如：语法、拼写、风格、词汇",
                                },
                                "error_tag": {
                                    "type": "string",
                                    "description": "错误标签",
                                },
                                "error_desc": {
                                    "type": "string",
                                    "description": "错误详细说明",
                                },
                                "error_word": {
                                    "type": "string",
                                    "description": "错误内容",
                                },
                                "correct_word": {
                                    "type": "string",
                                    "description": "正确表达",
                                },
                            },
                            "required": [
                                "error_type",
                                "error_tag",
                                "error_desc",
                                "error_word",
                                "correct_word",
                            ],
                        },
                    },
                    "overall_comment": {"type": "string", "description": "总体评价"},
                    "idea": {
                        "type": "array",
                        "description": "改进建议",
                        "items": {"type": "string"},
                    },
                    "ai_idea": {"type": "string", "description": "AI 改写后的建议文本"},
                },
                "required": [
                    "score",
                    "grammar_errors",
                    "overall_comment",
                    "idea",
                    "ai_idea",
                ],
            },
        },
    }


def get_grammar_tool():
    return {
        "type": "function",
        "function": {
            "name": "grammar_check",
            "description": "Analyze English text and return grammar, spelling, vocabulary, punctuation, and style issues.",
            "parameters": {
                "type": "object",
                "properties": {
                    "grammar_errors": {
                        "type": "array",
                        "description": "List of detected grammar issues",
                        "items": {
                            "type": "object",
                            "properties": {
                                "match_text": {
                                    "type": "string",
                                    "description": "Sentence fragment containing the error",
                                },
                                "error_text": {
                                    "type": "string",
                                    "description": "The exact incorrect text",
                                },
                                "suggestion": {
                                    "type": "string",
                                    "description": "Suggested correction",
                                },
                                "error_type": {
                                    "type": "string",
                                    "enum": [
                                        "Grammar",
                                        "Spelling",
                                        "Vocabulary",
                                        "Punctuation",
                                        "Style",
                                    ],
                                },
                                "message": {
                                    "type": "string",
                                    "description": "Explanation of the issue",
                                },
                            },
                            "required": [
                                "match_text",
                                "error_text",
                                "suggestion",
                                "error_type",
                                "message",
                            ],
                        },
                    }
                },
                "required": ["grammar_errors"],
            },
        },
    }
