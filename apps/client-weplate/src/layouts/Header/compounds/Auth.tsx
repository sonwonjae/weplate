import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { buttonVariants } from "@/shad-cn/components/ui/button";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

function Auth() {
  const authQuery = new RQClient({ url: "/api/user/auth/check" });
  const { data: userInfo } = useQuery(authQuery.queryOptions);

  if (!userInfo) {
    return (
      <Link
        href={`${process.env.NEXT_PUBLIC_HOST}/api/user/kakao/login?redirectUrl=${process.env.NEXT_PUBLIC_HOST}`}
        className={cn(buttonVariants())}
      >
        로그인
      </Link>
    );
  }

  return (
    <span>
      <span className={cn("text-primary", "font-bold")}>
        {userInfo.nickname}
      </span>
      님 안녕하세요!
    </span>
  );
}

export default Auth;
