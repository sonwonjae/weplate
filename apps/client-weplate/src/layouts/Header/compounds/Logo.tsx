import Link from "next/link";

import { cn } from "@/utils/tailwind";

function Logo() {
  return (
    <Link href="/" className={cn("text-2xl", "font-bold")}>
      MOMUK
    </Link>
  );
}

export default Logo;
