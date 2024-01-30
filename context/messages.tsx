"use client";

import React, { useCallback, useEffect } from "react";
import apiGetThread from "@/lib/api/thread/get";
import apiCreateThread from "@/lib/api/thread/create";
import { useParams, useRouter } from "next/navigation";
import apiGetMessages from "@/lib/api/messages/get";
import apiGetRun from "@/lib/api/run/get";
import apiSendMessage from "@/lib/api/messages/send";
import { useAssistant } from "./assistant";
import { openai_models } from "@/lib/models";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { useReferences } from "./references";
import generateTitle from "@/lib/api/thread/edit/generateTitle";
import { toast } from "sonner";

interface Thread {
  created_at: string;
  id: string;
  object: string;
  createdAt: string;
  metadata: {
    [key: string]: any;
    assistantSlug: string;
    assistantId: string;
    name: string;
  };
}

interface Message {
  from: "bot" | "sender";
  body: {
    type: "text" | "image";
    [key: string]: any;
  }[];
  name: string;
  timestamp: Date | string;
}

interface MessagesContext {
  thread: Thread | null;
  messages: Message[];
  isWriting: boolean;
  getThread: (id: string) => Promise<Message[]>;
  addMessage: (message: Message) => void;
  resetThread: () => void;
  deleteMessage: (message: Message) => void;
}

const MessagesContext = React.createContext<MessagesContext>(
  {} as MessagesContext
);

export default function MessagesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const { assistant, setAssistant } = useAssistant();

  const [thread, setThread] = React.useState<MessagesContext["thread"]>(null);
  const [messages, setMessages] = React.useState<MessagesContext["messages"]>(
    []
  );

  const [run, setRunning] = React.useState<string | false>(false);
  const [isWriting, setIsWriting] = React.useState<boolean>(false);

  useEffect(() => {
    setIsWriting(run ? true : false);
  }, [run]);

  const getThread = useCallback(
    async (id: string): Promise<Message[]> => {
      const thread: Thread = await apiGetThread(id).catch((e) => {
        toast.error("We couldn't find that thread. Please check the URL.");
        throw new Error("Error getting thread.");
      });

      if (thread) {
        setThread(thread);
        if (Object.keys(openai_models).includes(thread.metadata.assistantSlug))
          setAssistant(thread.metadata.assistantSlug);
      }

      const _messages = await apiGetMessages(id).catch((e) => {
        throw new Error("Error getting messages: ", e);
      });

      if (_messages) {
        setMessages(_messages);
        return _messages;
      }

      return [];
    },
    [setAssistant]
  );

  useEffect(() => {
    if (params.id) {
      getThread(params.id)
        .then((messages) => {
          setMessages(messages);
          console.log("Messages to render: ", messages);
        })
        .catch((e) => {
          console.log("Error getting thread: ", e);
          router.replace("/");
        });
    }
  }, [getThread, params.id, router]);

  const { references } = useReferences();

  useEffect(() => {
    const retrieveRun = async (
      threadId: Thread["id"],
      runId: string
    ): Promise<boolean> => {
      const _run = await apiGetRun(threadId, runId).catch((e) => {
        console.log("Error getting run: ", e);
      });

      console.log("[RUN] Processing: ", _run);

      if (_run.status === "completed") {
        await getThread(threadId).catch((e) => {
          console.log("Error updating thread messages: ", e);
        });

        const inputRef = references["messageInput"];
        if (inputRef.current) {
          inputRef.current.focus();
        }
        setRunning(false);
        return true;
      }

      if (
        _run.status == "requires_action" &&
        _run.status == "cancelling" &&
        _run.status == "failed" &&
        _run.status == "cancelled" &&
        _run.status == "expired"
      ) {
        console.log("[RUN] Failed: ", _run);
        setRunning(false);
        return false;
      }

      return false;
    };

    const timer = new Promise((resolve) => setTimeout(resolve, 1500));

    if (run && thread) {
      const check = async () => {
        const res = await retrieveRun(thread.id, run);
        if (!res) await timer.then(check);
      };

      check();
    }
  }, [run, thread, getThread]);

  const addMessage = async (message: Message) => {
    setMessages([...messages, message]);
    setIsWriting(true);

    let _thread = thread;

    if (!_thread?.id) {
      const messageText: string = message.body[0]?.text?.value;

      const r = await createThread(messageText || undefined).catch((e) => {
        throw new Error("Error creating thread: ", e);
      });

      console.log("Created new thread: ", r);

      _thread = r;

      if (router) router.push(`/${_thread?.id}`);
    }

    console.log("Thread: ", _thread);

    const assistantId = openai_models[assistant].id;

    const body = message.body;

    const receivedMessage: Run = await apiSendMessage(
      body,
      _thread.id,
      assistantId
    ).catch((e) => {
      setMessages(messages.filter((m) => m !== message));
      throw new Error("Error sending message: ", e);
    });

    setRunning(receivedMessage.id);

    console.log("Received message: ", receivedMessage);
  };

  const handleTitleGeneration = async (threadId: string, message: string) => {
    // set a promise timeout of 2 seconds and await it before generating the title
    const timer = new Promise((resolve) => setTimeout(resolve, 2000));

    const messageText: string = message;

    console.log("Generating title from Message text: ", messageText);

    const threadTitle = await generateTitle(threadId, messageText).catch(
      (e) => {
        throw new Error("Error generating title: ", e);
      }
    );

    console.log("Generated title: ", threadTitle);

    if (threadTitle && thread?.metadata) {
      const _thread = thread as Thread;
      _thread.metadata.name = threadTitle;

      setThread(_thread);
    }
  };

  const createThread = async (fromMessage?: string): Promise<Thread> => {
    let thread = await apiCreateThread(assistant).catch((e) => {
      throw new Error("Error creating thread: ", e);
    });
    if (thread) {
      setThread(thread);
    }

    if (fromMessage) handleTitleGeneration(thread.id, fromMessage);
    return thread;
  };

  const resetThread = useCallback(() => {
    setThread({} as Thread);
    setMessages([]);

    router.replace("/");
  }, [router]);

  const deleteMessage = (message: Message) => {
    setMessages(messages.filter((m) => m !== message));
  };

  return (
    <MessagesContext.Provider
      value={{
        thread,
        messages,
        isWriting,
        getThread,
        addMessage,
        resetThread,
        deleteMessage,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

const useMessages = () => React.useContext(MessagesContext);

export { useMessages };
export type { Message, Thread };
