import { Message } from "@/context/messages";
import api from "../config";

export default async function sendMessage(
  body: Message["body"],
  threadId: string,
  assistantId: string
) {
  const res = await api
    .post(`/thread/${threadId}/message`, {
      message: body,
      assistantId,
    })
    .catch((e) => {
      console.error(e);
      throw new Error("Error sending message");
    });

  return res.data;
}
