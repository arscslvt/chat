"use client";

import React from "react";
import Rive from "@rive-app/react-canvas";
import { useTheme } from "next-themes";

export default function AnimatedRiveAvatar() {
  const { resolvedTheme } = useTheme();

  if (resolvedTheme === undefined) return null;

  if (resolvedTheme === "dark") {
    return (
      <>
        <Rive
          src="./assets/rive/animated_faces.riv"
          artboard="Dark"
          className="w-24 h-24"
        />
        dark
      </>
    );
  }
  if (resolvedTheme === "light") {
    return (
      <>
        <Rive
          suppressHydrationWarning
          src="./assets/rive/animated_faces.riv"
          artboard="Light"
          className="w-24 h-24"
        />
        light
      </>
    );
  }

  return <></>;
}
