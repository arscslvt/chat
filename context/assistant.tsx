import { openai_models } from "@/lib/models";
import React from "react";

interface AssistantContextProps {
  assistant: typeof openai_models;
  setAssistant: (name: keyof typeof openai_models) => void;
}

const AssistantContext = React.createContext({} as any);

export default function AsssistantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [assistant, setAssitantState] =
    React.useState<keyof typeof openai_models>("lucas");

  const setAssistant = (name: keyof typeof openai_models) => {
    setAssitantState(name);
  };

  return (
    <AssistantContext.Provider value={{ assistant, setAssistant }}>
      {children}
    </AssistantContext.Provider>
  );
}

export const useAssistant = () => React.useContext(AssistantContext);
