# API 请求封装

基于 Axios 封装的通用请求库，支持请求/响应拦截、Token 管理、权限校验等功能。

## 文件结构

```
lib/request/
├── types.ts          # 类型定义
├── config.ts         # 配置文件
├── interceptors.ts   # 拦截器
├── request.ts        # 请求实例
├── api.ts           # API 接口
├── examples.ts      # 使用示例
└── index.ts         # 统一导出
```

## 功能特性

- ✅ 请求/响应拦截器
- ✅ 自动 Token 管理
- ✅ Token 过期自动刷新
- ✅ 统一错误处理
- ✅ 请求取消
- ✅ 权限校验
- ✅ 文件上传/下载
- ✅ TypeScript 类型支持

## 快速开始

### 基础使用

```typescript
import request from '@/lib/request';

// GET 请求
const { data } = await request.get<UserInfo>('/user/me');

// POST 请求
const { data } = await request.post<LoginResult>('/auth/login', {
  email: 'user@example.com',
  password: '123456'
});

// PUT 请求
const { data } = await request.put<UserInfo>('/user/me', {
  name: '新名字'
});

// DELETE 请求
await request.delete('/user/123');
```

### Token 管理

```typescript
import { tokenManager } from '@/lib/request';

// 设置 Token
tokenManager.setToken('your-token-here');

// 获取 Token
const token = tokenManager.getToken();

// 检查是否已登录
if (tokenManager.isAuthenticated()) {
  // 执行需要登录的操作
}

// 清除 Token（登出时使用）
tokenManager.clearToken();
```

### 错误处理

```typescript
import request, { RequestError, ErrorType } from '@/lib/request';

try {
  const { data } = await request.get('/data');
} catch (error) {
  if (error instanceof RequestError) {
    switch (error.type) {
      case ErrorType.NetworkError:
        console.error('网络错误');
        break;
      case ErrorType.AuthError:
        console.error('认证失败，请重新登录');
        break;
      case ErrorType.PermissionError:
        console.error('没有权限访问');
        break;
      case ErrorType.ValidationError:
        console.error('数据验证失败:', error.message);
        break;
      case ErrorType.ServerError:
        console.error('服务器错误');
        break;
      default:
        console.error('未知错误:', error.message);
    }
  }
}
```

### 设置未授权回调

```typescript
import request from '@/lib/request';

// 登录过期时自动跳转到登录页
request.setUnauthorizedCallback(() => {
  window.location.href = '/login';
});
```

### 文件上传

```typescript
import request from '@/lib/request';

// 单文件上传
const formData = new FormData();
formData.append('file', file);
const { data } = await request.upload<{ url: string }>('/upload', formData);

// 批量上传
const batchFormData = new FormData();
files.forEach(f => batchFormData.append('files', f));
const { data } = await request.upload<{ urls: string[] }>('/upload/batch', batchFormData);
```

### 文件下载

```typescript
import request from '@/lib/request';

const blob = await request.download('/files/123.pdf');

// 创建下载链接
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'file.pdf';
link.click();
```

### 跳过错误处理

```typescript
import request from '@/lib/request';

try {
  const response = await request.get('/endpoint', {}, {
    skipErrorHandler: true  // 跳过统一错误处理，自行处理
  });
  if (response.code !== 200) {
    // 自定义处理逻辑
  }
} catch (error) {
  // 自定义错误处理
}
```

### 使用预定义 API

```typescript
import { login, getDataList, createData } from '@/lib/request/api';

// 登录
const { data: { token, user } } = await login({
  email: 'user@example.com',
  password: '123456'
});

// 获取数据列表
const { data: { items, total } } = await getDataList({
  page: 1,
  pageSize: 10,
  keyword: 'search'
});

// 创建数据
const { data } = await createData({
  title: '标题',
  content: '内容'
});
```

### 结合 React Query / SWR 使用

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { getDataList, createData } from '@/lib/request/api';

// 使用 React Query
const { data, isLoading, error } = useQuery({
  queryKey: ['data', { page: 1 }],
  queryFn: () => getDataList({ page: 1 }).then(res => res.data)
});

const mutation = useMutation({
  mutationFn: createData,
  onSuccess: () => {
    // 成功后刷新列表
    queryClient.invalidateQueries({ queryKey: ['data'] });
  }
});
```

### 环境变量配置

在 `.env.local` 文件中配置 API 基础 URL：

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

## 类型定义

```typescript
// 响应数据格式
interface ApiResponse<T> {
  code: number;      // 业务状态码
  data: T;          // 响应数据
  message: string;  // 提示信息
  success: boolean; // 是否成功
}

// 错误类型
enum ErrorType {
  NetworkError = 'NetworkError',      // 网络错误
  TimeoutError = 'TimeoutError',      // 超时错误
  AuthError = 'AuthError',            // 认证错误
  PermissionError = 'PermissionError',// 权限错误
  ValidationError = 'ValidationError',// 验证错误
  ServerError = 'ServerError',        // 服务器错误
  UnknownError = 'UnknownError',      // 未知错误
}
```

## 最佳实践

1. **使用预定义 API 接口**：优先使用 `api.ts` 中定义的接口，确保类型安全
2. **统一错误处理**：设置全局未授权回调，避免重复处理
3. **Token 管理**：使用 `tokenManager` 统一管理 Token，手动存储和清除
4. **类型定义**：为 API 响应定义明确的 TypeScript 类型
5. **请求取消**：页面卸载时记得取消未完成的请求

## 扩展

如果需要创建新的 API 接口，在 `api.ts` 中添加：

```typescript
export interface YourApiParams {
  // 参数定义
}

export interface YourApiResponse {
  // 响应定义
}

export const yourApiMethod = (params: YourApiParams) => {
  return request.post<YourApiResponse>('/your-endpoint', params);
};
```