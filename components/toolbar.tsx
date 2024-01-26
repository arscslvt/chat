import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Props {
  title: string;
  tooltip?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
}

export default function Toolbar({ title, tooltip, subtitle }: Props) {
  return (
    <div className="w-full flex sticky top-0 left-0 bg-background-dimmed backdrop-blur-xl z-20 px-3">
      <div className="flex-1 flex justify-start items-center">
        <Button variant={"ghost"}>{"What's this?"}</Button>
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
