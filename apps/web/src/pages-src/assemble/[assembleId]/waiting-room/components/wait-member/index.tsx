import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import { useRecommendFoodStore } from "../../stores/recommend-food";

import FoodMarquee from "./FoodMarquee";
import MemberList from "./MemberList";
import RecommendLoading from "./RecommendLoading/RecommendLoading";
import RecommendResult from "./RecommendResult";

function WaitMember() {
  const router = useRouter();

  const recommendStatus = useRecommendFoodStore((state) => {
    return state.recommendStatus;
  });
  const animationStatus = useRecommendFoodStore((state) => {
    return state.animationStatus;
  });

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

  if (isOwner && !hasMember) {
    return null;
  }

  const isLoadingAnimation =
    (animationStatus === "loading-start" ||
      animationStatus === "loading-end") &&
    recommendStatus !== "end";

  return (
    <section className={cn("h-full", "flex", "flex-col", "gap-8")}>
      <MemberList />
      {animationStatus === "wait" && <FoodMarquee />}
      {isLoadingAnimation && <RecommendLoading />}
      {animationStatus === "loading-end" && recommendStatus === "end" && (
        <RecommendResult />
      )}
    </section>
  );
}
export default WaitMember;
