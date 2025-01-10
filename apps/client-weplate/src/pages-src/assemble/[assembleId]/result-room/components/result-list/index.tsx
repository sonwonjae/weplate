import { cn } from "@/utils/tailwind";

import { useReRecommendFoodStore } from "../../stores/re-recommend-food";

import MemberList from "./MemberList";
import RecommendResult from "./RecommendResult";
import ReRecommendLoading from "./ReRecommendLoading";

function ResultList() {
  const reRecommendStatus = useReRecommendFoodStore((state) => {
    return state.reRecommendStatus;
  });

  return (
    <section className={cn("h-full", "flex", "flex-col", "gap-8")}>
      <MemberList />
      {(reRecommendStatus === "loading-start" ||
        reRecommendStatus === "loading-end") && <ReRecommendLoading />}
      {(reRecommendStatus === "init" || reRecommendStatus === "end") && (
        <RecommendResult />
      )}
    </section>
  );
}
export default ResultList;
