// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { AUTH_ROUTES } from "./config/routes";
import { TOKEN_KEY } from "./lib/fetch/config";
import { locales, defaultLocale, LOCALE_COOKIE } from "@/src/i18n/config";

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

function resolveLocale(request: NextRequest): string {
  // 1. Read from cookie
  let locale = request.cookies.get(LOCALE_COOKIE)?.value;

  // 2. Fall back to Accept-Language header
  if (!locale) {
    const acceptLanguage = request.headers.get("accept-language") || "";
    const preferred = acceptLanguage.split(",")[0]?.trim()?.slice(0, 5);
    locale = locales.includes(preferred as (typeof locales)[number])
      ? preferred
      : undefined;
  }

  // 3. Fall back to default
  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    locale = defaultLocale;
  }

  return locale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // -- Locale detection (runs for every request) --
  const locale = resolveLocale(request);

  // 1. 检查是否命中白名单
  const isPublicPath = AUTH_ROUTES.publicPaths.some((p) =>
    pathname.startsWith(p)
  );

  const sessionToken = request.cookies.get(TOKEN_KEY)?.value;

  // 2. 未登录访问受保护页面 → 跳登录
  if (!sessionToken && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.headers.set("x-next-intl-locale", locale);
    return response;
  }

  // 3. 已登录 → 向 Redis 校验 token
  if (sessionToken && !isPublicPath) {
    const valid = await verifyTokenInRedis(sessionToken);
    if (!valid) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(TOKEN_KEY);
      response.headers.set("x-next-intl-locale", locale);
      return response;
    }
  }

  // 4. 已登录用户访问登录页 → 重定向到首页
  if (sessionToken && pathname === "/login") {
    const response = NextResponse.redirect(
      new URL(AUTH_ROUTES.defaultRedirect, request.url)
    );
    response.headers.set("x-next-intl-locale", locale);
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("x-next-intl-locale", locale);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
