import type { PropsWithChildren } from "react";

import { useQuery } from "@tanstack/react-query";
import {
  ChefHatIcon,
  ChevronLeftIcon,
  ShareIcon,
  UserRoundPlusIcon,
  UsersRoundIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { Header, Footer, Main } from "@/layouts";
import { Button } from "@/shad-cn/components/ui/button";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import { useRecommendFoodStore } from "./stores/recommend-food";

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

  const animationStatus = useRecommendFoodStore((state) => {
    return state.animationStatus;
  });
  const recommendStatus = useRecommendFoodStore((state) => {
    return state.recommendStatus;
  });
  const changeRecommendStatus = useRecommendFoodStore((state) => {
    return state.changeRecommendStatus;
  });

  const shareAssembleLink = async () => {
    try {
      if (navigator.canShare()) {
        try {
          await navigator.share({
            url: `${process.env.NEXT_PUBLIC_WEB_SERVER_HOST}/assemble/${router.query.assembleId}/invitee-room`,
          });
          return toast.info("공유 성공");
        } catch {
          return toast.error("공유 실패");
        }
      } else {
        await navigator.clipboard.writeText(
          `${process.env.NEXT_PUBLIC_WEB_SERVER_HOST}/assemble/${router.query.assembleId}/invitee-room`,
        );
        toast.info("클립보드에 복사되었어요.", {
          position: "bottom-left",
        });
      }
    } catch {
      return toast.error("공유 실패");
    }
  };
  const recommendedFoodListQuery = new RQClient({
    url: `/api/food/${router.query.assembleId}/recommend/list`,
    customQueryOptions: {
      enabled: recommendStatus === "start",
      retry: 0,
    },
  });

  useQuery(recommendedFoodListQuery.queryOptions);

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
            {!isOwner && (
              <button type="button">
                <UsersRoundIcon />
              </button>
            )}
            <button type="button" onClick={shareAssembleLink}>
              <ShareIcon />
            </button>
            <ChefHatIcon />
          </div>
        </div>
      </Header>
      <Main className={cn("flex", "flex-col")}>{children}</Main>

      <Footer>
        <Button
          size="lg"
          round
          disabled={
            !(animationStatus === "wait" && recommendStatus === "not-yet")
          }
          className={cn("w-full")}
          onClick={async () => {
            if (
              !(animationStatus === "wait" && recommendStatus === "not-yet")
            ) {
              return;
            }

            if (recommendStatus === "not-yet") {
              return changeRecommendStatus("start");
            }
          }}
        >
          {animationStatus === "wait" &&
            recommendStatus === "not-yet" &&
            "메뉴 추천 시작"}
          {(animationStatus === "loading-start" ||
            recommendStatus === "start") &&
            "메뉴 추천 중"}
          {animationStatus === "loading-end" &&
            recommendStatus === "end" &&
            "메뉴 추천 완료"}
        </Button>
      </Footer>
    </>
  );
}

export default Layout;
