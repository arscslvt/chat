import { Message } from "@/context/messages";
import { ThreadCreateParams } from "openai/resources/beta/threads/threads.mjs";

export const toThreadMessages = (
  messages: Message[]
): ThreadCreateParams.Message[] => {
  let _messages: ThreadCreateParams.Message[] = [];

  if (messages) {
    _messages = messages.map((message: Message) => ({
      role: "user",
      content: message.body.toString(), // Convert the content to a string
    }));
  }

  return _messages;
};
