import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import Members from "@/ui/member/Members";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import { useRecommendFoodStore } from "../../stores/recommend-food";
import { useSkipInviteMemberStore } from "../../stores/skip-invite-member";

import FoodMarquee from "./FoodMarquee";
import RecommendLoading from "./RecommendLoading";

function WaitMember() {
  const router = useRouter();

  const recommendStatus = useRecommendFoodStore((state) => {
    return state.recommendStatus;
  });
  const isSkipInviteMember = useSkipInviteMemberStore((state) => {
    return state.isSkipInviteMember;
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

  const isShowInviteMemberPage = isOwner && !hasMember && !isSkipInviteMember;

  if (isShowInviteMemberPage) {
    return null;
  }

  return (
    <section className={cn("h-full", "flex", "flex-col", "gap-8")}>
      <Members>
        <Members.Title />
      </Members>
      {(recommendStatus === "wait" ||
        recommendStatus === "marquee-loading") && <FoodMarquee />}
      {(recommendStatus === "recommend-loading" ||
        recommendStatus === "end") && <RecommendLoading />}
    </section>
  );
}
export default WaitMember;
