import { FoodWritingListLoading } from "@/ui/loading/components";
import { cn } from "@/utils/tailwind";

import { useReRecommendFoodStore } from "../../stores/re-recommend-food";

function ReRecommendLoading() {
  const reRecommendStatus = useReRecommendFoodStore((state) => {
    return state.reRecommendStatus;
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
      <FoodWritingListLoading
        isPaused={reRecommendStatus === "loading-end"}
        isEnd={reRecommendStatus === "loading-end"}
      />
    </div>
  );
}

export default ReRecommendLoading;
