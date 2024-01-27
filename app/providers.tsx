"use client";

import { Drawer } from "@/components/ui/drawer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AsssistantProvider from "@/context/assistant";
import MessagesProvider from "@/context/messages";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AsssistantProvider>
        <MessagesProvider>
          <Toaster position="top-center" />
          <TooltipProvider>
            <Drawer shouldScaleBackground={true}>{children}</Drawer>
          </TooltipProvider>
        </MessagesProvider>
      </AsssistantProvider>
    </>
  );
}
