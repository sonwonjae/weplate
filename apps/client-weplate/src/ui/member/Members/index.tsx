import { PropsWithChildren } from "react";

import { cn } from "@/utils/tailwind";

import List from "./List";
import Title from "./Title";

function Members({ children }: PropsWithChildren) {
  return <div className={cn("flex", "flex-col", "gap-4")}>{children}</div>;
}

Members.Title = Title;
Members.List = List;

export default Members;
