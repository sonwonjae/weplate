import { useQuery } from "@tanstack/react-query";
import NextHead from "next/head";
import { useRouter } from "next/router";

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
  const description = `${owner?.nickname}님의 초대장이 도착했어요. 함께 취향 맞춤 음식을 추천 받아보세요.`;

  return (
    <NextHead>
      <title>{title}</title>
      <meta name="Description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={process.env.NEXT_PUBLIC_HOST} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content="Description Here" />
      <meta property="og:site_name" content="Weplate" />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:image" content="https://example.com/image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </NextHead>
  );
}

export default Head;
