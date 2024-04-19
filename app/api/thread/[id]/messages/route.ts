import openai from "@/app/api/config/openai";
import { NextResponse } from "next/server";
import { MessagesPage } from "openai/resources/beta/threads/messages.mjs";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const messages: MessagesPage = await openai.beta.threads.messages.list(id, {
      order: "asc",
      limit: 100,
    });
    return NextResponse.json(messages);
  } catch (e: any) {
    console.log(e);

    return NextResponse.json({ error: errors[e.status] }, { status: e.status });
  }
}

const errors: {
  [key: number]: string;
} = {
  404: "Thread not found",
};
