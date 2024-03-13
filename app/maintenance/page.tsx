"use client";

import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";

import { get } from "@vercel/edge-config";
import api from "@/lib/api/config";
import { UpdateIcon } from "@radix-ui/react-icons";

export default function MaintenancePage() {
  const router = useRouter();

  const checkMaintenance = async () => {
    const maintenance = await api.get("/status");
    console.log(maintenance);

    if (maintenance.status === 200) {
      router.replace("/");
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="flex flex-col items-center gap-9">
        <div className="flex flex-col items-center gap-3">
          <h1 className="font-medium text-2xl">{"We're under maintenace."}</h1>
          <div className="text-muted-foreground text-sm">
            <p>Chat servers are currently under maintenance.</p>
            <p>We are working hard to bring them back online.</p>
          </div>
        </div>

        <Button onClick={checkMaintenance} className="gap-0.5">
          <UpdateIcon width={20} />
          Refresh
        </Button>
      </div>
    </div>
  );
}
