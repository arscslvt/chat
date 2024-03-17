"use client";

import React, { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";

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
import {
  DesktopIcon,
  MoonIcon,
  PlusIcon,
  QuestionMarkIcon,
  StarFilledIcon,
  StarIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useMessages } from "@/context/messages";
import { toast } from "sonner";
import { useLocals } from "@/context/locals";
import NewChatDialog from "./new-chat.dialog";
import { useRouter } from "next/navigation";

interface Props {
  title?: string;
  tooltip?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;

  leading?: React.ReactNode | false;
  trailing?: React.ReactNode | false;

  isFavorite?: boolean;
}

export default function Toolbar({
  title,
  tooltip,
  subtitle,
  leading,
  trailing,
}: Props) {
  const { theme, setTheme } = useTheme();
  const [isFavorite, setIsFavorite] = React.useState<boolean>(false);

  const [newChat, setNewChat] = React.useState<boolean>(false);

  const { thread } = useMessages();
  const { favorites } = useLocals();
  const router = useRouter();

  const { data } = useSession();

  useEffect(() => {
    if (thread && favorites.isFavorite(thread.id)) {
      return setIsFavorite(true);
    }

    setIsFavorite(false);
  }, [favorites, thread]);

  const handleFavorite = () => {
    if (!thread?.id) return;

    if (isFavorite) {
      favorites.removeFavorite(thread);
    } else {
      favorites.addFavorite(thread);
    }
  };

  useEffect(() => {
    if (!thread?.id) return;

    const isFavorite = favorites.isFavorite(thread.id);

    setIsFavorite(isFavorite);
  }, [thread?.id, favorites]);

  const handleNewChat = () => {
    if (isFavorite) return router.push("/");

    if (thread?.id && !isFavorite) setNewChat(true);
  };

  return (
    <div className="w-full flex sticky top-0 left-0 bg-background-dimmed backdrop-blur-xl z-20 px-3">
      {newChat && thread && !isFavorite ? (
        <NewChatDialog
          thread={thread}
          onCancel={() => {
            setNewChat(false);
          }}
        />
      ) : null}
      <div className="flex-1 flex justify-start items-center gap-3">
        {leading !== false ? (
          leading ? (
            leading
          ) : (
            <Drawer shouldScaleBackground>
              <DrawerTrigger asChild>
                <span>
                  <Button variant={"ghost"} className="hidden sm:block">
                    {"Learn more"}
                  </Button>
                  <Button
                    variant={"secondary"}
                    size={"icon"}
                    className="sm:hidden"
                  >
                    <QuestionMarkIcon width={22} />
                  </Button>
                </span>
              </DrawerTrigger>
              <LearnMoreDrawer />
            </Drawer>
          )
        ) : null}

        {thread?.id && (
          <Button onClick={handleFavorite} size={"icon"} variant={"secondary"}>
            {isFavorite ? (
              <StarFilledIcon className="w-5 h-5 dark:text-blue-400" />
            ) : (
              <StarIcon className="w-5 h-5" />
            )}
          </Button>
        )}
      </div>
      <div className="flex-1 flex justify-center items-center h-16">
        <div className="flex flex-col items-center text-sm max-w-full">
          {title && (
            <Tooltip>
              <TooltipContent>{tooltip}</TooltipContent>
              <TooltipTrigger className="w-full max-w-full">
                <h1
                  className="font-medium text-ellipsis max-w-full overflow-hidden lg:whitespace-nowrap"
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {title}
                </h1>
              </TooltipTrigger>
            </Tooltip>
          )}
          <div className="text-muted">{subtitle}</div>
        </div>
      </div>
      <div className="flex-1 flex gap-3 justify-end items-center">
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
        {trailing !== false ? (
          trailing ? (
            trailing
          ) : (
            <Tooltip>
              <TooltipContent align="center" side="left">
                Start a new thread
              </TooltipContent>
              <TooltipTrigger asChild>
                <Button
                  size={"icon"}
                  variant={"secondary"}
                  onClick={handleNewChat}
                >
                  <PlusIcon className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
            </Tooltip>
          )
        ) : null}
      </div>
    </div>
  );
}

const LearnMoreDrawer = () => {
  return (
    <DrawerContent className="pb-6 max-w-2xl mx-auto">
      <DrawerHeader>
        <DrawerTitle>{"What's Chat?"}</DrawerTitle>
        <DrawerDescription className="text-center">
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

      <div className="flex justify-center pt-4">
        <Link
          href={"https://openai.com/safety"}
          target="_blank"
          rel="noopener noreferrer"
          title="This will redirect you to OpenAI Safety & Policy page."
          className="text-sm text-muted-foreground hover:underline"
        >
          Learn more about OpenAI Safety & Policy
        </Link>
      </div>
    </DrawerContent>
  );
};
