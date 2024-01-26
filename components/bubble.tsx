import { cx } from "class-variance-authority";
import React from "react";
import { Message } from "@/context/messages";
import { openai_models } from "@/lib/models";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type BubbleProps = Message & {
  displayName: string;
};

export default function Bubble({
  from,
  body,
  name,
  displayName,
  timestamp,
}: BubbleProps) {
  return (
    <div
      className={cx(
        "w-full flex",
        from === "sender" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cx(
          "flex flex-col max-w-96",
          from === "sender" ? "items-end" : ""
        )}
      >
        <div
          className={cx(
            "flex items-center gap-1 text-xs text-muted-foreground pt-0.5",
            from === "sender" ? "pr-2.5" : "pl-2.5"
          )}
        >
          <span>{displayName || name}</span>
          {/* · <span>{moment(timestamp).fromNow()}</span> */}
        </div>
        <div
          className={cx(
            "border px-4 py-2 rounded-md sm:text-sm",
            from === "sender"
              ? "bg-zinc-900 text-zinc-100 border-zinc-950 shadow-inner shadow-zinc-800"
              : "bg-zinc-50 text-zinc-900 border-zinc-300"
          )}
        >
          <Markdown remarkPlugins={[remarkGfm]}>
            {body[0].type === "text"
              ? body[0]["text"]["value"]
              : "Error: Unknown message type."}
          </Markdown>
        </div>
      </div>
    </div>
  );
}

interface BubbleWritingProps {
  assistant: keyof typeof openai_models;
  action: "typing" | "generating" | "searching";
  object: string;
}

export const BubbleWriting = ({
  assistant,
  action,
  object,
}: BubbleWritingProps) => {
  return (
    <div className="flex-1 justify-end">
      <div className="flex items-center justify-center py-4 text-muted-foreground">
        <span className="text-sm">
          <span className="font-medium">
            {openai_models[assistant].display_name}
          </span>{" "}
          is {action} <span className="font-medium">{object}</span>
        </span>
      </div>
    </div>
  );
};
