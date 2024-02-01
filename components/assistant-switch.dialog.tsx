import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { openai_models } from "@/lib/models";
import { useLocals } from "@/context/locals";
import { useMessages } from "@/context/messages";

interface AssistantSwitchDialogProps {
  newAssistant: keyof typeof openai_models;
  onCallback: (assistant: keyof typeof openai_models) => void;
  onCancel: () => void;

  threadId?: string;
}

export default function AssistantSwitchDialog({
  newAssistant,
  onCallback,
  onCancel,

  threadId,
}: AssistantSwitchDialogProps) {
  const { favorites } = useLocals();

  const { file, removeFile } = useMessages();

  const beforeCallback = () => {
    if (openai_models[newAssistant].gpt !== "gpt-4") {
      if (file) removeFile(file);
    }

    onCallback(newAssistant);
  };

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to switch assistant?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {threadId && favorites.isFavorite(threadId)
              ? "You can find this conversation in your Favorites anytime."
              : "This will clear your current conversation and start a new one."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => beforeCallback()}>
            Switch Assistant
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
