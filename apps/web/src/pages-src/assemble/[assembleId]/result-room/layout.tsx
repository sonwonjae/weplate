import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ChefHatIcon,
  ChevronLeftIcon,
  ShareIcon,
  UserRoundPlusIcon,
  UsersRoundIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type PropsWithChildren } from "react";

import { Header, Footer, Main } from "@/layouts";
import { Button } from "@/shad-cn/components/ui/button";
import { apiAxios, RQClient } from "@/utils/react-query";
import { shareLink } from "@/utils/share";
import { sleep } from "@/utils/sleep";
import { cn } from "@/utils/tailwind";

import { useReRecommendFoodStore } from "./stores/re-recommend-food";

function Layout({ children }: PropsWithChildren) {
  const router = useRouter();
  const queryClient = useQueryClient();

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

  const shareAssembleLink = async () => {
    await shareLink({
      url: `${process.env.NEXT_PUBLIC_WEB_SERVER_HOST}/assemble/${router.query.assembleId}`,
    });
  };

  const shareRecommendedFoodResult = async () => {
    await shareLink({
      url: `${process.env.NEXT_PUBLIC_WEB_SERVER_HOST}/assemble/${router.query.assembleId}/result-room`,
      position: "top-left",
    });
  };

  const reRecommendStatus = useReRecommendFoodStore((state) => {
    return state.reRecommendStatus;
  });
  const changeReRecommendStatus = useReRecommendFoodStore((state) => {
    return state.changeReRecommendStatus;
  });

  const recommendedFoodResultQuery = new RQClient({
    url: `/api/food/${router.query.assembleId}/recommend/result`,
  });

  const { mutateAsync: reRecommendFoodList } = useMutation({
    mutationFn: async () => {
      try {
        // NOTE: 1. 음식 문구 로딩 시작
        changeReRecommendStatus("loading-start");

        // NOTE: 2. 음식 추천 시작
        await apiAxios.post(
          `/api/food/${router.query.assembleId}/recommend/food`,
        );

        await Promise.all([
          (async () => {
            // NOTE: 3-1. 음식 추천 리스트 새로고침
            await queryClient.refetchQueries({
              queryKey: recommendedFoodResultQuery.queryKey,
            });
          })(),
          (async () => {
            // NOTE: 3-2. 최소 3000ms 후 음식 문구 로딩 종료
            await sleep(3000);
            changeReRecommendStatus("loading-end");
          })(),
        ]);

        // NOTE: 4. 1000ms 후 결과 제공
        await sleep(1000);
        changeReRecommendStatus("end");
      } catch (error) {
        throw error as AxiosError;
      }
    },
  });

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
      <Footer
        className={cn(
          reRecommendStatus === "end" &&
            "animate-[fade-in-up_0.4s_ease-in-out_forwards]",
        )}
      >
        <div className={cn("w-full", "flex", "flex-col", "gap-2")}>
          <Button
            size="lg"
            round
            className={cn("w-full")}
            onClick={shareRecommendedFoodResult}
          >
            메뉴 공유하기
          </Button>
          <Button
            size="lg"
            round
            outline
            className={cn("w-full")}
            onClick={() => {
              reRecommendFoodList();
            }}
          >
            다른 메뉴 추천 받기
          </Button>
        </div>
      </Footer>
    </>
  );
}

export default Layout;
