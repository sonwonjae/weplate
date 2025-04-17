import { useQuery } from "@tanstack/react-query";
import { UserIcon, UserPlus2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

function MyInfoPageLink() {
  const authQuery = new RQClient({ url: "/api/user/auth/check" });
  const { data: userInfo } = useQuery(authQuery.queryOptions);
  const router = useRouter();

  if (!userInfo) {
    return (
      <Link
        href={`${process.env.NEXT_PUBLIC_APP_HOST}/api/user/kakao/login?redirectUrl=${process.env.NEXT_PUBLIC_APP_HOST}`}
        className={cn(
          "flex",
          "flex-col",
          "gap-1",
          "items-center",
          "text-xs",
          "w-14",
          "hover:text-primary",
          router.pathname === "/my/info" && "text-primary",
        )}
      >
        <UserPlus2Icon />
        <span>로그인</span>
      </Link>
    );
  }

  return (
    <Link
      href="/my/info"
      className={cn(
        "flex",
        "flex-col",
        "gap-1",
        "items-center",
        "text-xs",
        "w-14",
        "hover:text-primary",
        router.pathname === "/my/info" && "text-primary",
      )}
    >
      <UserIcon />
      <span>마이 페이지</span>
    </Link>
  );
}

export default MyInfoPageLink;
