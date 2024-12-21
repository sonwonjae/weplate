import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import Layout from "@/pages-src/assemble/[assembleId]/request-invite/layout";
import middleware from "@/pages-src/assemble/[assembleId]/request-invite/middleware";
import { cn } from "@/utils/tailwind";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function AssembleRequestInvitePage() {
  return <section className={cn("py-4", "px-5")}>hello</section>;
}

AssembleRequestInvitePage.Layout = Layout;

export default AssembleRequestInvitePage;
