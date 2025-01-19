import type { PropsWithChildren } from "react";

import { Main } from "@/layouts";
import { cn } from "@/utils/tailwind";

function Layout({ children }: PropsWithChildren) {
  return (
    <section className={cn("flex", "flex-col", "h-full")}>
      <Main>{children}</Main>
    </section>
  );
}

export default Layout;
