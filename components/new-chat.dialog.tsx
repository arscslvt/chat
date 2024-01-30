import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { openai_models } from "@/lib/models";
import { useLocals } from "@/context/locals";
import { Thread } from "@/context/messages";
import { useRouter } from "next/navigation";

interface NewChatDialogProps {
  onCancel: (e: boolean) => void;

  thread: Thread;
}

export default function NewChatDialog({
  onCancel,
  thread,
}: NewChatDialogProps) {
  const { favorites } = useLocals();
  const router = useRouter();

  const handleAddToFavorites = () => {
    favorites.addFavorite(thread);
    router.push("/");
  };

  return (
    <AlertDialog defaultOpen onOpenChange={(e) => onCancel(e)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to create a new chat?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will clear your current conversation and start a new one.{" "}
            <br />
            If you want to save it for later, you can add it to your Favorites.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Nevermind</AlertDialogCancel>
          <div className="flex flex-col sm:flex-row pb-2 sm:pb-0 gap-2">
            <AlertDialogAction onClick={handleAddToFavorites}>
              Add to Favorites
            </AlertDialogAction>
            <AlertDialogAction onClick={() => router.push("/")}>
              {"I'm sure"}
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
