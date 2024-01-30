import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useMessages } from "@/context/messages";
import { useAssistant } from "@/context/assistant";
import { openai_models } from "@/lib/models";

import { motion } from "framer-motion";

import { toast } from "sonner";
import { useReferences } from "@/context/references";
import AssistantCapabilitiesDrawer from "./assistant-capabilities.drawer";
import { Drawer, DrawerTrigger } from "./ui/drawer";

interface InputBarProps {
  onSend: (message: string) => void;
}

export default function InputBar({ onSend }: InputBarProps) {
  const [value, setValue] = React.useState<string>("");

  const [queriesShadow, setQueriesShadow] = React.useState<
    "left" | "right" | "both"
  >("right");

  const { thread, isWriting } = useMessages();
  const { assistant } = useAssistant();

  const { references, addReference } = useReferences();

  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    addReference("messageInput", inputRef);
  }, [inputRef, addReference]);

  const handleMessage = () => {
    if (value.length === 0) return;
    onSend(value);
    setValue("");
  };

  const handleSuggestedScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.target as HTMLDivElement;

    if (target.scrollLeft === 0) setQueriesShadow("right");
    else if (target.scrollLeft + target.clientWidth === target.scrollWidth)
      setQueriesShadow("left");
    else setQueriesShadow("both");
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <div className="flex flex-col gap-3">
      {!thread?.id && (
        <div className="relative">
          {queriesShadow !== "left" && (
            <div className="absolute z-20 pointer-events-none right-0 w-5 h-full bg-gradient-to-l from-background to-transparent" />
          )}
          {queriesShadow !== "right" && (
            <div className="absolute z-20 pointer-events-none left-0 w-5 h-full bg-gradient-to-r from-background to-transparent" />
          )}

          <motion.div
            className="relative z-0 flex gap-2 overflow-x-auto px-3 no-scrollbar"
            onScroll={handleSuggestedScroll}
          >
            {/* <motion.span
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            > */}
            {openai_models[assistant].capabilities && (
              <Drawer>
                <DrawerTrigger asChild>
                  <button className="relative h-8 min-w-max rounded-md flex flex-col items-center justify-center overflow-clip">
                    <div className="absolute bg-gradient-to-br min-w-28 max-w-full rounded-full min-h-28 max-h-full from-blue-500 to-fuchsia-600 dark:from-blue-600 dark:to-red-600 animate-rotating-background" />
                    <div className="relative flex flex-1 w-max m-[1.2px] rounded-md bg-zinc-50 dark:bg-background">
                      <div className="bg-zinc-50 dark:bg-background rounded-md flex items-center px-3">
                        <p className="whitespace-nowrap text-xs font-medium">
                          {"Who's "} {openai_models[assistant].display_name}?
                        </p>
                      </div>
                    </div>
                  </button>
                </DrawerTrigger>
                <AssistantCapabilitiesDrawer assistant={assistant} />
              </Drawer>
            )}
            {/* </motion.span> */}
            {openai_models[assistant].suggestedQueries?.map((query, i) => {
              return (
                <motion.span
                  key={i}
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, delay: i * 0.1 + 1 }}
                >
                  <Button
                    key={i}
                    variant={"outline"}
                    size={"sm"}
                    className="bg-zinc-50 dark:bg-background border-zinc-300 dark:border-border"
                    onClick={() => setValue(query)}
                  >
                    {query}
                  </Button>
                </motion.span>
              );
            })}
          </motion.div>
        </div>
      )}
      <div className="flex items-center gap-2 px-3 min-h-[3rem]">
        <Input
          placeholder="Type a message"
          className="h-[3rem] flex-1 text-base sm:text-sm bg-zinc-50 dark:bg-background border-zinc-300 dark:border-input shadow-none hover:pl-4 focus:pl-3 focus:shadow-lg focus:!border-zinc-400 focus:!ring-transparent transition-all"
          value={value}
          onInput={(e) => setValue(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleMessage();
              setValue("");
            }
          }}
          disabled={isWriting}
          ref={inputRef}
        />
        <div className="h-full flex items-center gap-2">
          <Tooltip>
            <TooltipContent>Use your voice to type a message</TooltipContent>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                variant={"secondary"}
                className="h-12 w-12 aspect-square ring-1 ring-zinc-300 bg-zinc-50 dark:bg-background dark:ring-border"
                onClick={() =>
                  toast.info(
                    "This feature is not yet available. Please use the text input for now."
                  )
                }
              >
                <MicrophoneIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
          </Tooltip>
          <Tooltip>
            <TooltipContent>Send this message to AI</TooltipContent>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                className="h-12 w-12 aspect-square"
                onClick={() => handleMessage()}
                disabled={value.length === 0}
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
