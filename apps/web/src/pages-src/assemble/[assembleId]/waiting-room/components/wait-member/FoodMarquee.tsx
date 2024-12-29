import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";

import Marquee from "@/shad-cn/components/ui/marquee";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import { useRecommendFoodStore } from "../../stores/recommend-food";

function FoodMarquee() {
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

  const hasMember = !!assemble?.memberList.length;

  const recommendStatus = useRecommendFoodStore((state) => {
    return state.recommendStatus;
  });

  if (isOwner && !hasMember) {
    return null;
  }

  return (
    <div className={cn("overflow-hidden")}>
      {Array.from({ length: 2 }, (_, page) => {
        const isReverse = page % 2 !== 0;

        const repeat = (() => {
          if (isReverse && recommendStatus === "start") {
            return 4;
          }
          return 2;
        })();

        return (
          <Marquee
            key={page}
            pauseOnHover
            repeat={repeat}
            reverse={isReverse}
            className={cn(
              "[--duration:15s]",
              "opacity-80",
              recommendStatus === "start" && "transition-all",
              recommendStatus === "start" && "duration-5000",
              recommendStatus === "start" && "overflow-visible",
              recommendStatus === "start" && isReverse && "ml-[4000px]",
              recommendStatus === "start" && !isReverse && "-ml-[4000px]",
            )}
          >
            {Array.from({ length: 8 }, (_, index) => {
              const imageName = String(index + page * 8).padStart(2, "0");

              return (
                <li
                  key={imageName}
                  className={cn(
                    recommendStatus === "start" && "transition-all",
                    recommendStatus === "start" && "duration-3000",
                    recommendStatus === "start" && "opacity-0",
                  )}
                >
                  <Image
                    src={`/food/${imageName}.png`}
                    alt={`food-${imageName}`}
                    width={120}
                    height={120}
                    className={cn(
                      "cursor-pointer",
                      "scale-95",
                      "hover:scale-100",
                      "transition-all",
                    )}
                  />
                </li>
              );
            })}
          </Marquee>
        );
      })}
      <p
        className={cn(
          "pt-4",
          "px-5",
          "text-slate-400",
          "break-keep",
          "text-center",
          recommendStatus === "start" && "transition-all",
          recommendStatus === "start" && "duration-3000",
          recommendStatus === "start" && "opacity-0",
        )}
      >
        모임원이 음식 정보를 등록하고 있어요.
        <br />
        모임원이 등록을 많이 완료할수록{" "}
        <span className={cn("text-primary", "font-bold")}>모두의 취향</span>을
        반영한 음식을 추천해드려요
      </p>
    </div>
  );
}
export default FoodMarquee;
