import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import api from "@/lib/api/config";

interface InputBarProps {
  onSend: (message: string) => void;
}

export default function InputBar({ onSend }: InputBarProps) {
  const [value, setValue] = React.useState<string>("");

  const handleMessage = async () => {
    if (value.length < 0) return;

    onSend(value);
    setValue("");
  };

  return (
    <div className="flex items-center gap-2 h-12">
      <Input
        placeholder="Type a message"
        className="h-full text-base sm:text-sm bg-zinc-50 border-zinc-300 shadow-none hover:pl-4 focus:pl-3 focus:shadow-lg focus:!border-zinc-400 focus:!ring-transparent transition-all"
        value={value}
        onInput={(e) => setValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleMessage();
            setValue("");
          }
        }}
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
              onClick={handleMessage}
              disabled={value.length === 0}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
        </Tooltip>
      </div>
    </div>
  );
}
