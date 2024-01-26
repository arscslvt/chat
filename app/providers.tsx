"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import AsssistantProvider from "@/context/assistant";
import MessagesProvider from "@/context/messages";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AsssistantProvider>
        <MessagesProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </MessagesProvider>
      </AsssistantProvider>
    </>
  );
}
