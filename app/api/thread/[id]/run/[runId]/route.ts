import openai from "@/app/api/config/openai";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
      runId: string;
    };
  }
) {
  console.log("Requested run info with this params: ", params);

  try {
    const run = await openai.beta.threads.runs.retrieve(
      params.id,
      params.runId
    );

    return NextResponse.json(run);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
