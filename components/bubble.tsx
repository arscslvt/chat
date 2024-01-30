import { cx } from "class-variance-authority";
import React from "react";
import { Message } from "@/context/messages";
import { openai_models } from "@/lib/models";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark as darkCodeTheme,
  nord as lightCodeTheme,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { CopyIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
  const { theme } = useTheme();

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      toast.success("Copied to clipboard.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cx(
        "w-full flex",
        from === "sender" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cx(
          "flex flex-col max-w-full md:max-w-[30rem]",
          from === "sender" ? "items-end" : ""
        )}
      >
        <div
          className={cx(
            "flex items-center gap-1 text-xs pt-0.5",
            from === "sender" ? "pr-2.5" : "pl-2.5"
          )}
        >
          {from === "bot" && (
            <span className="-ml-[7.5px] w-3 h-3 rounded-full bg-primary" />
          )}
          {from === "bot" && <span>{displayName || name}</span>}{" "}
          {/* · <span>{moment(timestamp).fromNow()}</span> */}
        </div>
        <div
          className={cx(
            " sm:text-sm",
            from === "sender"
              ? "border rounded-md rounded-br-[6px] px-4 py-2 bg-zinc-900 text-zinc-100 dark:text-foreground border-zinc-950 shadow-inner shadow-zinc-800"
              : "border-l border-muted ml-2 px-2 mt-2 text-zinc-900 dark:text-foreground"
          )}
        >
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");

                const language = match ? match[1] : "code";

                return match ? (
                  <div className="flex flex-col bg-muted rounded-sm overflow-clip">
                    <div className="pl-4 flex items-center justify-between">
                      <span className="uppercase text-xs text-muted-foreground">
                        {language}
                      </span>
                      <div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size={"icon"}
                              variant={"ghost"}
                              onClick={() =>
                                handleCopyCode(
                                  String(children).replace(/\n$/, "")
                                )
                              }
                            >
                              <CopyIcon className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>

                          <TooltipContent
                            side="left"
                            className="font-sans !px-3 !py-1.5"
                          >
                            Copy code to clipboard
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <SyntaxHighlighter
                      // {...rest}
                      PreTag="div"
                      language={match[1]}
                      customStyle={{
                        borderRadius: "0",
                        marginTop: "4px",
                        marginBlock: "0",
                      }}
                      style={theme === "dark" ? darkCodeTheme : lightCodeTheme}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
            }}
            className={"bubble break-words"}
          >
            {body[0].type === "text"
              ? body[0]["text"]["value"]
              : "Error: Unknown message type."}
          </Markdown>
        </div>
      </div>
    </motion.div>
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
    <motion.div
      className="flex-1 justify-end"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="flex flex-col gap-1 items-center py-4 mt-2">
        <div className="inline-block ml-1 w-8 h-3 aspect-square rounded-full bg-primary animate-shrinking transition-transform" />
        <div className="flex items-center justify-center text-muted-foreground">
          <span className="text-sm">
            <span className="font-medium text-foreground">
              {openai_models[assistant].display_name}
            </span>{" "}
            is {action}
            <span className="font-medium">{object}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};
