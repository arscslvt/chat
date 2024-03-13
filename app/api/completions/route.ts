import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import openai from "../config/openai";

interface Body {
  query: string;
  temperature: number;
  n: number;
  messages: ChatCompletionMessageParam[];
}

export async function POST(req: Request) {
  const { query, messages, n, temperature }: Body = await req.json();

  if (!query) {
    return Response.json({ error: "No query provided" }, { status: 400 });
  }

  const _messages: Body["messages"] = messages || [];

  const completion = await openai.chat.completions.create({
    messages: [
      ..._messages,
      {
        role: "system",
        content: query,
      },
    ],
    model: "gpt-3.5-turbo-0125",
    n,
    temperature,
    stream: true,
  });

  for await (const chunk of completion) {
    return Response.json({ completion: chunk }, { status: 200 });
  }

  return Response.json({ error: "Not implemented" }, { status: 501 });
}
