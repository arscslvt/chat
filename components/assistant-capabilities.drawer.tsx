import React from "react";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

import { openai_models } from "@/lib/models";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";

interface Props {
  assistant: keyof typeof openai_models;
}

export default function AssistantCapabilitiesDrawer({ assistant }: Props) {
  return (
    <DrawerContent className="max-w-2xl mx-auto">
      <DrawerHeader>
        <DrawerTitle>
          {openai_models[assistant].display_name} Capabilities
        </DrawerTitle>
        <DrawerDescription>
          {openai_models[assistant].description}
        </DrawerDescription>
      </DrawerHeader>

      <div className="flex flex-wrap justify-center gap-3 px-3 pt-3 pb-8">
        {openai_models[assistant].capabilities
          ? openai_models[assistant].capabilities?.map((f, i) => (
              <Badge
                key={i}
                variant={"outline"}
                className="py-2 px-3 text-sm font-medium"
              >
                {f}
              </Badge>
            ))
          : null}
      </div>
    </DrawerContent>
  );
}

const RemoveButton = ({ onClick }: { onClick: () => void }) => {
  const [confirm, setConfirm] = React.useState<boolean>(false);

  const handleConfirm = () => {
    if (confirm) return onClick();

    setConfirm(true);

    setTimeout(() => {
      setConfirm(false);
    }, 3000);
  };

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleConfirm();
      }}
      variant={confirm ? "destructive" : "secondary"}
    >
      {confirm ? "I'm sure" : "Remove"}
    </Button>
  );
};
