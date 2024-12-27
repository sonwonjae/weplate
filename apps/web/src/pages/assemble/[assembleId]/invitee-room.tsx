import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import Layout from "@/pages-src/assemble/[assembleId]/invitee-room/layout";
import middleware from "@/pages-src/assemble/[assembleId]/invitee-room/middleware";
import { cn } from "@/utils/tailwind";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function AssembleInviteeRoomPage() {
  return (
    <section
      className={cn("py-4", "px-5", "h-full", "flex", "flex-col", "gap-3")}
    >
      <h2 className={cn("font-bold", "text-2xl")}>너 초대당한거야</h2>
    </section>
  );
}

AssembleInviteeRoomPage.Layout = Layout;

export default AssembleInviteeRoomPage;
