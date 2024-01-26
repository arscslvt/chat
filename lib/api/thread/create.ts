import { Thread } from "@/context/messages";
import api from "../config";

export default async function createThread(): Promise<Thread> {
  const res = await api.post("/thread/create", {
    messages: [],
  });

  const data: Thread = res.data;

  if (!data) {
    throw new Error("No data returned from API");
  }

  console.log("[API] New Thread created: ", data);

  const _thread: Thread = { ...data, createdAt: data.created_at };

  return _thread;
}
