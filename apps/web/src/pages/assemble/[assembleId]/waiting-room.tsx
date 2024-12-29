import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import {
  InviteMember,
  WaitMember,
} from "@/pages-src/assemble/[assembleId]/waiting-room/components";
import Layout from "@/pages-src/assemble/[assembleId]/waiting-room/layout";
import middleware from "@/pages-src/assemble/[assembleId]/waiting-room/middleware";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function AssembleWaitingRoomPage() {
  return (
    <>
      <InviteMember />
      <WaitMember />
    </>
  );
}

AssembleWaitingRoomPage.Layout = Layout;

export default AssembleWaitingRoomPage;
