import type { PropsWithChildren } from "react";

import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

import { Footer, Header, Main } from "@/layouts";
import { cn } from "@/utils/tailwind";

import { SubmitAgreeServiceButton } from "./components";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header>
        <div className={cn("relative")}>
          <Link
            href="/login"
            replace
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
      </Header>
      <Main className={cn("h-full")}>{children}</Main>
      <Footer>
        <SubmitAgreeServiceButton />
      </Footer>
    </>
  );
}

export default Layout;
