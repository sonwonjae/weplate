import { useQuery } from "@tanstack/react-query";
import { UserRoundPlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Button, buttonVariants } from "@/shad-cn/components/ui/button";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

function InviteMember() {
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

  if (!(isOwner && !hasMember)) {
    return null;
  }

  return (
    <section
      className={cn(
        "py-4",
        "px-5",
        "h-full",
        "flex",
        "flex-col",
        "gap-2",
        "justify-center",
        "items-center",
      )}
    >
      <InviteMember />
      <Link
        href={`/assemble/${router.query.assembleId}/invite-member`}
        className={cn(buttonVariants({ size: "sm", round: true }))}
      >
        <UserRoundPlusIcon />
        <span>모임 일행 초대하기</span>
      </Link>
      <Button
        color="link"
        size="sm"
        className={cn("p-0", "h-auto", "text-slate-400")}
      >
        우선 혼자 추천받기
      </Button>
    </section>
  );
}

export default InviteMember;
