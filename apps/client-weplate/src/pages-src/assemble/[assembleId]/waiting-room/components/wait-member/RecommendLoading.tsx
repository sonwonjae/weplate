import { FoodWritingListLoading } from "@/ui/loading/components";
import { cn } from "@/utils/tailwind";

import { useRecommendFoodStore } from "../../stores/recommend-food";

function RecommendLoading() {
  const recommendStatus = useRecommendFoodStore((state) => {
    return state.recommendStatus;
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
        isPaused={recommendStatus === "end"}
        isEnd={recommendStatus === "end"}
      />
    </div>
  );
}

export default RecommendLoading;
