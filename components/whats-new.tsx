import React, { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Cross1Icon, Share2Icon } from "@radix-ui/react-icons";
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
        You can now{" "}
        <span className="font-medium text-blue-500">share a thread</span>. Just
        click the share button on your browser and send the link to your
        friends.
      </>
    ),
    id: "8e90d8c6-d5d6-47dc-9ffd-1db0f71b74ae",
    onPage: "thread",
  };

  useEffect(() => {
    if (localStorage.getItem(info.id)) {
      if (localStorage.getItem(info.id) === "dismissed") {
        return setShow(false);
      }
    }

    if (!info.onPage) setShow(true);
    if (info.onPage === "home" && !id) setShow(true);
    if (info.onPage === "thread" && id) setShow(true);
  }, [info.id, info.onPage, id]);

  const handleDismiss = () => {
    setShow(false);

    localStorage.setItem(info.id, "dismissed");
  };

  if (show)
    return (
      <Alert variant={"default"} className="relative">
        <Share2Icon className="w-4 h-4" />
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
