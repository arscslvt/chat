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
          {/* <Drawer shouldScaleBackground> */}
          <Toaster position="top-center" />
          <TooltipProvider>{children}</TooltipProvider>
          {/* </Drawer> */}
        </MessagesProvider>
      </AsssistantProvider>
    </>
  );
}
