import { shuffle } from "es-toolkit";
import { useMemo } from "react";

import { AnimatedList } from "@/shad-cn/components/ui/animated-list";
import { cn } from "@/utils/tailwind";

import {
  WRITING_LIST,
  SPLIT_FOOD_CHECK_REGEXP,
} from "./FoodWritingListLoading.constants";

interface FoodWritingListLoadingProps {
  isPaused?: boolean;
  isEnd?: boolean;
}

function FoodWritingListLoading({
  isPaused = false,
  isEnd = false,
}: FoodWritingListLoadingProps) {
  const shuffledWritingList = useMemo(() => {
    return shuffle(WRITING_LIST);
  }, []);

  return (
    <AnimatedList
      initLength={3}
      maxLength={3}
      isInfinite
      isPaused={isPaused}
      className={cn("w-full", "list-none")}
    >
      {shuffledWritingList.map((WRITING, index) => {
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
                isEnd && "opacity-0",
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
  );
}

export default FoodWritingListLoading;
