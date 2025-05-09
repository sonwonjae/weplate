import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { Skeleton } from "@/shad-cn/components/ui/skeleton";
import { ThreeDots } from "@/ui/loading/icons";
import { RQInfinityClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import AssembleItem from "./AssembleItem";

function AssembleList() {
  const router = useRouter();

  const myAssembleListQuery = new RQInfinityClient({
    url: "/api/assemble/list/my",
    params: router.query,
  });
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(myAssembleListQuery.queryOptions);
  const { ref, inView } = useInView();

  const isUpdating = isLoading;

  const [isActiveToolsAssembleId, changeActiveTools] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (!data) {
    return;
  }

  const myAssembleList = data.pages
    .flatMap(({ list }) => {
      return list;
    })
    .filter(Boolean);

  if (!myAssembleList || !myAssembleList.length) {
    return (
      <div
        className={cn(
          "flex-1",
          "flex",
          "flex-col",
          "justify-center",
          "items-center",
          "gap-3",
        )}
      >
        <h2 className={cn("font-bold", "text-xl")}>첫 모임을 만들어보세요.</h2>
        <p>
          친구, 가족, 동료들과 함께
          <br />
          맛있는 여정을 시작하세요.
        </p>
      </div>
    );
  }

  if (isUpdating) {
    return (
      <ul
        className={cn(
          "flex-1",
          "flex",
          "flex-col",
          "gap-3",
          "pt-2",
          "pb-4",
          "px-5",
        )}
      >
        {Array.from({ length: 5 }, (_, index) => {
          return (
            <li
              key={index}
              className={cn(
                "relative",
                "block",
                "min-h-fit",
                "w-full",
                "rounded-md",
                "no-underline",
                "bg-white",
                "[box-shadow:0_0_0_1px_rgba(0,0,0,.05),0_2px_4px_rgba(0,0,0,.1)]",
                "py-4",
                "px-6",
              )}
            >
              <div className={cn("flex", "gap-3", "w-full", "items-center")}>
                <Skeleton className={cn("w-12", "h-12", "rounded-full")} />
                <div className={cn("flex-1", "flex", "flex-col", "gap-1")}>
                  <Skeleton className={cn("w-full", "h-6")} />
                  <Skeleton className={cn("w-14", "h-4")} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        "flex-1",
        "flex",
        "flex-col",
        "gap-3",
        "pt-2",
        "pb-4",
        "px-5",
      )}
    >
      {myAssembleList.map((assembleItem) => {
        return (
          <AssembleItem
            key={assembleItem.id}
            isActiveToolsAssembleId={isActiveToolsAssembleId}
            activeTools={isActiveToolsAssembleId === assembleItem.id}
            changeActiveTools={changeActiveTools}
            {...assembleItem}
          />
        );
      })}
      {myAssembleList.length >=
        Number(process.env.NEXT_PUBLIC_ASSEMBLE_PAGE_LIMIT) && (
        <div
          ref={ref}
          className={cn(
            "flex",
            "justify-center",
            "items-center",
            "w-full",
            "pt-2",
            "pb-8",
            "rounded-md",
            "bg-white",
            "text-slate-400",
          )}
        >
          {isFetchingNextPage ? (
            <ThreeDots height={15} />
          ) : hasNextPage ? (
            "더보기"
          ) : (
            "더 이상 모임이 없습니다."
          )}
        </div>
      )}
    </ul>
  );
}

export default AssembleList;
