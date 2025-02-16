import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import Head from "@/pages-src/assemble/[assembleId]/invitee-room/full/head";
import Layout from "@/pages-src/assemble/[assembleId]/invitee-room/full/layout";
import middleware from "@/pages-src/assemble/[assembleId]/invitee-room/full/middleware";
import { Button } from "@/shad-cn/components/ui/button";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function AssembleInviteeRoomPage() {
  const router = useRouter();
  const assembleQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/item`,
  });
  const { data: assemble } = useQuery(assembleQuery.queryOptions);

  const moveCreateAssemblePage = () => {
    router.replace("/assemble/create");
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
            {assemble?.ownerInfo?.nickname}
          </span>
          <span>님의 모임 인원이 가득 찼어요.</span>
          <br />
          <span>새로운 모임을 생성해보세요.</span>
        </p>
      </div>

      <Button
        size="lg"
        round
        className={cn("w-full")}
        onClick={moveCreateAssemblePage}
      >
        새로운 모임 만들기
      </Button>
    </section>
  );
}

AssembleInviteeRoomPage.Head = Head;
AssembleInviteeRoomPage.Layout = Layout;

export default AssembleInviteeRoomPage;
