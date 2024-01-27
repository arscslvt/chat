import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { PlusIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Badge } from "./ui/badge";

interface Props {
  title: string;
  tooltip?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
}

export default function Toolbar({ title, tooltip, subtitle }: Props) {
  return (
    <div className="w-full flex sticky top-0 left-0 bg-background-dimmed backdrop-blur-xl z-20 px-3">
      <div className="flex-1 flex justify-start items-center">
        <Drawer shouldScaleBackground direction="bottom">
          <DrawerTrigger asChild>
            <span>
              <Button variant={"ghost"} className="hidden sm:block">
                {"Learn more"}
              </Button>
              <Button variant={"ghost"} size={"icon"} className="sm:hidden">
                <QuestionMarkCircleIcon className="w-5 h-5" />
              </Button>
            </span>
          </DrawerTrigger>
          <LearnMoreDrawer />
        </Drawer>
      </div>
      <div className="flex-1 flex justify-center items-center h-16">
        <div className="flex flex-col items-center text-sm">
          <Tooltip>
            <TooltipContent>{tooltip}</TooltipContent>
            <TooltipTrigger>
              <h1 className="font-medium">{title}</h1>
            </TooltipTrigger>
          </Tooltip>
          <span className="text-muted">{subtitle}</span>
        </div>
      </div>
      <div className="flex-1 flex justify-end items-center">
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
        <Badge variant={"outline"} className="font-normal">
          {"It's fully free."}
        </Badge>
        <Badge variant={"outline"} className="font-normal">
          GPT-3/4 Assistants (beta) by OpenAI.
        </Badge>
        <Badge variant={"outline"} className="font-normal">
          We {"don't"} store any of your data.
        </Badge>
      </div>
    </DrawerContent>
  );
};
