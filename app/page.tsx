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
import { AnimatePresence, motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon, StarIcon } from "@radix-ui/react-icons";
import WhatsNew from "@/components/whats-new";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import FavoritesDrawer from "@/components/favorites-drawer";
import { Button } from "@/components/ui/button";

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
          title={thread?.id ? "Chat" : "Start a new chat"}
          tooltip={
            thread ? (
              <div className="text-center flex flex-col gap-1.5">
                {thread?.metadata?.name && (
                  <p className="font-medium">{thread?.metadata?.name}</p>
                )}
                <div className="!text-muted-foreground">
                  <p>{dayjs(thread?.created_at).format("MMMM D, YYYY")}</p>
                </div>
              </div>
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
                        <Badge
                          variant={"outline"}
                          className="font-normal ml-2 uppercase"
                        >
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

        <div className="px-3">
          <WhatsNew />
        </div>

        <div className="relative z-0 w-screen min-h-full h-max md:w-2/3 lg:w-3/5 xl:w-3/6 flex-1 flex flex-col">
          {newAssistant && (
            <AssistantSwitchDialog
              newAssistant={newAssistant}
              threadId={thread?.id}
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
          <div className="relative flex-1 flex flex-col pt-4 pb-6 px-3 gap-3">
            {openai_models[assistant].gpt === "gpt-4" && (
              <Alert>
                <InfoCircledIcon className="w-4 h-4" />
                <AlertTitle>{"You're using a GPT-4 based Persona."}</AlertTitle>
                <AlertDescription>
                  This model is best suited for long-form text generation.{" "}
                  <br />
                  Use it only if you need more precise and longer responses.
                </AlertDescription>
              </Alert>
            )}
            <AnimatePresence>
              {isEmpty ? (
                <motion.div
                  className="w-full flex-1 flex flex-col justify-center items-center"
                  animate={{ scale: 1, opacity: 1, flex: 1 }}
                  exit={{
                    scale: 0.6,
                    opacity: 0,
                    flex: 0,
                  }}
                >
                  <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "circInOut" }}
                    exit={{ opacity: 0, y: -6 }}
                    className="font-medium"
                  >
                    Ready to chat?
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "backOut", delay: 0.4 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="text-muted-foreground text-sm max-w-60 text-center"
                  >
                    Talk with {openai_models[assistant].display_name} by typing
                    a message.
                  </motion.p>

                  <div className="pt-6">
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant={"outline"} className="gap-1">
                          <StarIcon className="w-3.5 h-3.5" />
                          Favorite Chats
                        </Button>
                      </DrawerTrigger>
                      <FavoritesDrawer />
                    </Drawer>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col">
                  {thread?.metadata?.name !== "New Thread" && (
                    <motion.div
                      className="flex flex-col gap-1.5 items-center justify-start overflow-hidden h-0 line-clamp-2"
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 60 }}
                      transition={{ duration: 0.4, ease: "circInOut" }}
                      exit={{ opacity: 0, y: -6, height: 0 }}
                    >
                      <p className="pt-2 text-sm text-muted-foreground">
                        {thread?.metadata?.name}
                      </p>
                    </motion.div>
                  )}
                  <div className="flex flex-col gap-3">
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
                  </div>
                </div>
              )}
            </AnimatePresence>
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
            <div className="absolute z-0 -top-6 left-0 w-full h-10 bg-gradient-to-b via-background from-transparent to-background"></div>
            <div className="relative z-10 bg-background w-full flex-1 pb-4">
              <InputBar onSend={(message) => handleMessage(message)} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
