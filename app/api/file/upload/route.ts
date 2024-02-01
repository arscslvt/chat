import fs from "fs";
import openai from "../../config/openai";
import { NextResponse } from "next/server";
import { Uploadable } from "openai/uploads.mjs";

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("file");

  if (!file) return Response.json({ error: "Missing file" }, { status: 400 });

  try {
    const upload = await openai.files.create({
      file: file as any,
      purpose: "assistants",
    });

    return NextResponse.json(upload);
  } catch (e) {
    console.error("Error creating a run: ", e);

    return NextResponse.error();
  }
}
