interface Model {
  id: string;
  display_name: string;
  gpt: "gpt-3.5" | "gpt-4";
  description: string;
  suggestedQueries?: string[];
  capabilities?: string[];

  avatar?: string;
}

export const openai_models_list: {
  [key: string]: Model;
} = {
  lucas: {
    id: "asst_Pen2Qdppv1VdieeUtvPQg8XF",
    display_name: "Lucas",
    gpt: "gpt-3.5",
    description: "Chatbot suited for colloquial conversations.",
    suggestedQueries: [
      "Tell me a story",
      "What is the best programming language?",
      "Give me a good joke",
      "How can I make a chocolate cake?",
    ],
    capabilities: ["Colloquial talking style", "Code interpretation"],

    avatar: "/assets/bots/lucas/avatar.jpg",
  },
  rose: {
    id: "asst_DxgR8kIjsWatEp6ot7g4OioJ",
    display_name: "Rose",
    gpt: "gpt-4",
    description:
      "Chatbot suited for colloquial conversations. More advanced than Lucas.",
    suggestedQueries: [
      "Suggest me a recipe",
      "Generate a poem",
      "Solve a math problem",
      "What is AI?",
      "What can you do?",
    ],
    capabilities: [
      "Colloquial talking style",
      "Code interpretation",
      "Longer and more coherent responses",
    ],
    avatar: "/assets/bots/rose/avatar.jpg",
  },
  // elara: {
  //   id: "asst_bDFBbscqsbQH6s0mZmKBnU4I",
  //   display_name: "Elara",
  //   gpt: "GPT 3.5",
  //   description: "Elara is an agent suited for business and economic topics.",
  //   suggestedQueries: [
  //     "How to start a business",
  //     "What is the best way to invest money?",
  //     "Optimize web dev business",
  //     "Boost user engagement?",
  //   ],
  // },
  // alex: {
  //   id: "asst_5axiTFCgM6pSzCm39ddnpGjk",
  //   display_name: "Alex",
  //   gpt: "gpt-4",
  //   description:
  //     "Alex is an agent suited for Next.js coding and design topics.",
  //   suggestedQueries: [
  //     "How to make a Next.js app",
  //     "How to use Tailwind CSS in Next.js",
  //     "How to call APIs",
  //     "How to enable TypeScript",
  //   ],
  // },
  // steve: {
  //   id: "asst_NyMIGJVIRpZDdHTCq1QBTCRH",
  //   display_name: "Steve",
  //   gpt: "gpt-4",
  //   description:
  //     "Steve is a super Minecraft player. He knows everything about the game.",
  //   suggestedQueries: [
  //     "How to build a house",
  //     "How to get diamonds",
  //     "How to get to the Nether",
  //     "How to get to the End",
  //   ],
  // },
};

const active_models: string[] = ["lucas", "rose"];

export const openai_models: {
  [key: string]: Model;
} = openai_models_list;
// export const openai_models: {
//   [key: string]: Model;
// } = Object.fromEntries(
//   Object.entries(openai_models_list).filter(([key, value]) =>
//     active_models.includes(key)
//   )
// );
