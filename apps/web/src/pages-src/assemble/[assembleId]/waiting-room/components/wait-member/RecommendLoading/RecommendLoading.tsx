import { AnimatedList } from "@/shad-cn/components/ui/animated-list";
import { cn } from "@/utils/tailwind";

import { useRecommendFoodStore } from "../../../stores/recommend-food";

import {
  WRITING_LIST,
  SPLIT_FOOD_CHECK_REGEXP,
} from "./RecommendLoading.constants";

function RecommendLoading() {
  const animationStatus = useRecommendFoodStore((state) => {
    return state.animationStatus;
  });

  return (
    <div
      className={cn(
        "py-4",
        "px-5",
        "w-full",
        "flex",
        "justify-center",
        "items-start",
        "transform-gpu",
      )}
    >
      <AnimatedList
        initLength={3}
        maxLength={3}
        isInfinite
        isPaused={animationStatus === "loading-end"}
        className={cn("w-full", "list-none")}
      >
        {WRITING_LIST.map((WRITING, index) => {
          return (
            <li
              key={index}
              className={cn(
                "truncate",
                "relative",
                "mx-auto",
                "min-h-fit",
                "w-full",
                "cursor-pointer",
                "overflow-hidden",
                "rounded-2xl",
                "p-4",
                // animation styles
                "transition-all",
                "duration-200",
                "ease-in-out",
                "hover:scale-[103%]",
                // light styles
                "bg-white",
                "[box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
              )}
            >
              <span
                className={cn(
                  "transition-all",
                  "duration-1000",
                  animationStatus === "loading-end" && "opacity-0",
                )}
              >
                {WRITING.split(SPLIT_FOOD_CHECK_REGEXP).map(
                  (SPLITTED_WRITING, writingIndex) => {
                    const isFoodText =
                      SPLIT_FOOD_CHECK_REGEXP.test(SPLITTED_WRITING);

                    return (
                      <span
                        key={writingIndex}
                        className={cn(
                          isFoodText && "font-bold",
                          isFoodText && "text-primary",
                        )}
                      >
                        {SPLITTED_WRITING}
                      </span>
                    );
                  },
                )}
              </span>
            </li>
          );
        })}
      </AnimatedList>
    </div>
  );
}

export default RecommendLoading;
