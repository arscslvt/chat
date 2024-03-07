import React from "react";
import Image, { ImageProps } from "next/image";
import { cx } from "class-variance-authority";
import { Button } from "./button";
import {
  ArrowDownOnSquareIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

export default function SmartImage({
  children,
}: {
  children: React.ReactElement<ImageProps>;
}) {
  const [isOpened, setIsOpened] = React.useState(false);

  const handleSaveImage = () => {
    const link = document.createElement("a");
    link.href = children.props.src as string;
    link.download = "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={cx(
        "group/smartimage !w-max",
        isOpened
          ? "fixed top-0 left-0 !w-screen !h-screen bg-background-dimmed z-[99] grid place-content-center"
          : "relative"
      )}
      onClick={(e) => {
        if (isOpened) {
          if (e.target === e.currentTarget) {
            setIsOpened(false);
          }
        }
      }}
    >
      <div
        className={cx(
          "relative rounded-sm border border-border overflow-clip",
          isOpened && "w-full h-full"
        )}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover/smartimage:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-2">
            <Button size={"icon"} onClick={handleSaveImage}>
              <ArrowDownOnSquareIcon className="h-5 w-5" />
            </Button>
            <Button size={"icon"} onClick={() => setIsOpened(!isOpened)}>
              {isOpened ? (
                <ArrowsPointingInIcon className="h-5 w-5" />
              ) : (
                <ArrowsPointingOutIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {React.cloneElement(children, {
          onClick: () => setIsOpened(true),
          className: isOpened ? "w-full h-full" : children.props.className,
        })}
      </div>
    </div>
  );
}
