import { Thread } from "@/context/messages";
import api from "../config";
import { openai_models } from "@/lib/models";

export default async function createThread(
  assistant: keyof typeof openai_models
): Promise<Thread> {
  const res = await api.post(`/thread/create`, {
    messages: [],
    assistant: {
      id: openai_models[assistant].id,
      slug: assistant,
    },
  });

  const data: Thread = res.data;

  if (!data) {
    throw new Error("No data returned from API");
  }

  console.log("[API] New Thread created: ", data);

  const _thread: Thread = { ...data, createdAt: data.created_at };

  return _thread;
}
