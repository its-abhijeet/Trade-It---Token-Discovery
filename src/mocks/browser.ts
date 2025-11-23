// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "@/services/msw/handlers"; // <-- your handlers path

export const worker =
  typeof window !== "undefined" ? setupWorker(...handlers) : null;
