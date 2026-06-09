import { NextRequest } from "next/server";
import type { UIMessage } from "@ai-sdk/react";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export const maxDuration = 60; // 💡 强制允许该流式接口最多运行 60 秒，防止被 Next.js 内部拦截器掐断
export const dynamic = "force-dynamic";

/**
 * 将 UIMessage 的 parts 降维映射为后端期待的经典 { role, content } 格式
 * @ai-sdk/react useChat 发送的是 parts 数组，Go 后端只认识 content 字符串
 */
function cleanMessages(messages: UIMessage[]) {
  return messages.map((msg: UIMessage) => {
    let textContent = "";

    if (Array.isArray(msg.parts)) {
      textContent = msg.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("\n");
    }

    return {
      role: msg.role,
      content: textContent,
    };
  });
}

/**
 * 解析 Go 后端返回的 SSE 流，逐块提取文本
 * Go 后端返回格式：data: {"data": "文本内容"}
 *
 * 使用 AsyncGenerator 替代手动 ReadableStream 操作：
 * - 自带背压处理：调用方通过 for-await 按需拉取
 * - 跨 chunk 缓冲：不完整的 SSE 行自动保留到下次迭代
 */
async function* parseGoSSEStream(
  body: ReadableStream<Uint8Array>
): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const parsed = JSON.parse(line.slice(6));
          if (parsed.data) yield parsed.data;
        } catch {
          // 忽略 JSON 解析失败的行
        }
      }
    }

    // 处理流结束后残留的 buffer
    if (buffer.startsWith("data: ")) {
      try {
        const parsed = JSON.parse(buffer.slice(6));
        if (parsed.data) yield parsed.data;
      } catch {
        // ignore
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function POST(req: NextRequest) {
  const { messages, systemContent, systemTitle } = await req.json();

  const cleanedMessages = cleanMessages(messages);
  // 3. 💡 注入灵魂：如果带有日记内容，在数组第一项强行注入上下文环境
  if (systemContent) {
    cleanedMessages.unshift({
      role: "user", // 或者作为第一条隐形 user 消息
      content: `以下是用户刚刚写完的日记内容。请你作为日记倾听助手，结合这段日记内容来回答用户后续的所有提问，给予情感共鸣和建议：\n\n===日记开始===\n标题：${systemTitle}\n 内容：${systemContent}\n===日记结束===`,
    });
  }
  // 请求 Go Gin 后端
  const url = API_BASE_URL + "/api/v1/ai/chat";
  const goResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.get("Authorization") || "",
    },
    body: JSON.stringify({ messages: cleanedMessages }),
  });

  if (!goResponse.ok || !goResponse.body) {
    return new Response("Backend error", { status: 500 });
  }

  // 💡 使用 createUIMessageStream 对接 @ai-sdk/react useChat
  // DefaultChatTransport 默认使用 data stream 协议，要求服务端返回 UIMessageChunk 格式的 SSE 流
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      // 每个消息流需要唯一的 textId，贯穿 text-start / text-delta / text-end
      const textId = "txt_" + Math.random().toString(36).slice(2, 10);

      // 阶段1：标记文本块开始
      writer.write({ type: "text-start", id: textId });

      // 阶段2：逐块写入 Go 后端返回的文本
      for await (const text of parseGoSSEStream(goResponse.body!)) {
        writer.write({ type: "text-delta", id: textId, delta: text });
      }

      // 阶段3：标记文本块结束
      writer.write({ type: "text-end", id: textId });
    },
    onError: (error) => {
      console.error("[ai-chat] 流传输错误:", error);
      return "聊天服务暂时不可用，请稍后重试";
    },
  });

  // 将 UIMessageChunk 流包装为 SSE 格式的 HTTP Response
  return createUIMessageStreamResponse({ stream });
}
