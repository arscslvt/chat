import openai from "@/app/api/config/openai";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  const { fileId } = params;

  try {
    const remove = await openai.files.del(fileId);

    return NextResponse.json(remove);
  } catch (e) {
    console.error("Error removing the file: ", e);

    return NextResponse.error();
  }
}
