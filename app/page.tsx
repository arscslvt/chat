"use client";

import Bubble, { BubbleWriting } from "@/components/bubble";
import InputBar from "@/components/input-bar";
import Toolbar from "@/components/toolbar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Message, useMessages } from "@/context/messages";
import { openai_models } from "@/lib/models";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useAssistant } from "@/context/assistant";
import AssistantSwitchDialog from "@/components/assistant-switch.dialog";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const { assistant, setAssistant } = useAssistant();
  const [newAssistant, setNewAssistant] = React.useState<
    keyof typeof openai_models | null
  >(null);

  const { thread, messages, isWriting, addMessage, getThread, resetThread } =
    useMessages();

  const params = useParams<{ id: string }>();

  const [isEmpty, setIsEmpty] = React.useState<boolean>(true);

  useEffect(() => {
    if (messages.length > 0) setIsEmpty(false);
    else setIsEmpty(true);
  }, [messages]);

  const handleMessage = (message: string) => {
    const newMessage: Message = {
      from: "sender",
      body: [
        {
          type: "text",
          text: {
            value: message,
          },
        },
      ],
      name: "You",
      timestamp: new Date(),
    };

    addMessage(newMessage);
  };

  useEffect(() => {
    if (!params.id) {
      resetThread();
    }
  }, [params.id, resetThread]);

  const mainRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({
      top: mainRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [mainRef, messages]);

  const handleAssistantSwitch = (assistant: keyof typeof openai_models) => {
    if (thread?.id) {
      setNewAssistant(assistant as keyof typeof openai_models);
    }

    setAssistant(assistant as keyof typeof openai_models);
  };

  return (
    <main
      className="flex items-center overflow-y-auto w-full min-h-dvh max-h-dvh flex-col"
      ref={mainRef}
    >
      <div className="flex flex-col w-screen flex-1 h-max items-center">
        <Toolbar
          title={thread?.metadata?.name ?? "Empty Thread"}
          tooltip={
            thread ? (
              <p className="text-center">
                ID: {thread?.id}
                <br />
                Created: {dayjs(thread?.created_at).format("MMMM D, YYYY")}
              </p>
            ) : (
              "Type a message to start a new thread."
            )
          }
          subtitle={
            <Select
              defaultValue={openai_models.lucas.id}
              value={assistant as string}
              onValueChange={(assistant) => handleAssistantSwitch(assistant)}
            >
              <SelectTrigger className="border-0 shadow-none text-muted-foreground outline-none h-6 focus:ring-0">
                <span className="mr-1">
                  Talking with{" "}
                  <span className="text-foreground">
                    {openai_models[assistant].display_name}
                  </span>
                </span>
              </SelectTrigger>
              <SelectContent align="center">
                {Object.keys(openai_models).map((model, k) => (
                  <SelectItem key={k} value={model} className="gap-4 flex">
                    <div className="flex gap-1 flex-col">
                      <span>
                        {openai_models[model].display_name}
                        <Badge variant={"outline"} className="font-normal ml-2">
                          {openai_models[model].gpt}
                        </Badge>
                      </span>
                      <span className="text-xs text-muted-foreground max-w-44">
                        {openai_models[model].description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
        <div className="relative z-0 w-screen min-h-full h-max md:w-2/3 lg:w-3/5 xl:w-3/6 flex-1 flex flex-col">
          {newAssistant && (
            <AssistantSwitchDialog
              newAssistant={newAssistant}
              onCallback={(assistant) => {
                setAssistant(assistant);
                resetThread();
              }}
              onCancel={() => {
                setNewAssistant(null);
                setAssistant(
                  thread?.metadata?.assistantSlug as keyof typeof openai_models
                );
              }}
            />
          )}
          <div className="relative flex-1 flex flex-col pt-4 pb-6 px-3 gap-1">
            {isEmpty && (
              <div className="w-full flex-1 flex flex-col justify-center items-center">
                <h1 className="font-medium">Ready to chat?</h1>
                <p className="text-muted-foreground text-sm max-w-60 text-center">
                  Talk with {openai_models[assistant].display_name} by typing a
                  message.
                </p>
              </div>
            )}
            {messages.map((message, k) => (
              <Bubble
                key={k}
                from={message.from}
                displayName={
                  message.from === "bot"
                    ? openai_models[assistant].display_name
                    : "You"
                }
                body={message.body}
                name={message.name}
                timestamp={message.timestamp}
              />
            ))}
            <AnimatePresence>
              {isWriting && (
                <BubbleWriting
                  assistant={assistant}
                  action="typing"
                  object=""
                />
              )}
            </AnimatePresence>
          </div>
          <div className="z-20 flex items-center sticky bottom-0 w-full bg-transparent">
            <div className="absolute z-0 -top-6 left-0 w-full h-10 bg-gradient-to-b via-white from-transparent to-white"></div>
            <div className="relative z-10 bg-background w-full flex-1 pb-4">
              <InputBar onSend={(message) => handleMessage(message)} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
