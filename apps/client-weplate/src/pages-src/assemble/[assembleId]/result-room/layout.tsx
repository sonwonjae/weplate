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
import { useEffect, type PropsWithChildren } from "react";

import { Header, Footer, Main } from "@/layouts";
import { Button } from "@/shad-cn/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/shad-cn/components/ui/drawer";
import Members from "@/ui/member/Members";
import { RQClient } from "@/utils/react-query";
import { shareLink } from "@/utils/share";
import { cn } from "@/utils/tailwind";

import { Notice, ReRecommendFoodButton } from "./layouts";
import { useReRecommendFoodStore } from "./stores/re-recommend-food";

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

  const shareAssembleLink = async () => {
    await shareLink({
      url: `${process.env.NEXT_PUBLIC_HOST}/assemble/${router.query.assembleId}`,
    });
  };

  const shareRecommendedFoodResult = async () => {
    await shareLink({
      url: `${process.env.NEXT_PUBLIC_HOST}/assemble/${router.query.assembleId}/result-room`,
      position: "top-left",
    });
  };

  const reRecommendStatus = useReRecommendFoodStore((state) => {
    return state.reRecommendStatus;
  });
  const resetReRecommendFood = useReRecommendFoodStore((state) => {
    return state.resetReRecommendFood;
  });

  useEffect(() => {
    if (!/(waiting-room|result-room)$/.test(router.pathname)) {
      resetReRecommendFood();
    }
  }, [router.pathname]);

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
              <Drawer>
                <DrawerTrigger asChild>
                  <button type="button">
                    <UsersRoundIcon />
                  </button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className={cn("relative", "pb-8")}>
                    <Members>
                      <Members.Title />
                      <Members.List />
                    </Members>
                  </div>
                </DrawerContent>
              </Drawer>
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
      <Notice />
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
          <ReRecommendFoodButton />
        </div>
      </Footer>
    </>
  );
}

export default Layout;
