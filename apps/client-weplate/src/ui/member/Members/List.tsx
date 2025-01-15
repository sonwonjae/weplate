import { useQuery } from "@tanstack/react-query";
import { CheckCircle2Icon, CrownIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

function List() {
  const router = useRouter();

  const authQuery = new RQClient({ url: "/api/user/auth/check" });
  const { data: userInfo } = useQuery(authQuery.queryOptions);
  const assembleUserListQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/user/list`,
  });
  const { data: assembleUserList = [] } = useQuery(
    assembleUserListQuery.queryOptions,
  );

  return (
    <ul className={cn("pt-4", "px-5", "flex", "gap-5", "overflow-x-auto")}>
      {assembleUserList.map(
        ({ id, permission, userId, nickname, isRegisted }, index) => {
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
                  "w-14",
                  "h-14",
                  "rounded-full",
                  userInfo?.id === userId && "border-2",
                  userInfo?.id === userId && "border-primary",
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
                    )}
                  />
                )}
                <div
                  className={cn(
                    "w-12",
                    "h-12",
                    "rounded-full",
                    "flex",
                    "items-center",
                    "justify-center",
                    "bg-sky-100",
                  )}
                >
                  {permission === "owner" && (
                    <Image
                      width={36}
                      height={36}
                      src="/chief.svg"
                      alt="chief"
                    />
                  )}
                  {permission === "member" && (
                    <Image
                      width={32}
                      height={32}
                      src="/member.svg"
                      alt={`member_${index}`}
                    />
                  )}
                </div>
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
        },
      )}
    </ul>
  );
}

export default List;
