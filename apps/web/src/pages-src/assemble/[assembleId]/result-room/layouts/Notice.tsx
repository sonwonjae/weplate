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
    return shownNewRegistedFoodMemberList.includes(memberId);
  }).length;

  const updateShownNewRegistedFoodMemberList = useResultRoomNoticeStore(
    (state) => {
      return state.updateShownNewRegistedFoodMemberList;
    },
  );

  if (!isShowNotice) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full",
        "py-3",
        "px-5",
        "flex",
        "justify-between",
        "items-center",
        "bg-slate-200",
      )}
    >
      <CircleAlertIcon className={cn("fill-primary", "stroke-slate-200")} />
      <span className={cn("text-sm")}>테스트</span>
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
