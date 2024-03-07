import React, { use, useEffect, useMemo } from "react";
import { Thread, useMessages } from "./messages";
import { toast } from "sonner";

interface LocalsContext {
  favorites: {
    addFavorite: (thread: Thread) => void;
    removeFavorite: (thread: Thread) => void;
    updateFavorite: (thread: Thread) => void;
    isFavorite: (threadId: Thread["id"]) => boolean;
    favorites: Thread[];
  };
}

const LocalsContext = React.createContext<LocalsContext>({} as LocalsContext);

export default function LocalsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [_favorites, setFavorites] = React.useState<Thread[]>([]);

  const maxFavorites = 10;

  const favorites = useMemo(
    () => ({
      addFavorite: (thread: Thread) => {
        if (_favorites.length >= maxFavorites) {
          toast.error(
            "You can only have 10 favorites. Remove some to add more."
          );
          return;
        }
        const newFavorites = [..._favorites, thread];

        setFavorites(newFavorites);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));

        toast.success("Added to favorites.");
      },

      removeFavorite: (thread: Thread) => {
        const newFavorites = _favorites.filter((f) => f.id !== thread.id);

        if (newFavorites.length === _favorites.length) {
          toast.error("Failed to remove from favorites.");
          return;
        }

        setFavorites(newFavorites);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));

        toast("Removed from favorites.");
      },

      updateFavorite: (thread: Thread) => {
        const newFavorites = _favorites.map((f) =>
          f.id === thread.id ? thread : f
        );

        setFavorites(newFavorites);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
      },

      isFavorite: (threadId: Thread["id"]) => {
        return _favorites.some((f) => f.id === threadId);
      },

      get favorites() {
        return _favorites;
      },
    }),
    [_favorites]
  );

  useEffect(() => {
    const localFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(localFavorites);
  }, []);

  return (
    <LocalsContext.Provider value={{ favorites }}>
      {children}
    </LocalsContext.Provider>
  );
}

export const useLocals = () => React.useContext(LocalsContext);
