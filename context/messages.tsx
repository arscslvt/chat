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
import api from "@/lib/api/config";
import { FileObject } from "openai/resources/files.mjs";
import { useLocals } from "./locals";

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
  files?: FileObject[];
}

interface Message {
  id: number;
  from: "bot" | "sender";
  body: {
    type: "text" | "image";
    [key: string]: any;
  }[];
  files?: FileList;
  name: string;
  timestamp: Date | string;
}

type DoingSomething = "thinking" | "typing" | "generating" | "searching";
export type ThinkingType =
  | {
      doing: DoingSomething;
      on?: string;
    }
  | false;

interface MessagesContext {
  thread: Thread | null;
  messages: Message[];
  isWriting: ThinkingType;

  file: FileObject | null;
  getThread: (id: string) => Promise<Message[]>;
  handleTitleGeneration: (threadId: string, message: string) => Promise<void>;
  addMessage: (message: Message) => void;
  resetThread: () => void;
  deleteMessage: (message: Message) => void;
  uploadFile: (file: File) => Promise<FileObject>;
  removeFile: (file: FileObject) => Promise<void>;
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
  const { favorites } = useLocals();

  const [thread, setThread] = React.useState<MessagesContext["thread"]>(null);
  const [messages, setMessages] = React.useState<MessagesContext["messages"]>(
    []
  );

  const [run, setRunning] = React.useState<Run | false>(false);
  const [isWriting, setIsWriting] =
    React.useState<MessagesContext["isWriting"]>(false);

  const [file, setFile] = React.useState<MessagesContext["file"]>(null);

  useEffect(() => {
    if (!run) {
      setIsWriting(false);
      return;
    }

    run.required_action?.submit_tool_outputs.tool_calls.forEach((tool) => {
      console.log("Tool: ", tool);

      if (tool.function.name === "browse") {
        return setIsWriting({
          doing: "searching",
          on: tool.function.arguments,
        });
      }

      if (tool.function.name === "get_weather") {
        return setIsWriting({
          doing: "searching",
          on: "weather",
        });
      }
    });

    setIsWriting({
      doing: "typing",
    });
  }, [run]);

  useEffect(() => {
    if (thread) {
      if (favorites.isFavorite(thread.id)) {
        const fromLocal = favorites.favorites.find((f) => f.id === thread.id);
        setFile(fromLocal?.files?.[0] || null);
      }
    }
  }, [thread, favorites]);

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

  // useEffect(() => {
  //   const retrieveRun = async (
  //     threadId: Thread["id"],
  //     runId: string
  //   ): Promise<"pending" | "satisfied" | "cancelled"> => {
  //     if (run === false) return "cancelled";

  //     const _run = await apiGetRun(threadId, runId).catch((e) => {
  //       console.log("Error getting run: ", e);
  //     });

  //     if (
  //       _run?.status === "cancelling" ||
  //       _run?.status === "failed" ||
  //       _run?.status === "cancelled" ||
  //       _run?.status === "expired"
  //     ) {
  //       console.log("[RUN] Failed: ", _run);
  //       setRunning(false);
  //       return "cancelled";
  //     }

  //     console.log("[RUN] Processing: ", _run);

  //     if (_run?.status === "completed") {
  //       await getThread(threadId).catch((e) => {
  //         console.log("Error updating thread messages: ", e);
  //       });

  //       const inputRef = references["messageInput"];
  //       if (inputRef.current) {
  //         inputRef.current.focus();
  //       }

  //       setRunning(false);
  //       return "satisfied";
  //     }

  //     return "pending";
  //   };

  //   const timer = new Promise((resolve) => setTimeout(resolve, 1500));

  //   if (run && thread) {
  //     const check = async () => {
  //       console.log("Checking run...: ", run);

  //       if (!run) return;

  //       const res = await retrieveRun(thread.id, run.id);
  //       if (res === "cancelled") {
  //         toast.error(
  //           "Something went wrong with your request. Please try again later."
  //         );
  //         return;
  //       }

  //       if (res === "pending") await timer.then(check);

  //       return;
  //     };

  //     check();
  //   }
  // }, [run, thread, getThread, references]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const {
      data,
    }: {
      data: FileObject;
    } = await api
      .post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((e) => {
        throw new Error("Error uploading file: ", e);
      });

    setFile(data);

    if (thread) {
      const updatedThread = {
        ...thread,
        files: thread.files ? [...thread.files, data] : [data],
      };

      setThread(updatedThread);

      handleFavoriteUpdate(updatedThread);
    }

    console.log("Uploaded file: ", data);

    return data;
  };

  const removeFile = async (file: FileObject) => {
    toast.promise(
      async () => {
        const { data } = await api
          .post(`/file/delete/${file.id}`)
          .catch((e) => {
            throw new Error("Error deleting file: ", e);
          });

        if (data) {
          setFile(null);
          if (thread) {
            const updatedThread = {
              ...thread,
              files: thread.files?.filter((f) => f.id !== file.id),
            };

            setThread(updatedThread);

            handleFavoriteUpdate(updatedThread);
          }
        }
      },
      {
        success: "File removed.",
        loading: "Removing file...",
        error: "Error removing file.",
      }
    );
  };

  const addMessage = async (message: Message) => {
    setMessages([...messages, message]);
    setIsWriting({
      doing: "thinking",
    });

    let _thread = thread;

    if (!_thread?.id) {
      const messageText: string = message.body[0]?.text?.value;

      const r = await createThread(messageText).catch((e) => {
        throw new Error("Error creating thread: ", e);
      });

      console.log("Created new thread: ", r);

      _thread = r;

      if (router) router.push(`/${_thread?.id}`);
    }

    console.log("Thread: ", _thread);

    const assistantId = openai_models[assistant].id;

    const body = message.body;

    const receivedMessage = await apiSendMessage(
      body,
      _thread.id,
      assistantId,
      file ? [file] : undefined
    ).catch((e) => {
      setMessages(messages.filter((m) => m !== message));
      setIsWriting(false);
      throw new Error("Error sending message: ", e);
    });

    console.log("Received message stream: ", receivedMessage);

    const files = file ? [file] : undefined;

    if (thread && files) {
      const updatedThread = {
        ...thread,
        files: thread.files ? [...thread.files, ...files] : files,
      };

      setThread(updatedThread);
      handleFavoriteUpdate(updatedThread);
    }

    // setRunning(receivedMessage as unknown as Run);

    console.log("Received message: ", receivedMessage);
  };

  const handleFavoriteUpdate = (thread: Thread) => {
    const isFavorite = favorites.isFavorite(thread.id);

    if (!isFavorite) return;

    favorites.updateFavorite(thread);
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
      console.log("Updated thread with title: ", threadTitle);

      const _thread: Thread = {
        ...thread,
        metadata: {
          ...thread.metadata,
          name: threadTitle,
        },
      };

      setThread(_thread);

      if (favorites.isFavorite(threadId)) {
        favorites.updateFavorite(_thread);
      }
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

  const resetThread = useCallback(async () => {
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
        file,
        getThread,
        handleTitleGeneration,
        addMessage,
        resetThread,
        deleteMessage,
        uploadFile,
        removeFile,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

const useMessages = () => React.useContext(MessagesContext);

export { useMessages };
export type { Message, Thread };
