export const openai_models: {
  [key: string]: {
    id: string;
    display_name: string;
    gpt: string;
    description: string;
  };
} = {
  //   "gpt-3.5-turbo-16k": "GPT-3.5 Turbo",
  //   "gpt-4": "GPT-4",
  //   "gpt-4-1106-preview": "GPT-4 Turbo",
  lucas: {
    id: "asst_Pen2Qdppv1VdieeUtvPQg8XF",
    display_name: "Lucas",
    gpt: "gpt-3.5-turbo-16k",
    description: "Lucas is a chatbot suited for colloquial conversations.",
  },
  elara: {
    id: "asst_bDFBbscqsbQH6s0mZmKBnU4I",
    display_name: "Elara",
    gpt: "gpt-3.5-turbo-16k",
    description: "Elara is an agant suited for business and economic topics.",
  },
  steve: {
    id: "asst_NyMIGJVIRpZDdHTCq1QBTCRH",
    display_name: "Steve",
    gpt: "gpt-4-turbo-preview",
    description:
      "Steve is a super Minecraft player. He knows everything about the game.",
  },
};
