import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import MemberList from "./MemberList";
import RecommendResult from "./RecommendResult";

function WaitMember() {
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

  if (isOwner && !hasMember) {
    return null;
  }

  return (
    <section className={cn("h-full", "flex", "flex-col", "gap-8")}>
      <MemberList />
      <RecommendResult />
    </section>
  );
}
export default WaitMember;
