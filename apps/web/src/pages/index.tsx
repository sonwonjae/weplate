import type { ServerResponse } from "http";

import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { createRouter } from "next-connect";
import { toast } from "sonner";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import { AssembleList } from "@/pages-src/index/components";
import Layout from "@/pages-src/index/layout";
import middleware, { HomePageReq } from "@/pages-src/index/middleware";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

const router = createRouter<HomePageReq, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function HomePage() {
  const router = useRouter();
  const isWithinCreationLimitQuery = new RQClient({
    url: "/api/assemble/check/within-creation-limit",
  });
  const { data: { isWithinCreationLimit, limit } = {} } = useQuery(
    isWithinCreationLimitQuery.queryOptions,
  );

  const moveCreateAssemblePage = () => {
    if (isWithinCreationLimit) {
      router.push("/assemble/create");
    } else {
      toast.info(`모임 갯수는 ${limit}개를 초과할 수 없습니다.`);
    }
  };

  return (
    <>
      <section className={cn("w-full", "py-4", "px-5", "bg-background")}>
        <div
          role="button"
          onClick={moveCreateAssemblePage}
          className={cn(
            "flex",
            "items-center",
            "gap-3",
            "rounded-md",
            "bg-slate-100",
            "hover:bg-slate-200/60",
            "active:bg-slate-200/60",
            "py-4",
            "px-6",
            "w-full",
          )}
        >
          <div
            className={cn(
              "flex",
              "justify-center",
              "items-center",
              "w-10",
              "h-10",
              "bg-primary",
              "rounded-full",
              "text-primary-foreground",
            )}
          >
            <PlusIcon size={30} />
          </div>
          <div className={cn("flex-1")}>
            <h3 className={cn("font-bold")}>모임 만들기</h3>
            <p className={cn("text-xs", "text-slate-500", "break-keep")}>
              새로운 모임을 만들고 취향 맞춤 음식을 추천받아보세요.
            </p>
          </div>
        </div>
      </section>
      <h2
        className={cn(
          "text-lg",
          "font-bold",
          "bg-background",
          "px-5",
          "pb-2",
          "bg-background",
        )}
      >
        진행중인 모임
      </h2>
      <div
        className={cn(
          "overflow-hidden",
          "relative",
          "flex-1",
          "space-y-3",
          "flex",
          "flex-col",
          "bg-background",
        )}
      >
        <AssembleList />
      </div>
    </>
  );
}

HomePage.Layout = Layout;

export default HomePage;
