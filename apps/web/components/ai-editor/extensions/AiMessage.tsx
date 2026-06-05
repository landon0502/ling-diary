import {
  Node,
  mergeAttributes,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";

// 自定义 AI 消息组件

import { ReactNodeViewProps } from "@tiptap/react";

const AiMessageComponent = (props: ReactNodeViewProps) => {
  return (
    <NodeViewWrapper className="ai-message-node">
      <div className="ai-header">🤖 AI 助手</div>
      <div className="ai-content">
        {/* 这里渲染 AI 返回的内容 */}
        {props.node.attrs.content}
      </div>
    </NodeViewWrapper>
  );
};

export const AiMessage = Node.create({
  name: "aiMessage",
  group: "block",
  content: "inline*",
  draggable: true,

  addAttributes() {
    return {
      content: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "ai-message" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["ai-message", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AiMessageComponent);
  },
});
