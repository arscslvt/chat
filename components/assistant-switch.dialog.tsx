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

interface AssistantSwitchDialogProps {
  newAssistant: keyof typeof openai_models;
  onCallback: (assistant: keyof typeof openai_models) => void;
  onCancel: () => void;
}

export default function AssistantSwitchDialog({
  newAssistant,
  onCallback,
  onCancel,
}: AssistantSwitchDialogProps) {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to switch assistant?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will clear your current conversation and start a new one.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onCallback(newAssistant)}>
            Switch Assistant
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
