import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

function Title() {
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
    <h2 className={cn("pt-8", "px-5", "font-bold", "text-md")}>
      음식 정보 등록 현황{" "}
      <span>
        <span className={cn("text-primary")}>{registedMemberCount}</span>/
        <span>{assembleUserList.length}</span>
      </span>
    </h2>
  );
}

export default Title;
