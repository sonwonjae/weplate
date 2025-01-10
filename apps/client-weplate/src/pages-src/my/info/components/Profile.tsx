import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

function Profile() {
  const authQuery = new RQClient({ url: "/api/user/auth/check" });
  const { data: userInfo } = useQuery(authQuery.queryOptions);

  return (
    <section
      className={cn(
        "flex",
        "flex-col",
        "gap-3",
        "items-center",
        "justify-center",
        "py-4",
      )}
    >
      <div
        className={cn(
          "rounded-full",
          "bg-sky-100",
          "w-20",
          "h-20",
          "flex",
          "items-center",
          "justify-center",
        )}
      >
        <Image width={64} height={64} src="/chief.svg" alt="chief" />
      </div>
      <div className={cn("flex", "flex-col", "items-center", "justify-center")}>
        <div className={cn("font-bold", "text-lg")}>
          <span className={cn("text-primary")}>{userInfo?.name}</span>
          <span>님</span>
        </div>
        {userInfo?.provider === "kakao" && (
          <div className={cn("flex", "items-center", "gap-2", "text-sm")}>
            <div
              className={cn(
                "flex",
                "justify-center",
                "items-center",
                "w-5",
                "h-5",
                "bg-[#FEE500]",
                "rounded-full",
              )}
            >
              <Image width={12} height={12} src="/kakao.svg" alt="kakao" />
            </div>
            <span>카카오톡 로그인</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default Profile;
