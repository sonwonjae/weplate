import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EllipsisIcon, PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { Button } from "@/shad-cn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shad-cn/components/ui/dialog";
import { apiAxios, RQInfinityClient } from "@/utils/react-query";
import { InfinityResponseMap } from "@/utils/react-query/infinity";
import { cn } from "@/utils/tailwind";

import MemberList from "./MemberList";

interface AssembleItemPureProps {
  isActiveToolsAssembleId: string | null;
  activeTools: boolean;
  changeActiveTools: (assembleId: string) => void;
}
type AssembleItemProps =
  InfinityResponseMap["/api/assemble/list/my"]["list"][number] &
    AssembleItemPureProps;

function AssembleItem({
  isActiveToolsAssembleId,
  activeTools,
  changeActiveTools,

  id: assembleId,
  title,
  userAssembleList,
  permission,
}: AssembleItemProps) {
  const toolsContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const queryClient = useQueryClient();
  const myAssembleListQuery = new RQInfinityClient({
    url: "/api/assemble/list/my",
    params: router.query,
  });

  const { mutateAsync: deleteAssemble, isPending } = useMutation({
    mutationFn: async () => {
      // FIXME: 유틸화 하기
      const { data: deletedAssemble } = await apiAxios.delete<{
        id: string;
        title: string;
      }>(`/api/assemble/${assembleId}/item`);

      await queryClient.invalidateQueries({
        queryKey: myAssembleListQuery.queryKey,
      });

      return deletedAssemble;
    },
  });

  const toolsState = (() => {
    switch (true) {
      case typeof isActiveToolsAssembleId !== "string":
        return "init";
      case isActiveToolsAssembleId === assembleId:
        return "active";
      case isActiveToolsAssembleId !== assembleId:
        return "inactive";
      default:
        return "init";
    }
  })();

  useEffect(() => {
    if (!toolsContainerRef.current) {
      return;
    }

    toolsContainerRef.current.style.paddingRight = `${
      toolsContainerRef.current.querySelector("div:not([hidden])")
        ?.clientWidth || 0
    }px`;
  }, [toolsState]);

  return (
    <>
      <li
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
        <Link
          prefetch={false}
          shallow={false}
          href={`/assemble/${assembleId}`}
          className={cn("flex", "gap-3", "w-full", "items-center")}
        >
          <MemberList memberList={userAssembleList} />
          <div
            className={cn("flex-1", "flex", "flex-col", "gap-1", "truncate")}
          >
            <span
              className={cn(
                "flex-1",
                "block",
                "hover:text-primary",
                "font-bold",
                "truncate",
              )}
            >
              {title}
            </span>
            <span
              className={cn(
                "inline-block",
                "h-4",
                "text-xs",
                "text-slate-400",
                "font-normal",
                "select-none",
              )}
            >
              {userAssembleList.length <= 1 && "혼자 참여 중"}
              {userAssembleList.length > 1 &&
                `${userAssembleList.length}명 참여 중`}
            </span>
          </div>
          <div
            ref={toolsContainerRef}
            className={cn(
              "relative",
              "h-12",
              permission !== "owner" && "hidden",
            )}
          >
            <div
              hidden={toolsState === "active"}
              className={cn(
                "absolute",
                "top-0",
                "bottom-0",
                "right-0",
                "flex",
                "gap-1",
                "items-center",
                toolsState === "active" &&
                  "animate-[fade-out-right_0.2s_ease-in-out_forwards]",
              )}
            >
              <Button
                disabled={activeTools}
                color="link"
                size="icon-md"
                onClick={() => {
                  return changeActiveTools(assembleId);
                }}
              >
                <EllipsisIcon />
              </Button>
            </div>
            <div
              hidden={toolsState !== "active"}
              className={cn(
                "absolute",
                "top-0",
                "bottom-0",
                "right-0",
                "flex",
                "gap-1",
                "items-center",
                (toolsState === "inactive" || toolsState === "init") &&
                  "hidden",
                toolsState === "active" &&
                  "animate-[fade-in-left_0.2s_ease-in-out_forwards]",
                (toolsState === "inactive" || toolsState === "init") &&
                  "animate-[fade-out-right_0.2s_ease-in-out_forwards]",
              )}
            >
              <Button
                disabled={toolsState === "inactive" || toolsState === "init"}
                color="link"
                size="icon-md"
                onClick={() => {
                  router.push(`/assemble/${assembleId}/edit`);
                }}
              >
                <PencilIcon />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    hidden={toolsState === "inactive" || toolsState === "init"}
                    disabled={
                      toolsState === "inactive" || toolsState === "init"
                    }
                    color="link"
                    size="icon-md"
                  >
                    <TrashIcon />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>모임을 삭제하시겠습니까?</DialogTitle>
                    <DialogDescription>
                      모임에 등록된 모임 인원 및 음식 추천 리스트가 삭제됩니다.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className={cn("flex-row")}>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        outline
                        className={cn("w-full")}
                        disabled={isPending}
                      >
                        취소
                      </Button>
                    </DialogClose>
                    <Button
                      type="button"
                      disabled={isPending}
                      className={cn("w-full")}
                      onClick={() => {
                        deleteAssemble();
                      }}
                    >
                      확인
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Link>
      </li>
    </>
  );
}

export default AssembleItem;
