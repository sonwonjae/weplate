import type { PropsWithChildren } from "react";

import { ChevronRightIcon, HomeIcon } from "lucide-react";
import Link from "next/link";

import { Header, Main, Footer } from "@/layouts";
import { cn } from "@/utils/tailwind";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header>
        <div />
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
      <section className={cn("w-full", "py-4", "px-5", "bg-background")}>
        <div
          className={cn("flex", "bg-amber-50", "rounded-md", "py-3", "px-4")}
          onClick={() => {
            window.open("http://bit.ly/3VQOABC", "_blank");
          }}
        >
          <p className={cn("flex-1")}>
            <span className={cn("block", "text-lg")}>
              여러분의 <b>추천 음식</b>을 공유해주세요!
            </span>
            <span className={cn("block", "text-sm", "text-slate-600")}>
              새로운 음식 등록 요청하기
            </span>
          </p>
          <button type="button">
            <ChevronRightIcon />
          </button>
        </div>
      </section>
      <Main>{children}</Main>
      <Footer>
        <Footer.HomePageLink />
        <Footer.CreateAssembleButton />
        <Footer.MyInfoPageLink />
      </Footer>
    </>
  );
}

export default Layout;
