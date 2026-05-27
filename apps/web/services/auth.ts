import fetchClient from "@/lib/fetch";

// ==================== 认证相关 ====================

export interface LoginParams {
  name: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

// 登录
export const login = (data: LoginParams) => {
  return fetchClient.post<LoginResponse>("/auth/login", data);
};

// 注册
export const register = (data: RegisterParams) => {
  return fetchClient.post<LoginResponse>("/auth/register", data);
};

// 登出
export const logout = () => {
  return fetchClient.post("/auth/logout");
};

// 刷新 token
export const refreshTokenApi = (refreshToken: string) => {
  return fetchClient.post<{ token: string; refreshToken: string }>(
    "/auth/refresh",
    { refreshToken }
  );
};

// 获取当前用户信息
export const getCurrentUser = () => {
  return fetchClient.get<unknown>("/users/info");
};

// 校验token
export const verifyToken = () => fetchClient.get("/auth/verifyjwt");

// ==================== 用户相关 ====================

export interface UpdateUserParams {
  name?: string;
  email?: string;
  avatar?: string;
}

// 更新用户信息
export const updateUser = (data: UpdateUserParams) => {
  return fetchClient.put("/user/me", data);
};

// 修改密码
export const changePassword = (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  return fetchClient.post("/user/change-password", data);
};

// ==================== 统计 ====================

export interface TrendItem {
  date: string;
  score: number;
}

export interface MistakeItem {
  type: string;
  content: string;
  count: number;
}

// 成长趋势
export const getTrend = () => {
  return fetchClient.get<{ scores: TrendItem[] }>("/statistics/trend");
};

// 常见错误
export const getMistakes = () => {
  return fetchClient.get<{ list: MistakeItem[] }>("/statistics/mistakes");
};
