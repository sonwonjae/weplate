import Image from "next/image";

import { InfinityResponseMap } from "@/utils/react-query/infinity";
import { cn } from "@/utils/tailwind";

interface MemberListProps {
  memberList: InfinityResponseMap["/api/assemble/list/my"]["list"][number]["userAssembleList"];
}

function MemberList({ memberList }: MemberListProps) {
  if (!memberList.length) {
    return (
      <div
        className={cn(
          "w-12",
          "h-12",
          "rounded-full",
          "flex",
          "items-center",
          "justify-center",
          "bg-slate-50",
        )}
      />
    );
  }

  if (1 === memberList.length) {
    const member = memberList[0];
    return (
      <div
        className={cn(
          "w-12",
          "h-12",
          "rounded-full",
          "flex",
          "items-center",
          "justify-center",
          "bg-sky-100",
        )}
      >
        {member.permission === "owner" && (
          <Image width={36} height={36} src="/chief.svg" alt="chief" />
        )}
        {member.permission === "member" && (
          <Image
            width={32}
            height={32}
            src="/member.svg"
            alt={member.permission}
          />
        )}
      </div>
    );
  }

  if (2 === memberList.length) {
    return (
      <div
        className={cn(
          "relative",
          "flex",
          "justify-center",
          "items-center",
          "w-14",
          "h-14",
          "rounded-full",
        )}
      >
        {memberList.map((member, index) => {
          return (
            <div
              key={member.id}
              className={cn(
                "absolute",
                index === 0 && "top-0",
                index === 0 && "left-0",
                index === 0 && "z-10",
                index === 1 && "bottom-0",
                index === 1 && "right-0",
                index === 1 && "z-0",
                "w-10",
                "h-10",
                "rounded-full",
                "flex",
                "items-center",
                "justify-center",
                "bg-sky-100",
                "border-2",
                "border-white",
              )}
            >
              {member.permission === "owner" && (
                <Image width={26} height={26} src="/chief.svg" alt="chief" />
              )}
              {member.permission === "member" && (
                <Image
                  width={22}
                  height={22}
                  src="/member.svg"
                  alt={member.permission}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
  if (3 === memberList.length) {
    return (
      <div
        className={cn(
          "relative",
          "flex",
          "justify-center",
          "items-center",
          "w-14",
          "h-14",
          "rounded-full",
        )}
      >
        {memberList.map((member, index) => {
          return (
            <div
              key={member.id}
              className={cn(
                "absolute",
                index === 0 && "top-0",
                index === 0 && "left-1/2",
                index === 0 && "-translate-x-1/2",
                index === 0 && "z-20",
                index === 1 && "bottom-0",
                index === 1 && "left-0",
                index === 1 && "z-10",
                index === 2 && "bottom-0",
                index === 2 && "right-0",
                index === 2 && "z-0",
                "w-8",
                "h-8",
                "rounded-full",
                "flex",
                "items-center",
                "justify-center",
                "bg-sky-100",
                "border-2",
                "border-white",
              )}
            >
              {member.permission === "owner" && (
                <Image width={24} height={24} src="/chief.svg" alt="chief" />
              )}
              {member.permission === "member" && (
                <Image
                  width={20}
                  height={20}
                  src="/member.svg"
                  alt={member.permission}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
  if (4 <= memberList.length) {
    return (
      <div
        className={cn(
          "relative",
          "flex",
          "justify-center",
          "items-center",
          "w-14",
          "h-14",
          "rounded-full",
        )}
      >
        {memberList.map((member, index) => {
          return (
            <div
              key={member.id}
              className={cn(
                "absolute",
                index === 0 && "top-0",
                index === 0 && "left-0",
                index === 0 && "z-30",
                index === 1 && "top-0",
                index === 1 && "right-0",
                index === 1 && "z-20",
                index === 2 && "bottom-0",
                index === 2 && "left-0",
                index === 2 && "z-10",
                index === 3 && "bottom-0",
                index === 3 && "right-0",
                index === 3 && "z-0",
                "w-8",
                "h-8",
                "rounded-full",
                "flex",
                "items-center",
                "justify-center",
                "bg-sky-100",
                "border-2",
                "border-white",
              )}
            >
              {member.permission === "owner" && (
                <Image width={24} height={24} src="/chief.svg" alt="chief" />
              )}
              {member.permission === "member" && (
                <Image
                  width={20}
                  height={20}
                  src="/member.svg"
                  alt={member.permission}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

export default MemberList;
