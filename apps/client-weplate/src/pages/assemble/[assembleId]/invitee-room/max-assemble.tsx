import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import Image from "next/image";
import { useRouter } from "next/router";
import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import Head from "@/pages-src/assemble/[assembleId]/invitee-room/max-assemble/head";
import Layout from "@/pages-src/assemble/[assembleId]/invitee-room/max-assemble/layout";
import middleware from "@/pages-src/assemble/[assembleId]/invitee-room/max-assemble/middleware";
import { Button } from "@/shad-cn/components/ui/button";
import { cn } from "@/utils/tailwind";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function AssembleInviteeRoomPage() {
  const router = useRouter();

  const moveHomePage = () => {
    router.replace("/");
  };

  return (
    <section
      className={cn(
        "pt-32",
        "px-5",
        "flex",
        "flex-col",
        "gap-8",
        "justify-center",
        "items-center",
      )}
    >
      <Image width={110} height={128} src="/plate_chief_cry.svg" alt="chief" />
      <div
        className={cn(
          "flex",
          "flex-col",
          "gap-6",
          "justify-center",
          "items-center",
        )}
      >
        <p
          className={cn(
            "text-sm",
            "text-slate-500",
            "break-keep",
            "text-center",
          )}
        >
          <span className={cn("font-bold")}>앗!</span>
          <br />
          <span className={cn("font-bold", "text-primary")}>
            참여 가능한 모임 개수를 초과
          </span>
          <span>했어요!</span>
          <br />
          <span>기존 모임을 정리하면</span>
          <br />
          <span>새로운 초대를 받을 수 있어요.</span>
        </p>
      </div>

      <Button size="lg" round className={cn("w-full")} onClick={moveHomePage}>
        모임 정리 하기
      </Button>
    </section>
  );
}

AssembleInviteeRoomPage.Head = Head;
AssembleInviteeRoomPage.Layout = Layout;

export default AssembleInviteeRoomPage;
