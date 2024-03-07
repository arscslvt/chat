import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { openai_models } from "@/lib/models";

import { motion } from "framer-motion";

import { useAssistant } from "@/context/assistant";

export default function AnimatedAvatar() {
  const { assistant } = useAssistant();

  return (
    <motion.div
      initial={{
        scale: 0.6,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: {
          type: "spring",
          bounce: 0.5,
        },
      }}
      drag
      dragConstraints={{
        top: -20,
        bottom: 20,
        left: -20,
        right: 20,
      }}
      dragElastic={0.05}
      className="pointer-events-auto group hover:cursor-grab active:cursor-grabbing"
      dragSnapToOrigin
    >
      <Avatar className="pointer-events-none h-20 w-20 group-hover:scale-105 group-active:scale-105 transition-transform duration-200 ease-in-out">
        <AvatarImage src={openai_models[assistant].avatar} />
        <AvatarFallback>
          {openai_models[assistant].display_name[0]}
        </AvatarFallback>
      </Avatar>
    </motion.div>
  );
}
