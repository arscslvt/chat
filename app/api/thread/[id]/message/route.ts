import { Message } from "@/context/messages";
import { toThreadMessages } from "../../../utils/messages-parser";
import openai from "@/app/api/config/openai";
import { NextResponse } from "next/server";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { isLocal } from "@/lib/utils";
import { MessageCreateParams } from "openai/resources/beta/threads/messages.mjs";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  const {
    message,
    assistantId,
    files,
  }: {
    message: Message["body"];
    assistantId: string;
    files?: MessageCreateParams.Attachment[];
  } = await req.json();

  if (!message)
    return Response.json({ error: "Missing message body." }, { status: 400 });
  if (!assistantId)
    return Response.json({ error: "Missing assistant ID" }, { status: 400 });

  const threadId = params.id;

  if (!threadId)
    return Response.json({ error: "Missing thread ID" }, { status: 400 });

  try {
    const msg = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message[0].text.value,
      attachments: files,
    });
  } catch (e) {
    console.error("Error creating message: ", e);
    return NextResponse.error();
  }

  try {
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      stream: true,
    });

    for await (const event of run) {
      return new Response(JSON.stringify(event), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    // isLocal && console.log("Run created: ", run);

    return NextResponse.json(run);
  } catch (e) {
    console.error("Error creating a run: ", e);

    return NextResponse.error();
  }
}
