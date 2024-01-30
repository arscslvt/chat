import { openai_models } from "@/lib/models";
import React, { useCallback } from "react";

interface AssistantContextProps {
  assistant: keyof typeof openai_models;
  setAssistant: (name: keyof typeof openai_models) => void;
}

const AssistantContext = React.createContext<AssistantContextProps>({} as any);

export default function AssistantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [assistant, setAssitantState] =
    React.useState<keyof typeof openai_models>("lucas");

  const setAssistant = useCallback((name: keyof typeof openai_models) => {
    setAssitantState(name);
  }, []);

  return (
    <AssistantContext.Provider value={{ assistant, setAssistant }}>
      {children}
    </AssistantContext.Provider>
  );
}

export const useAssistant = () => React.useContext(AssistantContext);
