// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { AUTH_ROUTES } from "./config/routes";
import { TOKEN_KEY } from "./lib/fetch/config";

const API_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "") +
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "");

async function verifyTokenInRedis(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/verifyjwt`, {
      headers: { Cookie: `${TOKEN_KEY}=${token}` },
    });
    if (!res.ok) return false;
    const json = await res.json();
    return json?.data === true;
  } catch {
    return true;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 检查是否命中白名单
  const isPublicPath = AUTH_ROUTES.publicPaths.some((p) =>
    pathname.startsWith(p)
  );

  const sessionToken = request.cookies.get(TOKEN_KEY)?.value;

  // 2. 未登录访问受保护页面 → 跳登录
  if (!sessionToken && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. 已登录 → 向 Redis 校验 token
  if (sessionToken && !isPublicPath) {
    const valid = await verifyTokenInRedis(sessionToken);
    if (!valid) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(TOKEN_KEY);
      return response;
    }
  }

  // 4. 已登录用户访问登录页 → 重定向到首页
  if (sessionToken && pathname === "/login") {
    return NextResponse.redirect(
      new URL(AUTH_ROUTES.defaultRedirect, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
