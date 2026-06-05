# AiChat 组件文档

现代化 AI 聊天组件，基于 React + Tailwind CSS v4 + Shadcn UI，参考 ChatGPT / Claude 风格设计，支持深色/浅色模式完美适配。

## 📁 文件结构

```
components/chat/
├── index.tsx             # 主组件入口
├── types.ts              # 共享类型定义
├── ChatHeader.tsx        # 顶部 Header（模型选择 + 清空按钮）
├── ChatEmptyState.tsx    # 空状态（Logo + 欢迎语 + 预设提示卡片）
├── ChatMessage.tsx       # 消息气泡（用户/AI + 代码块 + 操作栏）
├── ChatInput.tsx         # 底部输入区（多行输入 + 上传 + 发送）
├── TypingIndicator.tsx   # AI 打字指示器动效
└── README.md             # 本文档
```

## 🚀 快速开始

### 最简用法（开箱即用）

组件内置了默认模型列表、预设提示卡片和完整的 mock 对话流程，不传任何 props 即可预览 UI：

```tsx
import { AiChat } from "@/components/chat";

export default function Page() {
  return (
    <div className="h-screen">
      <AiChat />
    </div>
  );
}
```

> ⚠️ 需要确保父容器有明确的高度（如 `h-screen`、`h-full` 或 `h-[600px]`），组件内部使用 `h-full` 撑满容器。

### 对接业务 API

```tsx
import { AiChat } from "@/components/chat";
import type { Message, Model } from "@/components/chat";

export default function Page() {
  const myModels: Model[] = [
    { id: "my-gpt", name: "我的 GPT", provider: "自定义" },
  ];

  const handleSend = async (content: string, modelId: string) => {
    // 调用你的 API，返回 AI 回复
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: content, model: modelId }),
    });
    // ...
  };

  return (
    <div className="h-screen">
      <AiChat
        models={myModels}
        onSend={handleSend}
        isLoading={false}       // 由你的请求状态控制
      />
    </div>
  );
}
```

## 📋 Props 详解

### `AiChatProps`

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `models` | `Model[]` | 内置 5 个模型 | 可选的 AI 模型列表 |
| `defaultModel` | `string` | `"gpt-4o"` | 默认选中的模型 ID |
| `initialMessages` | `Message[]` | `[]` | 初始消息列表（如从服务端恢复历史记录） |
| `isLoading` | `boolean` | `undefined` | 外部控制加载状态。不传时组件内部自动模拟 |
| `onSend` | `(content, modelId) => void` | `undefined` | 发送消息回调。不传时使用内置 mock 逻辑 |
| `onClear` | `() => void` | `undefined` | 清空对话回调 |
| `onRegenerate` | `(messageId) => void` | `undefined` | 重新生成回调 |
| `onFeedback` | `(messageId, type) => void` | `undefined` | 赞/踩反馈回调，`type` 为 `"up"` 或 `"down"` |
| `presetPrompts` | `PresetPrompt[]` | 4 个内置预设 | 自定义空状态预设提示卡片 |
| `logo` | `ReactNode` | 默认 Sparkles 图标 | 自定义品牌 Logo |
| `welcomeTitle` | `string` | `"有什么可以帮助你的？"` | 空状态欢迎标题 |
| `className` | `string` | `undefined` | 自定义最外层容器类名 |

### 相关类型

```ts
interface Message {
  id: string;           // 唯一标识
  role: "user" | "assistant";
  content: string;      // 消息文本（支持 Markdown 代码块）
  timestamp: number;    // 毫秒时间戳
}

interface Model {
  id: string;           // 唯一标识
  name: string;         // 显示名称
  provider: string;     // 提供商名称
}

interface PresetPrompt {
  id: string;           // 唯一标识
  title: string;        // 卡片标题
  description: string;  // 卡片描述
  prompt: string;       // 点击后填入输入框的文本
}
```

## 🎨 使用场景

### 1. 纯 UI 预览（默认）

不传 `onSend`、`isLoading`，组件自动处理消息流——发送消息后延迟 0.8~2 秒显示模拟回复，适合原型演示和 UI 评审。

```tsx
<AiChat />
```

### 2. 对接真实 API

传入 `onSend` + `isLoading` + `initialMessages` 获得完全受控的聊天体验：

```tsx
const [messages, setMessages] = useState<Message[]>([]);
const [loading, setLoading] = useState(false);

const handleSend = async (content: string, modelId: string) => {
  const userMsg: Message = {
    id: crypto.randomUUID(),
    role: "user",
    content,
    timestamp: Date.now(),
  };
  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages: [...messages, userMsg], model: modelId }),
  });
  const data = await res.json();

  const aiMsg: Message = {
    id: crypto.randomUUID(),
    role: "assistant",
    content: data.reply,
    timestamp: Date.now(),
  };
  setMessages((prev) => [...prev, aiMsg]);
  setLoading(false);
};

<AiChat
  initialMessages={messages}
  isLoading={loading}
  onSend={handleSend}
/>
```

### 3. 自定义预设提示词

