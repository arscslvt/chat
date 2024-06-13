import { Message } from "@/context/messages";
import api from "../config";

export default async function getMessages(
  threadId: string
): Promise<Message[]> {
  const { data } = await api.get(`/thread/${threadId}/messages`).catch((e) => {
    console.error(e);
    throw new Error(e);
  });

  let body = data.body;

  console.log("Retrieved messages: ", body);

  let messages: Message[] = body.data.map((message: any) => ({
    from: message.role === "user" ? "sender" : "bot",
    body: message.content,
    name: message.role === "user" ? "You" : "Bot",
    timestamp: message.created_at,
  }));

  return messages;
}
