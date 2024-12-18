import { HouseIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

import { cn } from "@/utils/tailwind";

function HomePageLink() {
  const router = useRouter();

  return (
    <Link
      href="/"
      className={cn(
        "flex",
        "flex-col",
        "gap-1",
        "items-center",
        "text-xs",
        "w-14",
        "hover:text-primary/90",
        router.pathname === "/" && "text-primary",
      )}
    >
      <HouseIcon />
      <span>홈</span>
    </Link>
  );
}

export default HomePageLink;
