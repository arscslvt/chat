import AutoScroller from "@/components/search/autoscroller";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CameraIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React, { ReactNode, useEffect, useRef } from "react";

export default function SearchPage() {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 flex flex-col gap-8 justify-center items-center">
        <div className="flex justify-center items-center flex-col gap-3">
          <Badge variant={"secondary"}>Powered by ChatAI</Badge>
          <h1 className="font-bold text-4xl">Web Search</h1>
        </div>

        <div className="flex flex-col items-center w-full px-6">
          <div className="flex w-full md:w- lg:w-[580px] gap-2">
            <Button className="h-12 w-12" variant={"secondary"}>
              <CameraIcon width={20} height={20} />
            </Button>
            <Input
              placeholder="Search on the web"
              className="h-12 px-4 w-full flex-1"
            />
            <Button className="h-12 w-12">
              <MagnifyingGlassIcon
                width={20}
                height={20}
                className="!w-5 !h-5"
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="pb-6 flex flex-col gap-3">
        <AutoScroller>
          <div className="px-6 max-w-full flex gap-2">
            <Button size={"sm"} variant={"outline"}>
              😶 How many times does the word {'"chat"'} appear on the web?
            </Button>
            <Button size={"sm"} variant={"outline"}>
              🧑‍💻 What is the most popular programming language?
            </Button>
            <Button size={"sm"} variant={"outline"}>
              💬 Where can I find the best AI chatbot?
            </Button>
            <Button size={"sm"} variant={"outline"}>
              🐻 Do a bear have a tail?
            </Button>
            <Button size={"sm"} variant={"outline"}>
              🐢 Make a reaserch about turtles
            </Button>
          </div>
        </AutoScroller>
        <AutoScroller>
          <div className="px-6 max-w-full flex gap-2">
            <Button size={"sm"} variant={"outline"}>
              🌱 Describe the process of photosynthesis
            </Button>
            <Button size={"sm"} variant={"outline"}>
              🌍 What is the capital of France?
            </Button>
            <Button size={"sm"} variant={"outline"}>
              🌊 What is the deepest ocean?
            </Button>
            <Button size={"sm"} variant={"outline"}>
              🌋 What is the largest volcano in the world?
            </Button>
            <Button size={"sm"} variant={"outline"}>
              🌠 What is the closest star to Earth?
            </Button>
          </div>
        </AutoScroller>
      </div>
    </div>
  );
}
