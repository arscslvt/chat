"use client";

import { Drawer } from "@/components/ui/drawer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AssistantProvider from "@/context/assistant";
import LocalsProvider from "@/context/locals";
import MessagesProvider from "@/context/messages";
import ReferencesProvider from "@/context/references";
import { ThemeProvider } from "@/context/theme";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReferencesProvider>
        <AssistantProvider>
          <LocalsProvider>
            <MessagesProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Toaster position="top-center" />
                <TooltipProvider>
                  <Drawer shouldScaleBackground={true}>{children}</Drawer>
                </TooltipProvider>
              </ThemeProvider>
            </MessagesProvider>
          </LocalsProvider>
        </AssistantProvider>
      </ReferencesProvider>
    </>
  );
}
