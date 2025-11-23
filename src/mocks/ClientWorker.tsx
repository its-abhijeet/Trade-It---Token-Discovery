"use client";
import { useEffect, useState } from "react";
import { worker } from "./browser";

export default function ClientWorker() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    console.log("ClientWorker mount — worker:", worker);
    if (!worker || process.env.NODE_ENV !== "development") return;
    worker
      .start({ onUnhandledRequest: "warn" })
      .then(() => {
        console.log("MSW worker started");
        // set a global flag so other client code can wait for it
        (window as any).__MSW_STARTED__ = true;
        setStarted(true);
      })
      .catch((e) => {
        console.error("MSW start error", e);
        (window as any).__MSW_STARTED__ = false;
      });
  }, []);

  return null;
}
