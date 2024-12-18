import { PropsWithChildren } from "react";

import { cn } from "@/utils/tailwind";

function Main({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <main
      className={cn(
        "flex-1",
        "relative",
        "w-full",
        "h-full",
        "overflow-auto",
        className,
      )}
    >
      {children}
    </main>
  );
}

export default Main;
