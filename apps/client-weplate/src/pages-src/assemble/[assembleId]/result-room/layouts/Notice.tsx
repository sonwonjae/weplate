import { useQuery } from "@tanstack/react-query";
import { CircleAlertIcon, XIcon } from "lucide-react";
import { useRouter } from "next/router";

import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import { useResultRoomNoticeStore } from "../stores/notice";

function Notice() {
  const router = useRouter();
  const newRegistedFoodMemberListQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/check/new-registed-food-member`,
  });
  const { data: newRegistedFoodMemberList = [] } = useQuery(
    newRegistedFoodMemberListQuery.queryOptions,
  );

  const shownNewRegistedFoodMemberList = useResultRoomNoticeStore((state) => {
    return state.shownNewRegistedFoodMemberList;
  });
  const isShowNotice = !!newRegistedFoodMemberList.filter((memberId) => {
    return !shownNewRegistedFoodMemberList.includes(memberId);
  }).length;

  const updateShownNewRegistedFoodMemberList = useResultRoomNoticeStore(
    (state) => {
      return state.updateShownNewRegistedFoodMemberList;
    },
  );

  return (
    <div
      className={cn(
        "w-full",
        "py-3",
        "px-5",
        "flex",
        "justify-between",
        "items-center",
        "bg-slate-100",
        "transition-all",
        "duration-500",
        "h-12",
        !isShowNotice && "h-0",
        !isShowNotice && "py-0",
        "overflow-hidden",
        "shadow-inner",
      )}
    >
      <CircleAlertIcon className={cn("fill-primary", "stroke-slate-100")} />
      <span className={cn("text-sm")}>
        새로운 모임원이 음식정보를 등록했어요.{" "}
      </span>
      <XIcon
        size={16}
        onClick={() => {
          updateShownNewRegistedFoodMemberList(newRegistedFoodMemberList);
        }}
      />
    </div>
  );
}

export default Notice;
