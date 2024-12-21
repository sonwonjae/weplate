import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import Layout from "@/pages-src/assemble/[assembleId]/layout";
import middleware from "@/pages-src/assemble/[assembleId]/middleware";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function AssembleItemPage() {
  const router = useRouter();
  const authQuery = new RQClient({ type: "auth", url: "/api/user/auth/check" });
  const assembleQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/item`,
  });

  const { data: userInfo } = useQuery(authQuery.queryOptions);
  const { data: assemble } = useQuery(assembleQuery.queryOptions);

  return (
    <section className={cn("py-4", "px-5")}>
      <span className={cn("font-bold")}>[{userInfo?.name}]</span>님{" "}
      <span className={cn("font-bold", "py-4", "px-5")}>
        [{assemble?.title}]
      </span>
      에 오신 것을 환영해요.
    </section>
  );
}

AssembleItemPage.Layout = Layout;

export default AssembleItemPage;
