import React, { useEffect } from "react";
import { Thread } from "./messages";

interface LocalsContext {
  favorites: {
    addFavorite: (thread: Thread) => void;
    removeFavorite: (thread: Thread) => void;
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

  const favorites = {
    addFavorite: (thread: Thread) => {
      const newFavorites = [..._favorites, thread];

      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    },

    removeFavorite: (thread: Thread) => {
      const newFavorites = _favorites.filter((f) => f.id !== thread.id);

      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    },

    isFavorite: (threadId: Thread["id"]) => {
      return _favorites.some((f) => f.id === threadId);
    },

    get favorites() {
      return _favorites;
    },
  };

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
