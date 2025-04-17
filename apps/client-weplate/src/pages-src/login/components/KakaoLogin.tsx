import Image from "next/image";
import { useRouter } from "next/router";

import { cn } from "@/utils/tailwind";

function KakaoLogin() {
  const router = useRouter();
  const redirectUrl = (() => {
    const baseRedirectUrl = router.query.redirectUrl;

    if (typeof baseRedirectUrl !== "string") {
      return `${process.env.NEXT_PUBLIC_APP_HOST}`;
    }
    if (/^\/.*/.test(baseRedirectUrl)) {
      return `${process.env.NEXT_PUBLIC_APP_HOST}${baseRedirectUrl}`;
    }
    if (
      new RegExp(`/^${process.env.NEXT_PUBLIC_APP_HOST}`).test(baseRedirectUrl)
    ) {
      return baseRedirectUrl;
    }
    return `${process.env.NEXT_PUBLIC_APP_HOST}${baseRedirectUrl}`;
  })();

  return (
    <a
      href={`${process.env.NEXT_PUBLIC_APP_HOST}/api/user/kakao/login?redirectUrl=${redirectUrl}`}
      className={cn(
        "flex",
        "items-center",
        "justify-center",
        "py-3",
        "px-6",
        "bg-[#FEE500]",
        "w-full",
        "text-black",
        "rounded-xl",
      )}
    >
      <Image
        src="/kakao.svg"
        width={20}
        height={18}
        alt="kakao login"
        priority
      />
      <span className={cn("flex-1", "flex", "items-center", "justify-center")}>
        카카오 로그인
      </span>
    </a>
  );
}

export default KakaoLogin;
