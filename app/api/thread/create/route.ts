import { ThreadCreateParams } from "openai/resources/beta/threads/threads.mjs";
import openai from "../../config/openai";
import { Message } from "@/context/messages";
import { NextResponse } from "next/server";
import { openai_models } from "@/lib/models";

export async function POST(req: Request) {
  const {
    messages,
    assistant,
  }: {
    messages: any;
    assistant: {
      id: string;
      slug: keyof typeof openai_models;
    };
  } = await req.json();

  console.log("[THREAD] Create: ", messages, assistant);

  if (!assistant.id || !assistant.slug) {
    return Response.json(
      {
        error: "Missing assistant id or slug",
      },
      {
        status: 400,
      }
    );
  }

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
        assistantId: assistant.id,
        assistantSlug: assistant.slug,
      },
    });

    console.log("[THREAD] Create: ", thread);

    return NextResponse.json(thread);
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
}
