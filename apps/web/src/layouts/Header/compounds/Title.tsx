import Link from "next/link";
import { PropsWithChildren } from "react";

import { cn } from "@/utils/tailwind";

function Title({ children }: PropsWithChildren) {
  if (!children) {
    return (
      <Link href="/" className={cn("text-lg", "font-bold")}>
        MOMUK
      </Link>
    );
  }

  return <h1 className={cn("text-lg", "font-bold")}>{children}</h1>;
}

export default Title;
