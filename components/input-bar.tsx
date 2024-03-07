import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useMessages } from "@/context/messages";
import { useAssistant } from "@/context/assistant";
import { openai_models } from "@/lib/models";

import { AnimatePresence, motion } from "framer-motion";

import { toast } from "sonner";
import { useReferences } from "@/context/references";
import AssistantCapabilitiesDrawer from "./assistant-capabilities.drawer";
import { Drawer, DrawerTrigger } from "./ui/drawer";
import { FileIcon, TrashIcon, UploadIcon } from "@radix-ui/react-icons";
import { Badge } from "./ui/badge";

interface InputBarProps {
  onSend: (message: string) => void;
}

export default function InputBar({ onSend }: InputBarProps) {
  const [value, setValue] = React.useState<string>("");

  const [queriesShadow, setQueriesShadow] = React.useState<
    "left" | "right" | "both"
  >("right");

  const { thread, isWriting, uploadFile, file, removeFile } = useMessages();
  const { assistant } = useAssistant();

  const { references, addReference } = useReferences();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    addReference("messageInput", inputRef);
  }, [inputRef, addReference]);

  const handleMessage = (text?: string) => {
    const _text = text || value;

    if (_text.length === 0) return;
    onSend(_text);
    setValue("");
  };

  const handleSuggestedScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.target as HTMLDivElement;

    if (target.scrollLeft === 0) setQueriesShadow("right");
    else if (target.scrollLeft + target.clientWidth === target.scrollWidth)
      setQueriesShadow("left");
    else setQueriesShadow("both");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (!file) return;

    toast.promise(
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file[0]);
        reader.onload = async () => {
          await uploadFile(file[0]);

          resolve(reader.result);
        };
        reader.onerror = (error) => reject(error);
      }),
      {
        loading: "Uploading file...",
        success: "File uploaded!",
        error: "Failed to upload file",
      }
    );
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <div className="flex flex-col gap-3">
      {file && (
        <div className="flex items-center gap-2 px-3 overflow-y-auto no-scrollbar">
          <Badge
            variant={"outline"}
            className="group hover:pr-0.5 transition-all whitespace-nowrap"
          >
            <FileIcon className="h-4 w-4" />
            <span className="pl-1">{file.filename || "Unknown file"}</span>
            <Button
              size={"icon"}
              variant={"ghost"}
              className="opacity-0 w-0 overflow-clip group-hover:w-9 group-hover:opacity-100 transition-all"
              onClick={() => {
                removeFile(file);
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </Badge>
        </div>
      )}
      {!thread?.id && !file && (
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
                  key={`query-${i}`}
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, delay: i * 0.1 + 1 }}
                >
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="bg-zinc-50 dark:bg-background border-zinc-300 dark:border-border"
                    onClick={() => handleMessage(query)}
                  >
                    {query}
                  </Button>
                </motion.span>
              );
            })}
          </motion.div>
        </div>
      )}
      <div className="flex items-center px-3 min-h-[3rem]">
        <AnimatePresence>
          {openai_models[assistant].gpt === "gpt-4" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5, width: 0 }}
              animate={{ opacity: 1, scale: 1, width: 48, marginRight: 8 }}
              exit={{ opacity: 0, scale: 0.5, width: 0, marginRight: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Tooltip>
                <TooltipContent>
                  Upload a file to send to{" "}
                  {openai_models[assistant].display_name}
                </TooltipContent>
                <TooltipTrigger asChild>
                  <Button
                    size={"icon"}
                    variant={"secondary"}
                    className="relative h-12 w-12 aspect-square ring-1 ring-zinc-300 bg-zinc-50 dark:bg-background dark:ring-border"
                    onClick={() => {
                      if (fileRef.current) fileRef.current.click();
                    }}
                    disabled={isWriting || file ? true : false}
                  >
                    <Badge
                      variant={"outline"}
                      className="absolute -bottom-1 mx-auto !text-[10px] bg-background-dimmed pointer-events-none"
                    >
                      BETA
                    </Badge>
                    <UploadIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
              </Tooltip>
            </motion.span>
          )}
        </AnimatePresence>
        <input
          type="file"
          className="hidden"
          accept="image/*,application/pdf,.docx, .doc, .txt, .csv, .xls, .xlsx"
          ref={fileRef}
          onChange={handleFileUpload}
        />
        <Input
          placeholder={`Ask to ${openai_models[assistant].display_name}`}
          className="h-[3rem] mr-2 flex-1 text-base sm:text-sm bg-zinc-50 dark:bg-background border-zinc-300 dark:border-input shadow-none hover:pl-4 focus:pl-3 focus:shadow-lg focus:!border-zinc-400 focus:!ring-transparent transition-all"
          value={value}
          onInput={(e) => setValue(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleMessage();
              setValue("");
            }
          }}
          disabled={isWriting ? true : false}
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
