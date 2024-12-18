import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EllipsisIcon, PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

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
import { apiAxios, RQClient } from "@/utils/react-query";
import { ResponseMap } from "@/utils/react-query/types";
import { cn } from "@/utils/tailwind";

interface AssembleItemPureProps {
  isActiveToolsAssembleId: string | null;
  activeTools: boolean;
  changeActiveTools: (assembleId: string) => void;
}
type AssembleItemProps = ResponseMap["/api/assemble/list/my"][number] &
  AssembleItemPureProps;

function AssembleItem({
  isActiveToolsAssembleId,
  activeTools,
  changeActiveTools,

  id: assembleId,
  title,
}: AssembleItemProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const myAssembleListQuery = new RQClient({ url: "/api/assemble/list/my" });

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
        <div className={cn("flex", "gap-3", "w-full", "items-center")}>
          <div className={cn("w-12", "h-12", "rounded-full", "bg-slate-100")} />
          <div className={cn("flex-1", "flex", "flex-col", "gap-1")}>
            <Link
              href={`/assemble/${assembleId}`}
              className={cn(
                "block",
                "w-full",
                "hover:text-primary",
                "font-bold",
              )}
            >
              {title}
            </Link>
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
              N명과 함께
            </span>
          </div>
          <div className={cn("relative", "h-12")}>
            <div
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
                hidden={activeTools}
                disabled={activeTools}
                color="link"
                size="icon-md"
                className={cn(
                  "text-slate-600",
                  "hover:text-primary",
                  "active:text-primary",
                )}
                onClick={() => {
                  return changeActiveTools(assembleId);
                }}
              >
                <EllipsisIcon />
              </Button>
            </div>
            <div
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
                hidden={toolsState === "inactive" || toolsState === "init"}
                disabled={toolsState === "inactive" || toolsState === "init"}
                color="link"
                size="icon-md"
                className={cn(
                  "text-slate-600",
                  "hover:text-primary",
                  "active:text-primary",
                )}
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
                    className={cn(
                      "text-slate-600",
                      "hover:text-primary",
                      "active:text-primary",
                    )}
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
                        color="outline"
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
                        return deleteAssemble();
                      }}
                    >
                      확인
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </li>
    </>
  );
}

export default AssembleItem;
