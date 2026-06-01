"""
数据访问层 (Data Access Object) — 封装对 MySQL / Redis 的 CRUD 操作。
每个业务域对应一个模块，通过 FastAPI Depends(get_session) 获取数据库连接。
"""
