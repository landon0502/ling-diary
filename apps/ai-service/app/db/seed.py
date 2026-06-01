"""
种子数据 — 将 ai-platforms 配置导入数据库，幂等执行。
用法: python -m app.db.seed
"""
import asyncio
import sys
from pathlib import Path

# 确保项目根在 sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from sqlalchemy import select
from app.db.database import engine, Base, async_session_factory
from app.models.ai_platform import AIPlatform, AIModel

# 与 web/config/ai-platforms.ts 保持同步
SEED_DATA: list[dict] = [
    {
        "name": "zhipu",
        "label": "智谱 AI (GLM)",
        "auth_url": "https://open.bigmodel.cn/api/paas/v4/",
        "models": [
            {"value": "GLM-4.5-Air", "label": "GLM-4.5-Air"},
            {"value": "GLM-4-Air", "label": "GLM-4-Air"},
            {"value": "GLM-4-Flash", "label": "GLM-4-Flash"},
            {"value": "GLM-4-Plus", "label": "GLM-4-Plus"},
        ],
    },
    {
        "name": "deepseek",
        "label": "DeepSeek",
        "auth_url": "https://api.deepseek.com",
        "models": [
            {"value": "deepseek-chat", "label": "DeepSeek-V3 (Chat)"},
            {"value": "deepseek-reasoner", "label": "DeepSeek-R1 (Reasoner)"},
        ],
    },
    {
        "name": "openai",
        "label": "OpenAI",
        "auth_url": "https://api.openai.com/v1/",
        "models": [
            {"value": "gpt-4o", "label": "GPT-4o"},
            {"value": "gpt-4o-mini", "label": "GPT-4o Mini"},
            {"value": "gpt-4-turbo", "label": "GPT-4 Turbo"},
            {"value": "o3-mini", "label": "o3-mini"},
        ],
    },
    {
        "name": "moonshot",
        "label": "月之暗面 (Kimi)",
        "auth_url": "https://api.moonshot.cn/v1/",
        "models": [
            {"value": "moonshot-v1-8k", "label": "Moonshot v1 (8K)"},
            {"value": "moonshot-v1-32k", "label": "Moonshot v1 (32K)"},
            {"value": "moonshot-v1-128k", "label": "Moonshot v1 (128K)"},
        ],
    },
    {
        "name": "qwen",
        "label": "通义千问 (Qwen)",
        "auth_url": "https://dashscope.aliyuncs.com/compatible-mode/v1/",
        "models": [
            {"value": "qwen-turbo", "label": "Qwen Turbo"},
            {"value": "qwen-plus", "label": "Qwen Plus"},
            {"value": "qwen-max", "label": "Qwen Max"},
        ],
    },
    {
        "name": "baidu",
        "label": "百度文心 (ERNIE)",
        "auth_url": "https://qianfan.baidubce.com/v2/",
        "models": [
            {"value": "ernie-4.0-turbo", "label": "ERNIE 4.0 Turbo"},
            {"value": "ernie-3.5", "label": "ERNIE 3.5"},
            {"value": "ernie-speed", "label": "ERNIE Speed"},
        ],
    },
    {
        "name": "custom",
        "label": "自定义",
        "auth_url": "",
        "models": [],
    },
]


async def seed():
    # 建表
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ 表结构已就绪")

    async with async_session_factory() as session:
        for plat_data in SEED_DATA:
            # 幂等：已存在则跳过
            existing = await session.scalar(
                select(AIPlatform).where(AIPlatform.name == plat_data["name"])
            )
            if existing:
                print(f"⏭  跳过 {plat_data['name']}（已存在）")
                continue

            platform = AIPlatform(
                name=plat_data["name"],
                label=plat_data["label"],
                auth_url=plat_data["auth_url"],
            )
            session.add(platform)
            await session.flush()  # 获取 platform.id

            for m in plat_data["models"]:
                model = AIModel(
                    platform_id=platform.id,
                    value=m["value"],
                    label=m["label"],
                )
                session.add(model)

            print(f"✔  导入 {plat_data['name']}（{len(plat_data['models'])} 个模型）")

        await session.commit()
    print("✅ 种子数据导入完成")


if __name__ == "__main__":
    asyncio.run(seed())
