import openai from "@/app/api/config/openai";
import { NextResponse } from "next/server";
import { Thread } from "openai/resources/beta/threads/threads.mjs";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
      param: string;
    };
  }
) {
  const {
    content,
    generateFrom,
  }: {
    content?: string;
    generateFrom?: string;
  } = await req.json();

  const backup = await openai.beta.threads.retrieve(params.id);

  const attribute = params.param;

  if (attribute === "title") {
    if (!content && !generateFrom)
      return Response.json(
        {
          error: "Missing 'content' or 'generateFrom' params",
        },
        {
          status: 400,
        }
      );

    try {
      const oldMeta: {
        [key: string]: any;
      } = backup.metadata as any;

      let t: Thread = backup;

      if (content) {
        t = await openai.beta.threads.update(params.id, {
          metadata: {
            ...oldMeta,
            name: content,
          },
        });
      }

      if (generateFrom) {
        const generated = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `
              I want you to act as a title generator for chats. I will provide you with a chat message, and you will generate one attention-grabbing title. Please keep the title concise, simple and under 6 words, and ensure that the meaning is maintained. Replies will utilize the language type of the topic.
              `,
            },
            {
              role: "user",
              content: generateFrom,
            },
          ],
          n: 1,
          max_tokens: 32,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
          stop: ["\n"],
        });

        let title = generated.choices[0].message.content;

        if (title?.startsWith(`"`)) title = title.slice(1);
        if (title?.endsWith(`"`)) title = title.slice(0, -1);

        t = await openai.beta.threads.update(params.id, {
          metadata: {
            ...oldMeta,
            name: title,
          },
        });
      }

      console.log("Someone created a new thread: ", t);

      return NextResponse.json(t);
    } catch (e) {
      console.error("Error updating thread: ", e);
      return NextResponse.error();
    }
  }

  return Response.json(
    {
      error: "Missing edit params",
    },
    {
      status: 400,
    }
  );
}
