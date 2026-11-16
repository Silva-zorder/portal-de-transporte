import { ConfirmAlertCallable } from "@hubble-ds/components/callables/confirm-alert-callable";
import { ToastProvider } from "@hubble-ds/components/ui/toast";
import { TooltipProvider } from "@hubble-ds/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { RouterProvider } from "react-router";
import { queryClient } from "@/lib/query/client";
import { router } from "@/router";

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

function Providers({ children }: Readonly<PropsWithChildren>) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Callables />
        <ToastProvider />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function Callables() {
  return <ConfirmAlertCallable />;
}

export { App };
