import "@/styles/globals.css";
import type { AppProps } from "next/app";

import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NextPage } from "next";
import React, { useState } from "react";

import { Toaster } from "@/shad-cn/components/ui/sonner";
import { cn } from "@/utils/tailwind";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  Layout: React.ExoticComponent<{
    children?: React.ReactNode | undefined;
  }>;
};

type AppPropsWithLayout = AppProps<{ dehydratedState: DehydratedState }> & {
  Component: NextPageWithLayout;
};

export default function MyApp({
  Component: PageComponent,
  pageProps,
}: AppPropsWithLayout) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          // With SSR, we usually want to set some default staleTime
          // above 0 to avoid refetching immediately on the client
          staleTime: 60 * 1000,
        },
      },
    });
  });

  const PageLayout = PageComponent.Layout ?? React.Fragment;

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      <HydrationBoundary state={pageProps.dehydratedState}>
        <div
          className={cn(
            "fixed",
            "top-0",
            "bottom-0",
            "left-0",
            "right-0",
            "max-w-3xl",
            "my-0",
            "mx-auto",
            "scale-100",
            "flex",
            "flex-col",
          )}
        >
          <PageLayout>
            <PageComponent {...pageProps} />
          </PageLayout>
        </div>

        <Toaster position="top-right" />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
