import React from "react";

export default function MaintenanceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="h-dvh w-screen flex flex-col">{children}</div>;
}
