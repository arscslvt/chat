import React from "react";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { useLocals } from "@/context/locals";
import { openai_models } from "@/lib/models";
import { Button } from "./ui/button";
import Link from "next/link";

export default function FavoritesDrawer() {
  const { favorites } = useLocals();

  return (
    <DrawerContent className="max-w-2xl mx-auto">
      <DrawerHeader>
        <DrawerTitle>
          {favorites.favorites.length > 0 ? "Favorites" : "Empty favorites"}
        </DrawerTitle>
        <DrawerDescription>
          {favorites.favorites.length > 0
            ? " This favorites are only saved locally on this device."
            : "Save your favorite chats by clicking the star icon on the top left corner of Chat page."}
        </DrawerDescription>
      </DrawerHeader>

      <div className="flex flex-col gap-3 px-3 pt-3 pb-8">
        {favorites.favorites.map((f) => (
          <Link href={`/${f.id}`} key={f.id}>
            <div className="flex items-center gap-4 border border-border rounded-md px-4 py-3 hover:border-primary transition-colors duration-75">
              <div className="flex-1">
                <h3 className="font-medium">{f.metadata.name}</h3>
                <div className="text-sm text-muted-foreground">
                  <span className="capitalize">{f.metadata.assistantSlug}</span>{" "}
                  using{" "}
                  <span className="uppercase">
                    {openai_models[f.metadata.assistantSlug].gpt}
                  </span>
                </div>
              </div>
              <div>
                <RemoveButton
                  onClick={() => {
                    favorites.removeFavorite(f);
                  }}
                />
              </div>
            </div>
          </Link>
        ))}
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
