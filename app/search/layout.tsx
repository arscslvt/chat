import Toolbar from "@/components/toolbar";
import { Badge } from "@/components/ui/badge";
import React from "react";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Toolbar subtitle={<Badge>Preview-only</Badge>} trailing={false} />
      {children}
    </div>
  );
}
