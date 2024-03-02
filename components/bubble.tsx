import { cx } from "class-variance-authority";
import React from "react";
import { Message, useMessages } from "@/context/messages";
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
import {
  CopyIcon,
  DotsHorizontalIcon,
  Share2Icon,
} from "@radix-ui/react-icons";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

type BubbleProps = Message & {
  displayName: string;
};

export default function Bubble({ from, body, name, displayName }: BubbleProps) {
  const { theme } = useTheme();
  const { thread, handleTitleGeneration } = useMessages();

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      toast.success("Copied to clipboard.");
    }
  };

  const handleTitle = () => {
    if (!thread?.id) return;
    if (body[0]["type"] !== "text") return;

    toast.promise(
      async () =>
        await handleTitleGeneration(thread.id, body[0]["text"]["value"]),
      {
        loading: "Generating thread title...",
        success: "Thread title generated.",
        error: "Failed to generate thread title.",
      }
    );
  };

  const handleShare = () => {
    if (!thread?.id) return;
    if (body[0]["type"] !== "text") return;

    const message = `Hey, check out this message from the thread "${thread?.metadata?.name}" on Chat by Salvatore Aresco:\n${body[0]["text"]["value"]}.\n\nView the thread: https://chat.salvatorearesco.com/${thread?.id}
    `;

    if (navigator.share) {
      navigator.share({
        title: "A message from Chat by Salvatore Aresco",
        text: message,
      });
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(message);
      toast.message("Message copied to clipboard.", {
        description: "You can now paste it anywhere and share it with others.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cx(
        "group w-full flex",
        from === "sender" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cx(
          "flex items-center gap-3",
          from === "sender" ? "flex-row-reverse" : "flex-row"
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
              "sm:text-[15px]",
              from === "sender"
                ? "border rounded-md rounded-br-[6px] px-4 py-2 bg-zinc-900 text-zinc-100 dark:text-foreground border-zinc-950 shadow-inner shadow-zinc-800"
                : "border-l border-muted ml-2 px-2 mt-2 text-zinc-900 dark:text-foreground"
            )}
          >
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                a({ node, ...props }) {
                  return (
                    <a
                      referrerPolicy="no-referrer"
                      target="_blank"
                      {...props}
                      className="text-primary underline hover:no-underline underline-offset-3 hover:text-blue-500"
                    />
                  );
                },
                ol({ node, ...props }) {
                  const { children, ...rest } = props;

                  const areChildrenImagesOnly = React.Children.toArray(
                    children
                  ).every((child) => {
                    if (React.isValidElement(child) && child.type === "ol") {
                      // If child is an <ol> element, iterate through its children
                      return React.Children.toArray(child.props.children).every(
                        (li) => {
                          // Check if each child of <ol> is an <li> element
                          if (React.isValidElement(li) && li.type === "li") {
                            // Check if each <li> element contains only <img> elements
                            return React.Children.toArray(
                              li.props.children
                            ).every((img) => {
                              return (
                                React.isValidElement(img) && img.type === "img"
                              );
                            });
                          }
                          // If child of <ol> is not an <li>, return false
                          return false;
                        }
                      );
                    }
                    // If child is not an <ol> element, return true
                    return true;
                  });

                  console.log("areChildrenImages", areChildrenImagesOnly);

                  if (areChildrenImagesOnly) {
                    return (
                      <Carousel className="max-w-full !overflow-clip">
                        <CarouselContent className="!max-w-full">
                          {React.Children.toArray(children).map((child, i) => {
                            if (React.isValidElement(child))
                              return (
                                <CarouselItem key={i} className="max-w-max">
                                  {child}
                                </CarouselItem>
                              );
                          })}
                        </CarouselContent>
                      </Carousel>
                    );
                  }

                  return <ol {...rest}>{children}</ol>;
                },
                img({ node, ...props }) {
                  return (
                    <Image
                      width={
                        props?.width
                          ? Number(props?.width)
                          : props?.height
                          ? Number(props?.height)
                          : 200
                      }
                      height={
                        props?.height
                          ? Number(props?.height)
                          : props?.width
                          ? Number(props?.width)
                          : 200
                      }
                      src={props?.src || ""}
                      className="!w-full h-72 !max-w-full object-cover rounded-sm border border-border"
                      alt={props?.alt || "Image from Search Results"}
                    />
                  );
                },
                code(props) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || "");

                  const language = match ? match[1] : "code";

                  return match ? (
                    <div className="flex flex-col bg-muted rounded-sm overflow-clip my-3">
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
                        style={
                          theme === "dark" ? darkCodeTheme : lightCodeTheme
                        }
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
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant={"ghost"}>
                <DotsHorizontalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side={from === "sender" ? "left" : "right"}>
              <DropdownMenuItem
                onClick={() => thread?.id && handleTitle()}
                className="flex flex-col items-start"
              >
                <span>Generate Title</span>
                <p className="text-xs text-muted-foreground">
                  Extract a thread title from this message.
                </p>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between"
                onClick={handleShare}
              >
                Share Message
                <Share2Icon />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
