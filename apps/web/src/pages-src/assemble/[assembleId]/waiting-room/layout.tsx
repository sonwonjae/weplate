import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ChefHatIcon,
  ChevronLeftIcon,
  ShareIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren } from "react";

import { Header, Footer, Main } from "@/layouts";
import { useReRecommendFoodStore } from "@/pages-src/assemble/[assembleId]/result-room/stores/re-recommend-food";
import { Button } from "@/shad-cn/components/ui/button";
import { apiAxios, RQClient } from "@/utils/react-query";
import { shareLink } from "@/utils/share";
import { sleep } from "@/utils/sleep";
import { cn } from "@/utils/tailwind";

import { useRecommendFoodStore } from "./stores/recommend-food";
import { useSkipInviteMemberStore } from "./stores/skip-invite-member";

function Layout({ children }: PropsWithChildren) {
  const router = useRouter();

  const authQuery = new RQClient({ url: "/api/user/auth/check" });
  const { data: userInfo } = useQuery(authQuery.queryOptions);

  const assembleQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/item`,
  });
  const { data: assemble } = useQuery(assembleQuery.queryOptions);

  const isOwner =
    !!assemble?.ownerInfo.id &&
    !!userInfo?.id &&
    assemble?.ownerInfo.id === userInfo?.id;

  const recommendStatus = useRecommendFoodStore((state) => {
    return state.recommendStatus;
  });
  const resetRecommendFood = useRecommendFoodStore((state) => {
    return state.resetRecommendFood;
  });
  const changeRecommendStatus = useRecommendFoodStore((state) => {
    return state.changeRecommendStatus;
  });
  const changeReRecommendStatus = useReRecommendFoodStore((state) => {
    return state.changeReRecommendStatus;
  });

  const shareAssembleLink = async () => {
    await shareLink({
      url: `${process.env.NEXT_PUBLIC_WEB_SERVER_HOST}/assemble/${router.query.assembleId}`,
    });
  };

  const { mutateAsync: recommendFoodList } = useMutation({
    mutationFn: async () => {
      try {
        // NOTE: 1. 음식 큐 로딩 시작
        changeRecommendStatus("marquee-loading");

        await Promise.all([
          (async () => {
            // NOTE: 2-1. 음식 추천 시작
            await apiAxios.post(
              `/api/food/${router.query.assembleId}/recommend/food`,
            );
            return;
          })(),
          (async () => {
            // NOTE: 2-2. 최소 2000ms 후 음식 문구 로딩 시작
            await sleep(2000);
            changeRecommendStatus("recommend-loading");
          })(),
        ]);

        // NOTE: 3. 3000ms 후 음식 문구 로딩 종료
        await sleep(3000);
        changeRecommendStatus("end");

        // NOTE: 4. 1000ms 후 애니메이션 보여주며 결과 페이지로 이동
        await sleep(1000);
        changeReRecommendStatus("end");
        router.replace(`/assemble/${router.query.assembleId}/result-room`);
      } catch (error) {
        throw error as AxiosError;
      }
    },
  });

  useEffect(() => {
    resetRecommendFood();
  }, [router.pathname]);

  const isSkipInviteMember = useSkipInviteMemberStore((state) => {
    return state.isSkipInviteMember;
  });
  const hasMember = !!assemble?.memberList.length;

  const isShowInviteMemberPage = isOwner && !hasMember && !isSkipInviteMember;

  return (
    <>
      <Header>
        <div className={cn("relative")}>
          <Link
            href="/"
            className={cn(
              "absolute",
              "top-0",
              "left-0",
              "-translate-y-1/2",
              "flex",
              "gap-2",
            )}
          >
            <ChevronLeftIcon />
          </Link>
        </div>
        <h1 className={cn("text-lg", "font-bold", "truncate", "max-w-36")}>
          {assemble?.title}
        </h1>
        <div className={cn("relative")}>
          <div
            className={cn(
              "absolute",
              "top-0",
              "right-0",
              "-translate-y-1/2",
              "flex",
              "gap-2",
            )}
          >
            {isOwner && (
              <Link href={`/assemble/${router.query.assembleId}/invite-member`}>
                <UserRoundPlusIcon />
              </Link>
            )}
            <button type="button" onClick={shareAssembleLink}>
              <ShareIcon />
            </button>
            <Link
              href={`/assemble/${router.query.assembleId}/update-food-survey`}
            >
              <ChefHatIcon />
            </Link>
          </div>
        </div>
      </Header>
      <Main className={cn("flex", "flex-col")}>{children}</Main>
      {isShowInviteMemberPage && (
        <Footer>
          <Footer.HomePageLink />
          <Footer.CreateAssembleButton />
          <Footer.MyInfoPageLink />
        </Footer>
      )}
      {!isShowInviteMemberPage && (
        <Footer
          className={cn(
            recommendStatus !== "wait" &&
              "animate-[fade-out-down_0.4s_ease-in-out_forwards]",
          )}
        >
          <Button
            size="lg"
            round
            disabled={recommendStatus !== "wait"}
            className={cn("w-full")}
            onClick={() => {
              if (recommendStatus !== "wait") {
                return;
              }

              recommendFoodList();
            }}
          >
            메뉴 추천 시작
          </Button>
        </Footer>
      )}
    </>
  );
}

export default Layout;
