import { NextResponse } from "next/server";
import openai from "../../config/openai";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const thread = await openai.beta.threads.retrieve(id);
    console.log(thread);

    return NextResponse.json(thread);
  } catch (e: any) {
    console.log(e);

    return NextResponse.json(
      { error: errors[e.status] || "Unknown error" },
      { status: e.status }
    );
  }
}

const errors: {
  [key: number]: string;
} = {
  404: "Thread not found",
};
