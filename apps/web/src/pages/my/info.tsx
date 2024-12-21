import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { useQuery } from "@tanstack/react-query";
import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import Layout from "@/pages-src/my/info/layout";
import middleware from "@/pages-src/my/info/middleware";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function MyInfo() {
  const authQuery = new RQClient({ type: "auth", url: "/api/user/auth/check" });
  const { data: userInfo } = useQuery(authQuery.queryOptions);

  return (
    <section className={cn("w-full", "py-4", "px-5", "bg-background")}>
      {userInfo?.name}님의 마이페이지 입니다.
    </section>
  );
}

MyInfo.Layout = Layout;

export default MyInfo;
