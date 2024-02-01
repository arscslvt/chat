import React from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { openai_models } from "@/lib/models";
import { useAssistant } from "@/context/assistant";
import { useMessages } from "@/context/messages";
import AssistantSwitchDialog from "./assistant-switch.dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function AssistantSwitchTabs() {
  const { assistant, setAssistant } = useAssistant();
  const { thread, resetThread } = useMessages();

  const [newAssistant, setNewAssistant] = React.useState<
    keyof typeof openai_models | null
  >(null);

  const handleAssistantSwitch = (assistant: keyof typeof openai_models) => {
    if (thread?.id) {
      return setNewAssistant(assistant as keyof typeof openai_models);
    }

    setAssistant(assistant as keyof typeof openai_models);
  };

  return (
    <div>
      {newAssistant && (
        <AssistantSwitchDialog
          newAssistant={newAssistant}
          threadId={thread?.id}
          onCallback={(assistant) => {
            setAssistant(assistant);
            resetThread();
          }}
          onCancel={() => {
            setNewAssistant(null);
            setAssistant(
              thread?.metadata?.assistantSlug as keyof typeof openai_models
            );
          }}
        />
      )}
      <Tabs
        defaultValue={assistant as string}
        value={assistant as string}
        onValueChange={(value) =>
          handleAssistantSwitch(value as keyof typeof openai_models)
        }
      >
        <TabsList>
          {Object.keys(openai_models).map((assistant, i) => (
            <TabsTrigger value={assistant} key={i}>
              {openai_models[assistant].display_name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
