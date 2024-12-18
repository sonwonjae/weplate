import { PropsWithChildren } from "react";

import { cn } from "@/utils/tailwind";

import CreateAssembleButton from "./compounds/CreateAssembleButton";
import HomePageLink from "./compounds/HomePageLink";
import MyInfoPageLink from "./compounds/MyInfoPageLink";

function Footer({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <footer className={cn("w-full", "border-t", "border-t-slate-200")}>
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
    </footer>
  );
}

Footer.HomePageLink = HomePageLink;
Footer.MyInfoPageLink = MyInfoPageLink;
Footer.CreateAssembleButton = CreateAssembleButton;

export default Footer;
