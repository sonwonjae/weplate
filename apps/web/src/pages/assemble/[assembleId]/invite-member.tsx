import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2Icon, CrownIcon, Share2Icon } from "lucide-react";
import { useRouter } from "next/router";
import { createRouter } from "next-connect";
import { toast } from "sonner";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import Layout from "@/pages-src/assemble/[assembleId]/invite-member/layout";
import middleware from "@/pages-src/assemble/[assembleId]/invite-member/middleware";
import { Button } from "@/shad-cn/components/ui/button";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function AssembleInviteUserPage() {
  const router = useRouter();
  const assembleUserListQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/user/list`,
  });
  const { data: assembleUserList = [] } = useQuery(
    assembleUserListQuery.queryOptions,
  );

  const shareAssembleLink = async () => {
    try {
      if (navigator.canShare()) {
        try {
          await navigator.share({
            url: `${process.env.NEXT_PUBLIC_WEB_SERVER_HOST}/assemble/${router.query.assembleId}/invitee-room`,
          });
          return toast.info("공유 성공");
        } catch {
          return toast.error("공유 실패");
        }
      } else {
        await navigator.clipboard.writeText(
          `${process.env.NEXT_PUBLIC_WEB_SERVER_HOST}/assemble/${router.query.assembleId}/invitee-room`,
        );
        toast.info("클립보드에 복사되었어요.", {
          position: "bottom-left",
        });
      }
    } catch {
      return toast.error("공유 실패");
    }
  };

  return (
    <section
      className={cn("py-4", "px-5", "h-full", "flex", "flex-col", "gap-3")}
    >
      <h2 className={cn("font-bold", "text-2xl")}>
        맛있는 식사를 함께할
        <br />
        모임원을 초대해주세요!
      </h2>
      <div className={cn("w-full", "flex", "flex-col", "gap-1")}>
        <h3 className={cn("font-bold", "text-lg")}>
          모임원 현황{" "}
          <span className={cn("text-primary")}>{assembleUserList.length}</span>/
          {process.env.NEXT_PUBLIC_ASSEMBLE_MAX_USER_COUNT}
        </h3>
        <p className={cn("text-slate-600", "text-sm")}>
          식사를 함께할 친구, 동료, 가족을 초대해 보세요.
          <br />
          모두의 취향을 고려한 맞춤형 음식을 추천해드려요!
        </p>
      </div>
      <div className={cn("flex", "items-center", "gap-2", "flex-wrap")}>
        <Button
          size="lg"
          round
          className={cn("flex-1")}
          onClick={shareAssembleLink}
        >
          <Share2Icon />
          <span>모임원 초대하기</span>
        </Button>
      </div>
      <section>
        <h4
          className={cn(
            "w-full",
            "text-center",
            "text-slate-600",
            "border-b",
            "border-b-primary",
            "py-2",
          )}
        >
          음식 등록 현황{" "}
          <span className={cn("text-primary")}>
            {
              assembleUserList.filter(({ isRegisted }) => {
                return isRegisted;
              }).length
            }
          </span>
        </h4>
        <ul className={cn("flex", "flex-col", "gap-5", "py-5")}>
          {assembleUserList.map(({ id, permission, name, isRegisted }) => {
            return (
              <li key={id} className={cn("flex", "items-center", "gap-2")}>
                <div
                  className={cn(
                    "flex",
                    "justify-center",
                    "items-center",
                    "w-10",
                    "h-10",
                    "rounded-full",
                    permission === "owner" && "border",
                    permission === "owner" && "border-primary",
                    "bg-white",
                  )}
                >
                  <div
                    className={cn("w-9", "h-9", "rounded-full", "bg-slate-200")}
                  />
                </div>
                <div className={cn("w-5", "h-5")}>
                  {permission === "owner" && (
                    <CrownIcon
                      size={16}
                      className={cn("text-yellow-400", "fill-yellow-400")}
                    />
                  )}
                </div>
                <div className={cn("flex-1", "font-bold")}>{name}</div>
                <CheckCircle2Icon
                  size={28}
                  className={cn(
                    "stroke-white",
                    isRegisted && "fill-primary",
                    !isRegisted && "fill-secondary",
                  )}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
}

AssembleInviteUserPage.Layout = Layout;

export default AssembleInviteUserPage;
