import React, { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Cross1Icon, RocketIcon, Share2Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";

type WhatsNewProps = {
  description: React.ReactNode | string;
  id: string;
  onPage?: "home" | "thread";
};

export default function WhatsNew() {
  const [show, setShow] = React.useState<boolean>(false);

  const { id } = useParams<{ id: string }>();

  const info: WhatsNewProps = {
    description: (
      <>
        You can now save your{" "}
        <span className="font-medium text-blue-500 dark:text-blue-400">
          Favorite Chats
        </span>{" "}
        by clicking the star icon on the top left corner of Chat page.
      </>
    ),
    id: "favorites-feature",
    onPage: "home",
  };

  useEffect(() => {
    if (localStorage.getItem("whats-new")) {
      const whatsNew = JSON.parse(localStorage.getItem("whats-new")!);

      if (whatsNew[info.id] === "dismissed") {
        return setShow(false);
      }
    }

    if (!info.onPage) setShow(true);
    if (info.onPage === "home" && !id) setShow(true);
    if (info.onPage === "thread" && id) setShow(true);
  }, [info.id, info.onPage, id]);

  const handleDismiss = () => {
    setShow(false);

    const whatsNew = JSON.parse(localStorage.getItem("whats-new")!);

    localStorage.setItem(
      "whats-new",
      JSON.stringify({ ...whatsNew, [info.id]: "dismissed" })
    );
  };

  if (show)
    return (
      <Alert variant={"default"} className="relative">
        <RocketIcon className="w-4 h-4" />
        <AlertTitle>
          <span>{"What's new?"}</span>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="absolute top-1 right-1"
            onClick={handleDismiss}
          >
            <Cross1Icon />
          </Button>
        </AlertTitle>
        <AlertDescription>{info.description}</AlertDescription>
      </Alert>
    );
}
