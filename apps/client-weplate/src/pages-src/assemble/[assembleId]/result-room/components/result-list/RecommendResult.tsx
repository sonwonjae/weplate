import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import HyperText from "@/shad-cn/components/ui/hyper-text";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import { useReRecommendFoodStore } from "../../stores/re-recommend-food";

function RecommendResult() {
  const router = useRouter();
  const reRecommendStatus = useReRecommendFoodStore((state) => {
    return state.reRecommendStatus;
  });

  const recommendedFoodResultQuery = new RQClient({
    url: `/api/food/${router.query.assembleId}/recommend/result`,
    customQueryOptions: {
      enabled: reRecommendStatus === "init" || reRecommendStatus === "end",
      retry: 0,
    },
  });
  const { data: recommendedFoodList } = useQuery(
    recommendedFoodResultQuery.queryOptions,
  );

  return (
    <div
      className={cn(
        "py-4",
        "px-5",
        "w-full",
        "flex",
        "flex-col",
        "gap-10",
        "justify-center",
        "items-start",
        "transform-gpu",
      )}
    >
      <ul
        className={cn(
          "flex",
          "flex-col",
          "items-center",
          "gap-4",
          "w-full",
          "list-none",
        )}
      >
        {recommendedFoodList?.map(({ foodId, foodName }) => {
          return (
            <li
              key={foodId}
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
                "text-sm",
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
              {reRecommendStatus === "end" && <HyperText>{foodName}</HyperText>}
              {reRecommendStatus !== "end" && foodName}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RecommendResult;
