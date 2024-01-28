"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";

import Link from "next/link";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Badge } from "./ui/badge";
import {
  DesktopIcon,
  MoonIcon,
  PlusIcon,
  QuestionMarkIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";

interface Props {
  title: string;
  tooltip?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
}

export default function Toolbar({ title, tooltip, subtitle }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-full flex sticky top-0 left-0 bg-background-dimmed backdrop-blur-xl z-20 px-3">
      <div className="flex-1 flex justify-start items-center">
        <DrawerTrigger asChild>
          <>
            <Button variant={"ghost"} className="hidden sm:block">
              {"Learn more"}
            </Button>
            <Button variant={"secondary"} size={"icon"} className="sm:hidden">
              <QuestionMarkIcon width={22} />
            </Button>
          </>
        </DrawerTrigger>
        <LearnMoreDrawer />
      </div>
      <div className="flex-1 flex justify-center items-center h-16">
        <div className="flex flex-col items-center text-sm">
          <Tooltip>
            <TooltipContent>{tooltip}</TooltipContent>
            <TooltipTrigger>
              <h1 className="font-medium">{title}</h1>
            </TooltipTrigger>
          </Tooltip>
          <div className="text-muted">{subtitle}</div>
        </div>
      </div>
      <div className="flex-1 flex gap-4 justify-end items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              {theme === "light" ? (
                <SunIcon className="w-5 h-5" />
              ) : theme === "dark" ? (
                <MoonIcon className="w-5 h-5" />
              ) : (
                <DesktopIcon className="w-5 h-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={theme === "light"}
              onClick={() => setTheme("light")}
            >
              <span>Light</span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={theme === "dark"}
              onClick={() => setTheme("dark")}
            >
              <span>Dark</span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={theme === "system"}
              onClick={() => setTheme("system")}
            >
              <span>System</span>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Tooltip>
          <TooltipContent align="center" side="left">
            Start a new thread
          </TooltipContent>
          <TooltipTrigger asChild>
            <Link href={"/"}>
              <Button size={"icon"} variant={"secondary"}>
                <PlusIcon className="w-5 h-5" />
              </Button>
            </Link>
          </TooltipTrigger>
        </Tooltip>
      </div>
    </div>
  );
}

const LearnMoreDrawer = () => {
  return (
    <DrawerContent className="pb-6 !w-full">
      <DrawerHeader className="flex flex-col items-center">
        <DrawerTitle>{"What's Chat?"}</DrawerTitle>
        <DrawerDescription>
          Chat is a tool for generating text and threads from a conversation. It
          uses the OpenAI API to generate text from a first sent message.
        </DrawerDescription>
      </DrawerHeader>

      <div className="flex flex-wrap justify-center gap-2">
        <Badge variant={"outline"} className="font-normal border-green-500">
          {"It's fully free."}
        </Badge>
        <Badge variant={"outline"} className="font-normal border-orange-500">
          GPT Assistants (beta) by OpenAI.
        </Badge>
        <Badge variant={"outline"} className="font-normal border-blue-500">
          <span>
            We{" "}
            <span className="font-medium text-blue-500">{"don't"} store</span>{" "}
            your data and chats.
          </span>
        </Badge>
      </div>
    </DrawerContent>
  );
};
