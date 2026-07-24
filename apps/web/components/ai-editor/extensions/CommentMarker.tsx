import { Mark, mergeAttributes } from "@tiptap/react";

export const CommentMarker = Mark.create(() => {
  return {
    name: "comment",

    addAttributes() {
      return {
        commentId: {
          default: null,
        },
      };
    },
    addOptions() {
      return {
        HTMLAttributes: {
          class: "comment-mark",
          style: "color: red",
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: "span[data-comment-id]",
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      return [
        "span",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        0,
      ];
    },
  };
});
