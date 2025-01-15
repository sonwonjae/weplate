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
        "gap-4",
        "h-full",
        "justify-center",
        "py-4",
        "px-5",
        "bg-background",
      )}
    >
      <Image src="/smile.png" alt="smile" width={214} height={210} />
      <h2 className={cn("text-xl", "font-bold")}>
        지금 최적의 음식을 정해보세요!
      </h2>
      <p className={cn("text-slate-600")}>최적의 모임음식 선택</p>
      <div className={cn("w-full", "px-4")}>
        <KakaoLogin />
      </div>
    </section>
  );
}

LoginPage.Head = Head;
LoginPage.Layout = Layout;

export default LoginPage;
