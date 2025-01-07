import type { PropsWithChildren } from "react";

import { HomeIcon } from "lucide-react";
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
