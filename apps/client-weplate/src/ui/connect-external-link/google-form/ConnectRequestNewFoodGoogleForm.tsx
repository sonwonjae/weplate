import { ChevronRightIcon } from "lucide-react";

import { cn } from "@/utils/tailwind";

function ConnectRequestNewFoodGoogleForm() {
  return (
    <section className={cn("w-full", "py-4", "px-5", "bg-background")}>
      <div
        className={cn("flex", "bg-amber-50", "rounded-md", "py-3", "px-4")}
        onClick={() => {
          window.open("https://forms.gle/eNM4D4fzhqPdXc9j6", "_blank");
        }}
      >
        <p className={cn("flex-1")}>
          <span className={cn("block", "text-lg")}>
            여러분의 <b>추천 음식</b>을 공유해주세요!
          </span>
          <span className={cn("block", "text-sm", "text-slate-600")}>
            새로운 음식 등록 요청하기
          </span>
        </p>
        <button type="button">
          <ChevronRightIcon />
        </button>
      </div>
    </section>
  );
}

export default ConnectRequestNewFoodGoogleForm;
