import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Chat is under maintenance",
  description:
    "We're under maintenance. Chat servers are currently under maintenance. We are working hard to bring them back online.",
};

export default function MaintenanceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="h-dvh w-screen flex flex-col">{children}</div>;
}
