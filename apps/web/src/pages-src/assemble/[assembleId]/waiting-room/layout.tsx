import type { PropsWithChildren } from "react";

import { useQuery } from "@tanstack/react-query";
import {
  ChefHatIcon,
  ChevronLeftIcon,
  ShareIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { Header, Footer, Main } from "@/layouts";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

function Layout({ children }: PropsWithChildren) {
  const router = useRouter();

  const assembleQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/item`,
  });

  const { data: assemble } = useQuery(assembleQuery.queryOptions);

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
    <>
      <Header>
        <div className={cn("relative")}>
          <Link
            href="/"
            className={cn(
              "absolute",
              "top-0",
              "left-0",
              "-translate-y-1/2",
              "flex",
              "gap-2",
            )}
          >
            <ChevronLeftIcon />
          </Link>
        </div>
        <h1 className={cn("text-lg", "font-bold", "truncate", "max-w-36")}>
          {assemble?.title}
        </h1>
        <div className={cn("relative")}>
          <div
            className={cn(
              "absolute",
              "top-0",
              "right-0",
              "-translate-y-1/2",
              "flex",
              "gap-2",
            )}
          >
            <Link href={`/assemble/${router.query.assembleId}/invite-user`}>
              <UserRoundPlusIcon />
            </Link>
            <button type="button" onClick={shareAssembleLink}>
              <ShareIcon />
            </button>
            <ChefHatIcon />
          </div>
        </div>
      </Header>
      <Main className={cn("flex", "flex-col")}>{children}</Main>
      <Footer>
        <Footer.HomePageLink />
        <Footer.CreateAssembleButton />
        <Footer.MyInfoPageLink />
      </Footer>
    </>
  );
}

export default Layout;
