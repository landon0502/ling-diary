import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

interface LoginRequest {
  name: string;
  password: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { name, password } = body;

    // 验证输入
    if (!name || !password) {
      return NextResponse.json(
        { code: 10001, message: "用户名和密码不能为空" },
        { status: 200 }
      );
    }
    // 调用后端 API
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });

    const data = await response.json();

    if (!response.ok || data.code !== 0) {
      return NextResponse.json(
        { code: data.code, message: data.message || "登录失败" },
        { status: 200 }
      );
    }

    // 设置 cookie
    const cookieStore = await cookies();
    if (data.data?.token) {
      const token = data.data.token.replace(/^Bearer\s+/, "");
      cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { code: 10006, message: "服务器错误，请稍后重试" },
      { status: 200 }
    );
  }
}
