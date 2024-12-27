import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { UserRoundPlusIcon } from "lucide-react";
import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import Layout from "@/pages-src/assemble/[assembleId]/waiting-room/layout";
import middleware from "@/pages-src/assemble/[assembleId]/waiting-room/middleware";
import { Button } from "@/shad-cn/components/ui/button";
import { cn } from "@/utils/tailwind";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function AssembleRequestInvitePage() {
  return (
    <section
      className={cn(
        "py-4",
        "px-5",
        "h-full",
        "flex",
        "flex-col",
        "gap-2",
        "justify-center",
        "items-center",
      )}
    >
      <p className={cn("text-center")}>
        함께할 사람을 초대하고,
        <br />
        메뉴와 일정을 편하게 정해보세요! (최대{" "}
        {process.env.NEXT_PUBLIC_ASSEMBLE_MAX_USER_COUNT}명)
      </p>
      <Button size="sm" round>
        <UserRoundPlusIcon />
        <span>모임 일행 초대하기</span>
      </Button>
      <Button
        color="link"
        size="sm"
        className={cn("p-0", "h-auto", "text-slate-400")}
      >
        우선 혼자 추천받기
      </Button>
    </section>
  );
}

AssembleRequestInvitePage.Layout = Layout;

export default AssembleRequestInvitePage;
