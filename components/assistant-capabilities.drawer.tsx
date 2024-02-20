import React from "react";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

import { openai_models } from "@/lib/models";
import { Badge } from "./ui/badge";
import { cx } from "class-variance-authority";

interface Props {
  assistant: keyof typeof openai_models;
}

export default function AssistantCapabilitiesDrawer({ assistant }: Props) {
  return (
    <DrawerContent className="max-w-2xl mx-auto">
      <DrawerHeader>
        <DrawerTitle>
          {openai_models[assistant].display_name} Capabilities
        </DrawerTitle>
        <DrawerDescription>
          {openai_models[assistant].description}
        </DrawerDescription>
      </DrawerHeader>

      <div>
        <div className="flex justify-center text-sm pb-2">
          <p>
            Based on{" "}
            <span
              className={cx(
                "uppercase font-medium",
                openai_models[assistant].gpt === "gpt-4" && "vibrant"
              )}
            >
              {openai_models[assistant].gpt}
            </span>{" "}
            model.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 px-6 pt-3 pb-8">
        {openai_models[assistant].capabilities
          ? openai_models[assistant].capabilities?.map((f, i) => (
              <Badge
                key={`capability-${i}`}
                variant={"outline"}
                className="py-2 px-3 text-sm font-medium"
              >
                {f}
              </Badge>
            ))
          : null}
      </div>
    </DrawerContent>
  );
}
