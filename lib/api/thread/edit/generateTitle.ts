import { Message, Thread } from "@/context/messages";
import api from "../../config";
import { Thread as OpenAIThread } from "openai/resources/beta/threads/threads.mjs";
import { AxiosResponse } from "axios";

export default async function generateTitle(
  threadId: Thread["id"],
  generateFrom: string
): Promise<Thread["metadata"]["name"]> {
  const generated: AxiosResponse<OpenAIThread> = await api
    .post(`/thread/${threadId}/edit/title`, {
      generateFrom,
    })
    .catch((e) => {
      console.error("Failed to generate title: ", e);
      throw new Error("Failed to generate title");
    });

  const meta = generated.data.metadata as any;

  const title = meta?.name;

  if (!title) throw new Error("No title generated");

  return title;
}
