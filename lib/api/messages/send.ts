import { Message } from "@/context/messages";
import api from "../config";
import { FileObject } from "openai/resources/files.mjs";

export default async function sendMessage(
  body: Message["body"],
  threadId: string,
  assistantId: string,
  files?: FileObject[]
) {
  try {
    const res = await api
      .post(
        `/thread/${threadId}/message`,
        {
          message: body,
          assistantId,
          files,
        },
        { responseType: "stream" }
      )
      .catch((e) => {
        console.error(e);
        throw new Error("Error sending message");
      });

    res.data.on("data", (chunk: any) => {
      console.log(chunk.toString());
    });

    return res;
  } catch {
    throw new Error("Error sending message");
  }
}
