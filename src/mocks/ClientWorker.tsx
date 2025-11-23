// src/mocks/ClientWorker.tsx
"use client";
import { useEffect } from "react";

export default function ClientWorker() {
  useEffect(() => {
    // Only start MSW in development OR when explicitly enabled via env var (e.g. Vercel Preview)
    const enabled =
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_PUBLIC_USE_MSW === "true";
    if (!enabled) return;

    // Lazy import the browser worker to avoid bundling it into prod client code
    import("./browser")
      .then(({ worker }) => {
        if (!worker) return;
        return worker.start({
          onUnhandledRequest: "bypass",
          // Ensure service worker is registered from the root so scope covers whole app
          serviceWorker: {
            url: "/mockServiceWorker.js",
          },
        });
      })
      .then(() => {
        // helpful flag other parts of your app already check
        if (typeof window !== "undefined")
          (window as any).__MSW_STARTED__ = true;
        console.info("[MSW] worker started");
      })
      .catch((err) => {
        console.warn("[MSW] failed to start", err);
      });
  }, []);

  return null;
}
