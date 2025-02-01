import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import Image from "next/image";
import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import { KakaoLogin } from "@/pages-src/login/components";
import Head from "@/pages-src/login/head";
import Layout from "@/pages-src/login/layout";
import middleware from "@/pages-src/login/middleware";
import { cn } from "@/utils/tailwind";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function LoginPage() {
  return (
    <section
      className={cn(
        "w-full",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "gap-32",
        "h-full",
        "py-4",
        "px-5",
        "bg-background",
      )}
    >
      <div
        className={cn(
          "w-full",
          "flex",
          "flex-col",
          "items-center",
          "justify-center",
          "gap-4",
        )}
      >
        <Image src="/weplate_login.png" alt="smile" width={320} height={206} />
        <div>
          <h2 className={cn("text-xl", "font-bold", "text-center")}>
            모임의 즐거움을 더하는
            <br />
            취향 존중 메뉴 추천
          </h2>
          <p className={cn("text-slate-600")}>
            <span className={cn("text-primary")}>위플레이트</span>에서
            경험하세요!
          </p>
        </div>
      </div>
      <div className={cn("w-full", "px-4")}>
        <KakaoLogin />
      </div>
    </section>
  );
}

LoginPage.Head = Head;
LoginPage.Layout = Layout;

export default LoginPage;
