"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

import api from "@/lib/api/config";
import { UpdateIcon } from "@radix-ui/react-icons";

import { AnimatePresence, motion, delay } from "framer-motion";
import { cx } from "class-variance-authority";

export default function MaintenancePage() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "online" | "maintenance" | "offline" | "loading"
  >("loading");

  const checkMaintenance = useCallback(async () => {
    setStatus("loading");

    try {
      const maintenance = await api.get("/status");
      console.log(maintenance);

      setStatus("online");
      router.replace("/");
    } catch (e: any) {
      console.log(e?.request?.status);

      if (e?.request?.status === 503) return setStatus("maintenance");

      setStatus("offline");
    }
  }, [router]);

  useEffect(() => {
    checkMaintenance();
  }, [checkMaintenance]);

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

        <div className="relative">
          <Button onClick={checkMaintenance} className="relative z-10 gap-0.5">
            <motion.span
              animate={{ rotate: status === "loading" ? 360 : 0 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
            >
              <UpdateIcon width={20} />
            </motion.span>
            Refresh
          </Button>
          <AnimatePresence>
            {status !== "loading" && (
              <motion.div
                className="absolute top-0 left-0 flex w-full justify-center h-full"
                initial={{ opacity: 0, y: 5 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [5, -25, -25, 5],
                  scale: [1, 1.4, 1.4, 1],
                }}
                exit={{ opacity: 0, y: 5 }}
                transition={{
                  duration: 4,
                  times: [0, 0.7, 0.1],
                  ease: "backInOut",
                }}
              >
                {status === "maintenance" &&
                  ["😢", "🚧", "🤕", "💔", "🧰"][Math.floor(Math.random() * 5)]}
                {status === "offline" && "☠️"}
                {status === "online" && "🥳"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
