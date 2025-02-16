import { useQuery } from "@tanstack/react-query";
import { RotateCwIcon } from "lucide-react";
import { useRouter } from "next/router";

import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

function Title() {
  const router = useRouter();

  const assembleUserListQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/user/list`,
  });
  const { data: assembleUserList = [], refetch: refetchAssembleUserList } =
    useQuery(assembleUserListQuery.queryOptions);

  const registedMemberCount = assembleUserList.filter(({ isRegisted }) => {
    return isRegisted;
  }).length;

  return (
    <h2
      className={cn(
        "flex",
        "items-center",
        "pt-8",
        "px-5",
        "font-bold",
        "text-md",
        "gap-2",
      )}
    >
      <span>
        <span>음식 정보 등록 현황 </span>
        <span className={cn("text-primary")}>{registedMemberCount}</span>/
        <span>{assembleUserList.length}</span>
      </span>
      <span
        role="button"
        className={cn(
          "inline-block",
          "p-1",
          "cursor-pointer",
          "rounded-full",
          "bg-primary",
        )}
        onClick={() => {
          refetchAssembleUserList();
        }}
      >
        <RotateCwIcon
          size={16}
          strokeWidth={2.5}
          className={cn("stroke-white")}
        />
      </span>
    </h2>
  );
}

export default Title;
