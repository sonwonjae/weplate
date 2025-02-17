import "@/styles/globals.css";

import type { AppProps } from "next/app";

import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NextPage } from "next";
import localFont from "next/font/local";
import Head from "next/head";
import React, { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Favicons from "@/meta/Favicons";
import { Button } from "@/shad-cn/components/ui/button";
import { cn } from "@/utils/tailwind";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  Head: React.ExoticComponent<{
    children?: React.ReactNode | undefined;
  }>;
  Layer: React.ExoticComponent<{
    children?: React.ReactNode | undefined;
  }>;
  Layout: React.ExoticComponent<{
    children?: React.ReactNode | undefined;
  }>;
};

type AppPropsWithLayout = AppProps<{ dehydratedState: DehydratedState }> & {
  Component: NextPageWithLayout;
};

const pretendard = localFont({
  src: "../../public/font/PretendardVariable.woff2",
});

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

  const PageHead = PageComponent.Head ?? React.Fragment;
  const PageLayer = PageComponent.Layer ?? React.Fragment;
  const PageLayout = PageComponent.Layout ?? React.Fragment;

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Head>
          <Favicons />
          <title>취향 존중 메뉴 추천 - 위플레이트(Weplate)</title>
          <meta
            name="Description"
            content="혼자도 함께도 즐거운 맞춤 메뉴 추천! 1~20명의 취향을 반영한 3가지 메뉴 제안. 위플레이트로 쉽고 빠르게 선택하세요."
          />
          <meta
            name="Keywords"
            content={[
              "위플레이트",
              "위 플레이트",
              "위-플레이트",
              "위플레이트 앱",
              "위플레이트 서비스",
              "weplate",
              "we-plate",
              "we plate",
              "WEPLATE",
              "WE-PLATE",
              "WE PLATE",
              "Weplate",
              "WePlate",
              "We-plate",
              "We-Plate",
              "We Plate",
              "wiplate",
              "wi-plate",
              "wi plate",
              "음식 추천",
              "메뉴 추천",
              "AI 음식 추천",
              "취향 분석 음식 추천",
              "개인 맞춤 음식 추천",
              "메뉴 고민 해결",
              "맞춤형 식사 추천",
              "혼밥 메뉴 추천",
              "다이어트 음식 추천",
              "건강식 추천",
              "데이트 음식 추천",
              "단체 식사 메뉴 추천",
              "외식 메뉴 고민",
              "아침 추천",
              "점심 추천",
              "저녁 추천",
              "전매추",
              "음식 메뉴 고민",
              "메뉴 결정",
              "한식 추천",
              "중식 추천",
              "일식 추천",
              "양식 추천",
              "퓨전음식 추천",
              "멕시코 음식 추천",
              "맛집 추천 앱",
              "음식 검색 앱",
              "AI 메뉴 추천",
              "맛집 큐레이션 서비스",
              "음식 큐레이션",
              "위플레이트 음식 추천",
              "WePlate 음식 추천",
              "위플레이트 메뉴 추천",
              "취향 분석 위플레이트",
              "AI 기반 음식 추천 WePlate",
              "위플레이트 오늘 뭐 먹지",
              "WePlate 다이어트 음식 추천",
              "위플레이트 데이트 메뉴 추천",
              "위플레이트 건강식 추천",
              "오늘 뭐 먹지",
              "저녁 메뉴 추천",
              "맞춤형 음식 추천",
              "음식 고민 해결 앱",
              "메뉴 고르기",
            ].join(", ")}
          />
        </Head>
        <PageHead />
        <div
          className={cn(
            pretendard.className,
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
          <QueryErrorResetBoundary>
            {({ reset }) => {
              return (
                <ErrorBoundary
                  onReset={reset}
                  fallbackRender={({ resetErrorBoundary }) => {
                    return (
                      <div
                        className={cn(
                          "flex",
                          "flex-col",
                          "items-center",
                          "justify-center",
                          "gap-4",
                          "mt-48",
                          "w-100",
                          "text-center",
                        )}
                      >
                        <h1>문제가 발생했습니다.</h1>
                        <Button
                          color="destructive"
                          onClick={resetErrorBoundary}
                        >
                          다시 시도해주세요.
                        </Button>
                      </div>
                    );
                  }}
                >
                  <PageLayer>
                    <PageLayout>
                      <PageComponent {...pageProps} />
                    </PageLayout>
                  </PageLayer>
                </ErrorBoundary>
              );
            }}
          </QueryErrorResetBoundary>
        </div>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
