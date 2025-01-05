import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { cva } from "class-variance-authority";
import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import { Profile } from "@/pages-src/my/info/components";
import { UpdateUserInfoForm } from "@/pages-src/my/info/components";
import Layout from "@/pages-src/my/info/layout";
import middleware from "@/pages-src/my/info/middleware";
import { cn } from "@/utils/tailwind";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/shad-cn/components/ui/dialog";
import { Button } from "@/shad-cn/components/ui/button";
import { authAxios, RQClient } from "@/utils/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

const titleVariants = cva(
  cn(
    "border-b",
    "border-l-slate-200",
    "w-full",
    "py-2",
    "px-5",
    "font-bold",
    "bg-slate-50",
    "text-slate-600",
    "text-sm",
  ),
);
const itemVariants = cva(
  cn("border-b", "border-l-slate-200", "w-full", "py-4", "px-5", 'text-left'),
);

function MyInfo() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const authQuery = new RQClient({ url: "/api/user/auth/check" });


  return (
    <>
      <Profile />
      <UpdateUserInfoForm />
      <section className={cn("w-full", "bg-background")}>
        <ul className={cn("pb-20")}>
          <li className={cn(titleVariants())}>음식 추가</li>
          <li
            className={cn(itemVariants())}
            onClick={() => {
              window.open("http://bit.ly/3VQOABC", "_blank");
            }}
          >
            새로운 음식 제안
          </li>

          <li className={cn(titleVariants())}>고객 지원</li>
          <li className={cn(itemVariants())}>개인정보처리방침</li>
          <li className={cn(itemVariants())}>이용약관</li>

          <li className={cn(titleVariants())}>계정 설정</li>
          <li>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className={cn(itemVariants())}
                >
                  로그아웃
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogDescription>
                    로그아웃 하시겠어요?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className={cn("flex-row")}>
                  <DialogClose asChild>
                    <Button type="button" outline className={cn("w-full")}>
                      취소
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    className={cn("w-full")}
                    onClick={async () => {
                        await authAxios.get('/api/user/auth/logout');
                        queryClient.removeQueries()
                        router.replace('/login')
                    }}
                  >
                    로그아웃
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </li>
          <li className={cn(itemVariants(), "text-slate-400")}>회원탈퇴</li>
        </ul>
      </section>
    </>
  );
}

MyInfo.Layout = Layout;

export default MyInfo;
