import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Badge } from "./ui/badge";

import { openai_models } from "@/lib/models";
import { useAssistant } from "@/context/assistant";
import { useMessages } from "@/context/messages";

export default function AssistantSwitchSelect() {
  const { assistant, setAssistant } = useAssistant();
  const { thread, resetThread, file } = useMessages();

  const [newAssistant, setNewAssistant] = React.useState<
    keyof typeof openai_models | null
  >(null);

  const handleAssistantSwitch = (assistant: keyof typeof openai_models) => {
    if (thread?.id || file) {
      return setNewAssistant(assistant as keyof typeof openai_models);
    }

    setAssistant(assistant as keyof typeof openai_models);
  };

  return (
    <div>
      <Select
        defaultValue={openai_models.lucas.id}
        value={assistant as string}
        onValueChange={(assistant) => handleAssistantSwitch(assistant)}
      >
        <SelectTrigger className="border-0 shadow-none text-muted-foreground outline-none h-6 focus:ring-0">
          <span className="mr-1">
            Talking with{" "}
            <span className="text-foreground">
              {openai_models[assistant].display_name}
            </span>
          </span>
        </SelectTrigger>
        <SelectContent align="center">
          {Object.keys(openai_models).map((model, k) => (
            <SelectItem
              key={`select-${k}`}
              value={model}
              className="gap-4 flex"
            >
              <div className="flex gap-1 flex-col">
                <span>
                  {openai_models[model].display_name}
                  <Badge
                    variant={"outline"}
                    className="font-normal ml-2 uppercase"
                  >
                    {openai_models[model].gpt}
                  </Badge>
                </span>
                <span className="text-xs text-muted-foreground max-w-44">
                  {openai_models[model].description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
