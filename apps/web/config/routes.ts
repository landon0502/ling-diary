export const AUTH_ROUTES = {
  // 1. 公开页面白名单
  publicPaths: ["/login", "/register", "/api/public"],

  // 2. 鉴权成功后的兜底首页
  defaultRedirect: "/home",
};
