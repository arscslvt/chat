import openai from "@/app/api/config/openai";
import { generateImageFromText } from "@/app/api/tools/image";
import { WeatherData, getWeatherByName } from "@/app/api/tools/weather";
import { NextResponse } from "next/server";

let queuedRuns: any[] = [];

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
  // console.log("Requested run info with this params: ", params);

  try {
    const run = await openai.beta.threads.runs.retrieve(
      params.id,
      params.runId
    );

    if (run.status === "requires_action") {
      console.log("Detected required action: ", run.required_action);

      const requiredAction = run.required_action;
      const toolOutputs = requiredAction?.submit_tool_outputs.tool_calls;

      if (!toolOutputs) {
        throw new Error("Tool outputs not found");
      }

      console.log("Tool outputs: ", toolOutputs);

      toolOutputs.map(async (toolOutput) => {
        const { id, function: fn, type } = toolOutput;

        if (queuedRuns.find((run) => run.id === id)) {
          // console.log("Run already queued: ", id);
          return;
        }

        queuedRuns.push({
          id,
          name: fn.name,
          data: JSON.parse(fn.arguments),
        });

        const runWithToolOutputs = await handleFunctionCalling({
          for: {
            threadId: params.id,
            runId: params.runId,
          },
          fn: {
            id,
            name: fn.name,
            data: JSON.parse(fn.arguments),
          },
        });

        // console.log("Function calling handling response: ", runWithToolOutputs);
      });
    }

    return NextResponse.json(run);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}

interface HandleFunctionProps {
  for: {
    threadId: string;
    runId: string;
  };
  fn: {
    id: string;
    name: string;
    data: any;
  };
}
const handleFunctionCalling = async ({
  for: { threadId, runId },
  fn: { id, name, data },
}: HandleFunctionProps) => {
  let outputData = null;

  console.log("Gathering data for function: ", { id, name, data });

  if (name === "get_weather") {
    const weather = await getWeatherByName(data["location"]);

    try {
      outputData = {
        city: weather.name,
        temperature: Number(weather.main.temp.toFixed(0)),
        description: weather.weather[0].description,

        feels_like: Number(weather.main.feels_like.toFixed(0)),
        humidity: weather.main.humidity,
        windSpeed: weather.wind.speed,
      } as WeatherData;
    } catch (e) {
      console.log("Error while getting weather: ", e);
    }
  }

  if (name === "generate_image_from_text") {
    const image = await generateImageFromText(data["text"]);
    outputData = image;
  }

  try {
    await openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
      tool_outputs: [
        {
          tool_call_id: id,
          output: outputData
            ? JSON.stringify(outputData)
            : JSON.stringify({
                error: "No data found",
              }),
        },
      ],
    });
  } catch (e) {
    console.log("Error while submitting tool outputs: ", e);
  }

  queuedRuns = queuedRuns.filter((run) => run.id !== id);
};
