"use client";

import { Provider } from "react-redux";
import { store } from "@/features/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ClientWorker from "@/mocks/ClientWorker";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ClientWorker />
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
