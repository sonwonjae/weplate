import { PropsWithChildren } from "react";

import { Toaster } from "@/shad-cn/components/ui/sonner";
import { cn } from "@/utils/tailwind";

function Main({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("transform-cpu", "w-full", "h-full", "overflow-hidden")}>
      <main
        className={cn(
          "flex-1",
          "flex",
          "flex-col",
          "relative",
          "w-full",
          "h-full",
          "overflow-y-auto",
          className,
        )}
      >
        {children}
      </main>
      <Toaster position="top-right" duration={2000} />
    </div>
  );
}

export default Main;
