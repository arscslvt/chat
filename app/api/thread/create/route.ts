import { ThreadCreateParams } from "openai/resources/beta/threads/threads.mjs";
import openai from "../../config/openai";
import { Message } from "@/context/messages";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();

  let _messages: ThreadCreateParams.Message[] = [];

  if (messages) {
    _messages = messages.map((message: Message) => ({
      role: "user",
      content: message.body,
    }));
  }

  try {
    const thread = await openai.beta.threads.create({
      messages: _messages,
      metadata: {
        name: "New Thread",
      },
    });

    console.log("[THREAD] Create: ", thread);

    return NextResponse.json(thread);
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
}
