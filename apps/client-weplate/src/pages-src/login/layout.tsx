import type { PropsWithChildren } from "react";

import { Main } from "@/layouts";
import { cn } from "@/utils/tailwind";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Main className={cn("h-full")}>{children}</Main>
    </>
  );
}

export default Layout;
