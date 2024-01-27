import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import api from "@/lib/api/config";
import { useMessages } from "@/context/messages";
import { useAssistant } from "@/context/assistant";
import { openai_models } from "@/lib/models";

interface InputBarProps {
  onSend: (message: string) => void;
}

export default function InputBar({ onSend }: InputBarProps) {
  const [value, setValue] = React.useState<string>("");

  const [queriesShadow, setQueriesShadow] = React.useState<
    "left" | "right" | "both"
  >("right");

  const { thread } = useMessages();
  const { assistant } = useAssistant();

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleMessage = (message?: string) => {
    if (!message && value.length < 0) return;

    onSend(message || value);
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
            <div className="absolute right-0 w-5 h-full bg-gradient-to-l from-background to-transparent" />
          )}
          {queriesShadow !== "right" && (
            <div className="absolute left-0 w-5 h-full bg-gradient-to-r from-background to-transparent" />
          )}

          <div
            className="flex gap-2 overflow-x-auto px-3 no-scrollbar"
            onScroll={handleSuggestedScroll}
          >
            {openai_models[assistant].suggestedQueries?.map((query, i) => {
              return (
                <Button
                  key={i}
                  variant={"outline"}
                  size={"sm"}
                  className="bg-zinc-50 border-zinc-300"
                  onClick={() => setValue(query)}
                >
                  {query}
                </Button>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 px-3 min-h-[3rem]">
        <Input
          placeholder="Type a message"
          className="h-[3rem] flex-1 text-base sm:text-sm bg-zinc-50 border-zinc-300 shadow-none hover:pl-4 focus:pl-3 focus:shadow-lg focus:!border-zinc-400 focus:!ring-transparent transition-all"
          value={value}
          onInput={(e) => setValue(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleMessage();
              setValue("");
            }
          }}
          ref={inputRef}
        />
        <div className="h-full flex items-center gap-2">
          <Tooltip>
            <TooltipContent>Use your voice to type a message</TooltipContent>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                variant={"secondary"}
                className="h-12 w-12 aspect-square ring-1 ring-zinc-300 bg-zinc-50"
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
