import type { PropsWithChildren } from "react";

import { XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Header, Main } from "@/layouts";
import { cn } from "@/utils/tailwind";

function Layout({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <>
      <Header>
        <div className={cn("relative")}></div>
        <h1 className={cn("text-lg", "font-bold", "truncate", "max-w-36")}>
          모임원 초대
        </h1>
        <div className={cn("relative")}>
          <div
            className={cn(
              "absolute",
              "top-0",
              "right-0",
              "-translate-y-1/2",
              "flex",
              "gap-2",
            )}
          >
            <Link href={`/assemble/${router.query.assembleId}/waiting-room`}>
              <XIcon />
            </Link>
          </div>
        </div>
      </Header>
      <Main className={cn("flex", "flex-col")}>{children}</Main>
    </>
  );
}

export default Layout;
