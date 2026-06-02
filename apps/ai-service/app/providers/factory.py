"""
Provider 工厂 —— 根据名称创建 Provider 实例。
应用启动时调用 init_providers() 完成注册。
"""
from app.providers.base import BaseProvider
from app.models.ai_platform import AiModelConf
from app.providers.common import CommonProviders
# 注册表 —— name → Provider 类
_registry: dict[str, type[BaseProvider]] = {}
class ProviderFactory:

    @staticmethod
    def create(name: str, config: AiModelConf) -> BaseProvider:
        cls = _registry.get(name)
        if cls is None:
            available = ", ".join(_registry.keys())
            raise ValueError(f"未知的 Provider: {name}，可用: {available}")
        return cls(config)

    @staticmethod
    def register(name: str, provider_cls: type[BaseProvider]):
        """注册 Provider（供 init_providers 使用）"""
        _registry[name] = provider_cls


def init_providers():
    """
    初始化 Provider 注册表 —— 在应用 lifespan 中调用。
    新增 Provider 时在此添加一行 register 即可。
    """
    ProviderFactory.register('common', CommonProviders)