import { PropsWithChildren } from "react";

import { cn } from "@/utils/tailwind";

import Auth from "./compounds/Auth";
import Title from "./compounds/Title";

function Header({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <header
      className={cn("w-full", "border-b", "border-b-slate-200", "bg-white")}
    >
      <section
        className={cn(
          "relative",
          "w-full",
          "flex",
          "items-center",
          "justify-between",
          "py-3",
          "px-5",
          className,
        )}
      >
        {children}
      </section>
    </header>
  );
}

Header.Title = Title;
Header.Auth = Auth;

export default Header;
