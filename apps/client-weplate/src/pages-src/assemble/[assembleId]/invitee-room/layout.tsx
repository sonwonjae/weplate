import type { PropsWithChildren } from "react";

import { Header, Main } from "@/layouts";
import { cn } from "@/utils/tailwind";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header>
        <div className={cn("relative")}></div>
        <Header.Title />
        <div className={cn("relative")}></div>
      </Header>
      <Main className={cn("flex", "flex-col")}>{children}</Main>
    </>
  );
}

export default Layout;
