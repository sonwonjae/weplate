import Image from "next/image";

import Marquee from "@/shad-cn/components/ui/marquee";
import { cn } from "@/utils/tailwind";

import { useRecommendFoodStore } from "../../stores/recommend-food";

function FoodMarquee() {
  const recommendStatus = useRecommendFoodStore((state) => {
    return state.recommendStatus;
  });

  return (
    <div className={cn("overflow-hidden")}>
      {Array.from({ length: 2 }, (_, page) => {
        const isReverse = page % 2 !== 0;

        const repeat = (() => {
          if (isReverse && recommendStatus === "marquee-loading") {
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
              recommendStatus === "marquee-loading" && "transition-all",
              recommendStatus === "marquee-loading" && "duration-5000",
              recommendStatus === "marquee-loading" && "overflow-visible",
              recommendStatus === "marquee-loading" &&
                isReverse &&
                "ml-[4000px]",
              recommendStatus === "marquee-loading" &&
                !isReverse &&
                "-ml-[4000px]",
            )}
          >
            {Array.from({ length: 8 }, (_, index) => {
              const imageName = String(index + page * 8).padStart(2, "0");

              return (
                <li
                  key={imageName}
                  className={cn(
                    recommendStatus === "marquee-loading" && "transition-all",
                    recommendStatus === "marquee-loading" && "duration-3000",
                    recommendStatus === "marquee-loading" && "opacity-0",
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
          "text-slate-600",
          "text-sm",
          "break-keep",
          "text-center",
          recommendStatus === "marquee-loading" && "transition-all",
          recommendStatus === "marquee-loading" && "duration-3000",
          recommendStatus === "marquee-loading" && "opacity-0",
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
