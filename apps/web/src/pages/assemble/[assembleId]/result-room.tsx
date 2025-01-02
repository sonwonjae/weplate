import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import { ResultList } from "@/pages-src/assemble/[assembleId]/result-room/components";
import Layout from "@/pages-src/assemble/[assembleId]/result-room/layout";
import middleware from "@/pages-src/assemble/[assembleId]/result-room/middleware";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function AssembleWaitingRoomPage() {
  return <ResultList />;
}

AssembleWaitingRoomPage.Layout = Layout;

export default AssembleWaitingRoomPage;
