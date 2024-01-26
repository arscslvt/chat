import { NextRequest, NextResponse } from "next/server";
import openai from "../../config/openai";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return Response.json({ error: "Missing assistant ID" }, { status: 400 });
  }
  try {
    const assistant = await openai.beta.assistants.retrieve(id);
    return NextResponse.json({ assistant });
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
  404: "Assistant not found",
};
