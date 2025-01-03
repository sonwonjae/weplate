import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UserRoundPlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useReRecommendFoodStore } from "@/pages-src/assemble/[assembleId]/result-room/stores/re-recommend-food";
import { Button, buttonVariants } from "@/shad-cn/components/ui/button";
import { apiAxios, RQClient } from "@/utils/react-query";
import { sleep } from "@/utils/sleep";
import { cn } from "@/utils/tailwind";

import { useRecommendFoodStore } from "../stores/recommend-food";
import { useSkipInviteMemberStore } from "../stores/skip-invite-member";

function InviteMember() {
  const router = useRouter();

  const authQuery = new RQClient({ url: "/api/user/auth/check" });
  const { data: userInfo } = useQuery(authQuery.queryOptions);

  const assembleQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/item`,
  });

  const { data: assemble } = useQuery(assembleQuery.queryOptions);

  const isSkipInviteMember = useSkipInviteMemberStore((state) => {
    return state.isSkipInviteMember;
  });
  const toggleIsSkipInviteMember = useSkipInviteMemberStore((state) => {
    return state.toggleIsSkipInviteMember;
  });

  const recommendStatus = useRecommendFoodStore((state) => {
    return state.recommendStatus;
  });
  const changeRecommendStatus = useRecommendFoodStore((state) => {
    return state.changeRecommendStatus;
  });
  const changeReRecommendStatus = useReRecommendFoodStore((state) => {
    return state.changeReRecommendStatus;
  });

  const isOwner =
    !!assemble?.ownerInfo.id &&
    !!userInfo?.id &&
    assemble?.ownerInfo.id === userInfo?.id;

  const hasMember = !!assemble?.memberList.length;

  const isShowInviteMemberPage = isOwner && !hasMember && !isSkipInviteMember;

  const { mutateAsync: recommendFoodList } = useMutation({
    mutationFn: async () => {
      try {
        // NOTE: 1. 음식 문구 로딩 시작
        changeRecommendStatus("recommend-loading");

        await Promise.all([
          (async () => {
            // NOTE: 2-1. 음식 추천 시작
            await apiAxios.post(
              `/api/food/${router.query.assembleId}/recommend/food`,
            );
          })(),
          (async () => {
            // NOTE: 2-2. 최소 3000ms 후 음식 문구 로딩 종료
            await sleep(3000);
            changeRecommendStatus("end");
          })(),
        ]);

        // NOTE: 3. 1000ms 후 애니메이션 보여주며 결과 페이지로 이동
        await sleep(1000);
        changeReRecommendStatus("end");
        router.replace(`/assemble/${router.query.assembleId}/result-room`);
      } catch (error) {
        throw error as AxiosError;
      }
    },
  });

  if (!isShowInviteMemberPage) {
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
      <p className={cn("text-center", "text-slate-800", "text-sm")}>
        함께할 사람을 초대하고,
        <br />
        메뉴와 일정을 편하게 정해보세요! (최대{" "}
        {process.env.NEXT_PUBLIC_ASSEMBLE_MAX_USER_COUNT}명)
      </p>
      <Link
        href={`/assemble/${router.query.assembleId}/invite-member`}
        className={cn(buttonVariants({ size: "sm", round: true }))}
      >
        <UserRoundPlusIcon />
        <span>모임 일행 초대하기</span>
      </Link>
      <Button
        type="button"
        color="link"
        size="sm"
        disabled={recommendStatus !== "wait"}
        className={cn("p-0", "h-auto", "text-slate-400")}
        onClick={() => {
          if (recommendStatus !== "wait") {
            return;
          }
          toggleIsSkipInviteMember();
          recommendFoodList();
        }}
      >
        우선 혼자 추천받기
      </Button>
    </section>
  );
}

export default InviteMember;
