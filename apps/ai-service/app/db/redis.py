"""
Redis 异步连接池 — 提供缓存、分布式锁等能力。
应用启动时创建连接池，关闭时释放。
"""
import redis.asyncio as aioredis

from app.core.config import settings


class RedisClient:
    """
    Redis 客户端封装 —— 绑定连接池，提供常用缓存操作的 async 接口。
    """

    def __init__(self):
        self._pool: aioredis.ConnectionPool | None = None
        self._client: aioredis.Redis | None = None

    async def connect(self):
        """创建连接池并初始化客户端 — 在应用 startup 事件中调用"""
        self._pool = aioredis.ConnectionPool.from_url(
            settings.redis_url,
            max_connections=settings.REDIS_POOL_MAX,
        )
        self._client = aioredis.Redis(connection_pool=self._pool)

    async def disconnect(self):
        """释放连接池 — 在应用 shutdown 事件中调用"""
        if self._client:
            await self._client.aclose()
        if self._pool:
            await self._pool.disconnect()

    @property
    def client(self) -> aioredis.Redis:
        """获取原始 Redis 实例（使用前请确保已 connect）"""
        if self._client is None:
            raise RuntimeError("Redis 未初始化，请先调用 connect()")
        return self._client

    # ===== 快捷缓存方法 =====

    async def get(self, key: str) -> str | None:
        v = await self._client.get(key)
        return v.decode() if v else None

    async def set(self, key: str, value: str, expire: int | None = None):
        await self._client.set(key, value, ex=expire)

    async def delete(self, key: str):
        await self._client.delete(key)

    async def exists(self, key: str) -> bool:
        return await self._client.exists(key) > 0

    async def expire(self, key: str, seconds: int):
        await self._client.expire(key, seconds)


# 全局单例 — 模块级导入
redis_client = RedisClient()
