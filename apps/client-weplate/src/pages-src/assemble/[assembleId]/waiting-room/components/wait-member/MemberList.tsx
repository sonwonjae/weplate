import { useQuery } from "@tanstack/react-query";
import { CheckCircle2Icon, CrownIcon } from "lucide-react";
import { useRouter } from "next/router";

import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

function MemberList() {
  const router = useRouter();

  const assembleUserListQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/user/list`,
  });
  const { data: assembleUserList = [] } = useQuery(
    assembleUserListQuery.queryOptions,
  );

  const registedMemberCount = assembleUserList.filter(({ isRegisted }) => {
    return isRegisted;
  }).length;
  return (
    <div className={cn("flex", "flex-col", "gap-4")}>
      <h2 className={cn("pt-8", "px-5", "font-bold", "text-lg")}>
        음식 정보 등록 현황{" "}
        <span>
          <span className={cn("text-primary")}>{registedMemberCount}</span>/
          <span>{assembleUserList.length}</span>
        </span>
      </h2>
      <ul className={cn("pt-4", "px-5", "flex", "gap-5", "overflow-x-auto")}>
        {assembleUserList.map(({ id, permission, nickname, isRegisted }) => {
          return (
            <li
              key={id}
              className={cn("flex", "flex-col", "items-center", "gap-0.5")}
            >
              <div
                className={cn(
                  "relative",
                  "flex",
                  "justify-center",
                  "items-center",
                  "w-11",
                  "h-11",
                  "rounded-full",
                  permission === "owner" && "border",
                  permission === "owner" && "border-primary",
                  "bg-white",
                )}
              >
                {permission === "owner" && (
                  <CrownIcon
                    size={18}
                    className={cn(
                      "text-yellow-400",
                      "fill-yellow-400",
                      "absolute",
                      "top-0",
                      "-translate-y-full",
                      "pb-0.5",
                    )}
                  />
                )}
                <div
                  className={cn("w-10", "h-10", "rounded-full", "bg-slate-200")}
                />
              </div>
              <div className={cn("flex-1", "text-xs")}>{nickname}</div>
              <CheckCircle2Icon
                size={24}
                className={cn(
                  "stroke-white",
                  isRegisted && "fill-primary",
                  !isRegisted && "fill-secondary",
                )}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MemberList;
