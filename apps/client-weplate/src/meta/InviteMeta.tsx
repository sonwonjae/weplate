import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { RQClient } from "@/utils/react-query";

function InviteMeta() {
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

  return (
    <>
      <meta property="og:type" content="website" />
      <meta property="og:url" content={process.env.NEXT_PUBLIC_HOST} />
      <meta property="og:title" content="취향 존중 메뉴 추천 - 위플레이트" />
      <meta
        property="og:description"
        content={`${owner?.nickname}님의 모임 초대장이 도착했어요.`}
      />
      <meta property="og:site_name" content="위플레이트" />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:image" content="/meta-user-invite.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </>
  );
}

export default InviteMeta;
