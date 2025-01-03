import { XIcon } from "lucide-react";
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
import { cn } from "@/utils/tailwind";

import { useRegistFoodStore } from "../../stores/regist-foods";

function StopRegistFood() {
  const router = useRouter();

  const searchActiveState = useRegistFoodStore((state) => {
    return state.searchActiveState();
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          hidden={searchActiveState === "in"}
          className={cn(
            "absolute",
            "top-0",
            "right-0",
            "flex",
            "items-center",
            searchActiveState === "out" &&
              "animate-[fade-in-left_0.2s_ease-in-out_forwards]",
            searchActiveState === "in" &&
              "animate-[fade-out-right_0.2s_ease-in-out_forwards]",
          )}
        >
          <XIcon aria-hidden={searchActiveState === "in"} size={20} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>음식 등록을 멈추시겠어요?</DialogTitle>
          <DialogDescription>
            소중히 고르신 음식이 저장되지 않을 수 있어요. 그래도 진행할까요?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={cn("flex-row")}>
          <Button
            type="button"
            outline
            className={cn("w-full")}
            onClick={() => {
              router.replace("/");
            }}
          >
            나가기
          </Button>
          <DialogClose asChild>
            <Button type="button" className={cn("w-full")}>
              계속 등록하기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default StopRegistFood;
