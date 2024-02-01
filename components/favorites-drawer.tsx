import React, { useCallback } from "react";
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
import { Input } from "./ui/input";
import { Thread } from "@/context/messages";
import { cx } from "class-variance-authority";

import { AnimatePresence, motion } from "framer-motion";

export default function FavoritesDrawer() {
  const { favorites } = useLocals();

  const [search, setSearch] = React.useState<string>("");
  const [filteredFavorites, setFilteredFavorites] = React.useState<Thread[]>(
    []
  );

  const [searchFocus, setSearchFocus] = React.useState<boolean>(false);

  const handleFavortiesSearch = useCallback(() => {
    if (search === "") return setFilteredFavorites(favorites.favorites);

    const filtered = favorites.favorites.filter((f) =>
      f.metadata.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredFavorites(filtered);
  }, [search, favorites.favorites]);

  React.useEffect(() => {
    handleFavortiesSearch();
  }, [search, handleFavortiesSearch]);

  return (
    <DrawerContent className="max-w-2xl mx-auto max-h-[80%]">
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

      <div className="px-3 flex justify-center">
        <motion.div
          initial={{ width: "7rem" }}
          animate={{
            width: searchFocus ? "100%" : "7rem",
          }}
        >
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            placeholder="Search"
            className={cx("h-10 text-center w-full text-[16px] sm:text-base")}
          />
        </motion.div>
      </div>

      <div className="overflow-y-scroll">
        <div className="flex flex-col gap-3 px-3 pt-3 pb-8">
          {filteredFavorites.length === 0 && search !== "" ? (
            <div className="py-4 text-center text-muted-foreground">
              No favorites found {":("}
            </div>
          ) : null}
          <AnimatePresence>
            {filteredFavorites.map((f, i) => (
              <motion.div
                key={`favorite-${i}`}
                initial={
                  searchFocus ? { opacity: 0, height: 0, scale: 0.6 } : {}
                }
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.6 }}
                className="overflow-hidden"
              >
                <Link href={`/${f.id}`}>
                  <div className="flex items-center gap-4 border border-border rounded-md px-4 py-3 hover:border-primary transition-colors duration-75">
                    <div className="flex-1">
                      <h3 className="font-medium">{f.metadata.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        <span className="capitalize">
                          {f.metadata.assistantSlug}
                        </span>{" "}
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
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
