import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import queryClient from "@/lib/queryClient";

interface AppProvidersProps {
  children: ReactNode;
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
        duration={4000}
      />
    </QueryClientProvider>
  );
}

export default AppProviders;
