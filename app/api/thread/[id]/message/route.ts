import { Message } from "@/context/messages";
import { toThreadMessages } from "../../../utils/messages-parser";
import openai from "@/app/api/config/openai";
import { NextResponse } from "next/server";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { isLocal } from "@/lib/utils";

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
  }: {
    message: Message["body"];
    assistantId: string;
  } = await req.json();

  if (!message)
    return Response.json({ error: "Missing message body." }, { status: 400 });
  if (!assistantId)
    return Response.json({ error: "Missing assistant ID" }, { status: 400 });

  const threadId = params.id;

  if (!threadId)
    return Response.json({ error: "Missing thread ID" }, { status: 400 });

  try {
    console.log("Sending message to thread: ", threadId);
    console.log("Message: ", message[0].text);

    const msg = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message[0].text.value,
    });

    console.log("Message created: ", msg);
  } catch (e) {
    console.error("Error creating message: ", e);
    return NextResponse.error();
  }

  try {
    const run: Run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    isLocal && console.log("Run created: ", run);

    return NextResponse.json(run);
  } catch (e) {
    console.error("Error creating a run: ", e);

    return NextResponse.error();
  }
}
