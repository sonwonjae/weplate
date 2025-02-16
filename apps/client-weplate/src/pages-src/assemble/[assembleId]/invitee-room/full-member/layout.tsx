import type { PropsWithChildren } from "react";

import { HomeIcon } from "lucide-react";
import Link from "next/link";

import { Header, Main } from "@/layouts";
import { cn } from "@/utils/tailwind";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header>
        <div className={cn("relative")}>
          <Link
            href="/"
            className={cn(
              "absolute",
              "top-0",
              "left-0",
              "-translate-y-1/2",
              "flex",
              "gap-2",
            )}
          >
            <HomeIcon />
          </Link>
        </div>
        <Header.Title />
        <div className={cn("relative")}></div>
      </Header>
      <Main className={cn("flex", "flex-col")}>{children}</Main>
    </>
  );
}

export default Layout;
