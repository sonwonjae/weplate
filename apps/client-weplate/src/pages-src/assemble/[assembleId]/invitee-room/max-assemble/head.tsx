import { useQuery } from "@tanstack/react-query";
import NextHead from "next/head";
import { useRouter } from "next/router";

import InviteMeta from "@/meta/InviteMeta";
import { RQClient } from "@/utils/react-query";

function Head() {
  const router = useRouter();
  const assembleUserListQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/user/list`,
  });
  const { data: assembleUserList = [] } = useQuery(
    assembleUserListQuery.queryOptions,
  );

  const owner = assembleUserList.find(({ permission }) => {
    return permission === "owner";
  });

  const title = `${owner?.nickname}님의 초대장`;
  const description = `${owner?.nickname}님의 초대장이 도착했어요.`;

  return (
    <NextHead>
      <title>{title}</title>
      <meta name="Description" content={description} />
      <InviteMeta />
    </NextHead>
  );
}

export default Head;
