import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import Cookies from "js-cookie";
import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { createRouter } from "next-connect";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import { myQuitForm } from "@/pages-src/my/quit/layer";
import Layer from "@/pages-src/my/quit/layer";
import Layout from "@/pages-src/my/quit/layout";
import middleware from "@/pages-src/my/quit/middleware";
import { Button, buttonVariants } from "@/shad-cn/components/ui/button";
import { Checkbox } from "@/shad-cn/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormTextarea,
} from "@/shad-cn/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shad-cn/components/ui/select";
import { MoveRequestNewFoodForm } from "@/ui/move-form";
import { cn } from "@/utils/tailwind";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function MyQuit() {
  const form = useFormContext<z.infer<typeof myQuitForm>>();

  const { isVerified = false } = useWatch<z.infer<typeof myQuitForm>>();

  const isSuccessVerification =
    Cookies.get(process.env.NEXT_PUBLIC_AUTH_CHECK_COOKIE_NAME as string) ===
    "success";

  useEffect(() => {
    window.Cookies = Cookies;
    if (!isSuccessVerification) {
      return;
    }

    /** NOTE: page mount와 동시에 toast를 띄우면 정상동작하지 않아서 호출 스케줄러에 넣어두었다가 콜백함수 실행하는 식으로 로직 구현 */
    setTimeout(() => {
      toast.info("카카오 계정 인증이 완료되었습니다.", {
        position: "bottom-left",
      });
      form.setValue("isVerified", true);
      Cookies.remove(process.env.NEXT_PUBLIC_AUTH_CHECK_COOKIE_NAME as string);
    });
  }, [isSuccessVerification]);

  return (
    <>
      <MoveRequestNewFoodForm />
      {/* <Test /> */}
      <section className={cn("w-full", "bg-background", "py-2", "px-5")}>
        <h2 className={cn("font-bold", "text-xl")}>회원 탈퇴 안내</h2>
        <p className={cn("text-sm", "text-slate-600", "mt-1")}>
          회원 탈퇴 시{" "}
          <span className={cn("text-primary", "font-bold")}>
            서비스 이용 제한 및 데이터가 삭제
          </span>
          됩니다.
          <br />
          한번 삭제된 정보는 복구가 불가능합니다.
        </p>
        <h3 className={cn("font-bold", "text-lg", "mt-5")}>삭제되는정보</h3>
        <ul className={cn("text-sm", "text-slate-600", "mt-1")}>
          <li>• 계정 정보 및 프로필 정보</li>
          <li>• 생성/참여 중인 모임, 초대한 모임원 정보</li>
          <li>• 등록한 선호/비선호 음식 정보</li>
        </ul>
      </section>
      <section className={cn("w-full", "bg-background", "py-2", "px-5")}>
        {isVerified && (
          <Button disabled className={cn("w-full", "flex", "justify-between")}>
            <div className={cn("relative")}>
              <CheckCircle2Icon
                className={cn(
                  "absolute",
                  "top-0",
                  "left-0",
                  "-translate-y-3",
                  "fill-primary",
                  "stroke-white",
                )}
              />
            </div>
            <span>카카오 계정 인증 완료</span>
            <div />
          </Button>
        )}
        {!isVerified && (
          <Link
            href={`${process.env.NEXT_PUBLIC_HOST}/api/user/kakao/check?redirectUrl=${process.env.NEXT_PUBLIC_HOST}/my/quit`}
            className={cn(
              buttonVariants({
                outline: true,
                color: "secondary",
              }),
              "w-full",
              "text-black",
            )}
          >
            카카오 계정 인증
          </Link>
        )}
      </section>
      <section
        className={cn(
          "w-full",
          "bg-background",
          "py-6",
          "pb-32",
          "px-5",
          "space-y-3",
        )}
      >
        <h4 className={cn("font-bold", "text-sm")}>
          탈퇴 이유를 알려주시겠어요?
        </h4>
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => {
            return (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="선택해주세요." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="원하는 기능이 부족해서">
                      원하는 기능이 부족해서
                    </SelectItem>
                    <SelectItem value="사용 방법이 복잡해서">
                      사용 방법이 복잡해서
                    </SelectItem>
                    <SelectItem value="추천된 정보가 만족스럽지 않아서">
                      추천된 정보가 만족스럽지 않아서
                    </SelectItem>
                    <SelectItem value="서비스 이용 빈도가 낮아서">
                      서비스 이용 빈도가 낮아서
                    </SelectItem>
                    <SelectItem value="기타 (직접 입력)">
                      기타 (직접 입력)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="suggestion"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <FormTextarea
                    rows={7}
                    maxLength={500}
                    counter
                    placeholder={`더 나은 서비스를 위해 노력하겠습니다.\n소중한 의견을 들려주세요.(선택)`}
                    className={cn("resize-y")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="isAgree"
          render={({ field }) => {
            return (
              <FormItem
                className={cn(
                  "flex",
                  "flex-row",
                  "items-start",
                  "space-x-2",
                  "space-y-0",
                )}
              >
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className={cn("text-sm")}>
                  모든 데이터가 삭제되며, 탈퇴에 동의합니다.
                </FormLabel>
              </FormItem>
            );
          }}
        />
      </section>
    </>
  );
}

MyQuit.Layer = Layer;
MyQuit.Layout = Layout;

export default MyQuit;
