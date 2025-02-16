import type { PropsWithChildren } from "react";

import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { Header, Main, Footer } from "@/layouts";
import { Button, buttonVariants } from "@/shad-cn/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/shad-cn/components/ui/dialog";
import { apiAxios } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import { myQuitForm } from "./layer";

function Layout({ children }: PropsWithChildren) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useFormContext<z.infer<typeof myQuitForm>>();
  const {
    isVerified = false,
    isAgree = false,
    suggestion = "",
  } = useWatch<z.infer<typeof myQuitForm>>();

  const { mutateAsync: submitMyQuitForm } = useMutation({
    mutationFn: async () => {
      const { reason, suggestion } = form.getValues();
      await apiAxios.delete("/api/auth/quit", {
        data: {
          reason,
          suggestion,
        },
      });

      queryClient.removeQueries();
      router.replace("/my/quit/complete");
    },
  });

  return (
    <form className={cn("flex", "flex-col", "h-full")}>
      <Header>
        <div className={cn("relative")}>
          <Link
            href="/my/info"
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
        <Header.Title>마이페이지</Header.Title>
        <div className={cn("relative")}>
          <Link
            href="/"
            className={cn(
              "absolute",
              "top-0",
              "right-0",
              "-translate-y-1/2",
              "flex",
              "gap-2",
            )}
          >
            <HomeIcon />
          </Link>
        </div>
      </Header>
      <Main>{children}</Main>
      <Footer>
        <div className={cn("w-full", "flex", "flex-row", "gap-2")}>
          <Link
            href="/my/info"
            className={cn(buttonVariants({ size: "lg", outline: true }))}
          >
            취소
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                disabled={!isVerified || !isAgree || suggestion.length > 500}
                type="button"
                size="lg"
                className={cn("flex-1")}
              >
                회원탈퇴
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogDescription>정말 탈퇴하시겠습니까?</DialogDescription>
              </DialogHeader>
              <DialogFooter className={cn("flex-row")}>
                <DialogClose asChild>
                  <Button type="button" outline className={cn("w-full")}>
                    취소
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className={cn("w-full")}
                  onClick={form.handleSubmit(() => {
                    submitMyQuitForm();
                  })}
                >
                  확인
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Footer>
    </form>
  );
}

export default Layout;