```tsx
import { Sparkles, Globe, Palette, Shield } from "lucide-react";

const myPrompts = [
  {
    id: "translate",
    title: "翻译助手",
    description: "中英互译，支持多语种",
    prompt: "请把以下内容翻译成英文：",
  },
  {
    id: "ui-design",
    title: "UI 设计",
    description: "Tailwind / Shadcn 组件生成",
    prompt: "请帮我用 Tailwind CSS 设计一个登录页面。",
  },
];

<AiChat presetPrompts={myPrompts} />
```

### 4. 自定义品牌

```tsx
<AiChat
  logo={
    <img
      src="/logo.svg"
      alt="My App"
      className="size-12 rounded-xl"
    />
  }
  welcomeTitle="你好，我是 Ling AI 助手"
/>
```

### 5. 从服务端恢复历史记录

```tsx
// pages/chat.tsx (SSR / RSC)
const history = await fetchChatHistory(sessionId);

<AiChat initialMessages={history} />
```

## 🧩 子组件导出

除了 `AiChat`，以下子组件也可以单独使用：

```tsx
import {
  ChatHeader,
  ChatEmptyState,
  ChatMessage,
  ChatInput,
  TypingIndicator,
  CodeBlock,
  MessageContent,
  DEFAULT_PROMPTS,
} from "@/components/chat";
// 注意：部分子组件需从对应文件导入，请按需引用
```

## 🎯 交互行为

| 操作 | 行为 |
|------|------|
| **Enter** | 发送消息（输入框需有内容） |
| **Shift + Enter** | 换行 |
| **点击预设卡片** | 将 prompt 文本填入输入框 |
| **点击清空按钮** | 清除所有消息 + 重置输入框 |
| **点击复制（消息级）** | 复制整条 AI 回复文本 |
| **点击复制（代码块级）** | 仅复制该代码块内容，图标变为 ✓ 2 秒 |
| **点击重新生成** | 替换最后一条 AI 回复 |
| **点击 👍 / 👎** | 切换反馈状态（再次点击取消） |
| **新消息到达** | 聊天区自动滚动到底部 |

## 🎨 样式定制

### 主题适配

组件完全使用 CSS 变量（`--background`、`--foreground`、`--primary` 等），自动适配项目的浅色/深色主题。只需确保：

1. 根布局有 `.dark` class 切换逻辑（项目已通过 `@teispace/next-themes` 支持）
2. 全局 CSS 定义了对应的 CSS 变量（项目已配置）

### 覆盖样式

通过 `className` 传入自定义类名：

```tsx
<AiChat className="[--background:oklch(0.99_0.01_260)] rounded-2xl border" />
```

### 修改默认模型

```tsx
<AiChat
  models={[
    { id: "my-model", name: "我的模型", provider: "内部" },
  ]}
  defaultModel="my-model"
/>
```

## 📐 布局说明

```
┌─────────────────────────────────────────────┐
│  ChatHeader (sticky top-0, h-12)            │
│  [模型 Select ▼]              [🗑 清空]     │
├─────────────────────────────────────────────┤
│                                             │
│  Chat Area (flex-1, overflow-y-auto)        │
│                                             │
│  ┌─ ChatEmptyState（无消息时）───────────┐  │
│  │       [Logo]                          │  │
│  │    欢迎标题                            │  │
│  │  ┌──────────┐ ┌──────────┐           │  │
│  │  │ 预设卡片1 │ │ 预设卡片2 │           │  │
│  │  └──────────┘ └──────────┘           │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌─ 用户消息（靠右）──────────────────┐    │
│  │        ┌──────────────────┐        │    │
│  │        │ Card 气泡         │        │    │
│  │        └──────────────────┘        │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌─ AI 消息（靠左）──────────────────┐     │
│  │ [Avatar]  消息正文                 │     │
│  │           [复制] [重生成] [👍] [👎]│     │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌─ TypingIndicator（加载中）─────────┐    │
│  │ [Avatar]  ● ● ●                     │    │
│  └────────────────────────────────────┘    │
│                                             │
├─────────────────────────────────────────────┤
│  ChatInput (border-t, bg-background/80)     │
│  [📎] [🖼] [_______________] [↑]           │
│         AI 生成内容仅供参考...              │
└─────────────────────────────────────────────┘
```

## 🔧 依赖

所有依赖均已存在项目中，无需额外安装：

- `react` (19.x)
- `lucide-react` — 图标
- `class-variance-authority` + `clsx` + `tailwind-merge` — 样式工具
- `radix-ui` — Select / Tooltip 底层原语
- Shadcn UI 组件：`Button`、`Card`、`Select`、`Textarea`、`Tooltip`

## 📝 注意事项

1. **代码块解析**：组件自行解析 ```fence 语法，无需 `react-markdown`。代码块始终以暗色背景渲染（`bg-zinc-950`），与当前主题无关。
2. **无障碍**：所有交互元素均有 `aria-label`，加载状态有 `role="status"` + `aria-label`。
3. **文件/图片上传**：`ChatInput` 中的上传功能仅做 UI 展示和占位回调（在输入框追加文件名），需要对接真实上传逻辑时实现 `onFileUpload` / `onImageUpload`。
4. **ID 生成**：演示模式使用 `Date.now() + Math.random()` 生成 ID，生产环境建议使用 `crypto.randomUUID()`。
5. **高度要求**：组件使用 `h-full`，需确保父容器有明确高度。
