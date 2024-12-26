import { useQuery } from "@tanstack/react-query";

import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import { useRegistFoodStore } from "../stores/regist-foods";
import { useRegistStepsStore } from "../stores/regist-foods-steps";

function DescriptionSection() {
  const authQuery = new RQClient({ url: "/api/user/auth/check" });
  const { data: userInfo } = useQuery(authQuery.queryOptions);

  const searchActiveState = useRegistFoodStore((state) => {
    return state.searchActiveState();
  });

  const currentStep = useRegistStepsStore((state) => {
    return state.currentStep();
  });

  return (
    <section
      className={cn(
        "py-4",
        "px-5",
        "flex",
        "w-full",
        "flex-col",
        "gap-2",

        "h-[9.5rem]",
        searchActiveState === "in" &&
          "animate-[collapse-out-up_0.6s_ease-in-out_forwards_0s]",

        searchActiveState === "out" &&
          "animate-[collapse-in-down_0.6s_ease-in-out_forwards_0s]",
      )}
    >
      <h2 className={cn("font-bold", "text-2xl")}>
        <span
          className={cn(
            "inline-block",
            searchActiveState === "in" &&
              "animate-[fade-out-left_0.4s_ease-in-out_forwards_0s]",

            searchActiveState === "out" && "opacity-0",
            searchActiveState === "out" &&
              "animate-[fade-in-right_0.4s_ease-in-out_forwards_0.3s]",
          )}
        >
          {userInfo?.name}님,
        </span>
        <br />
        <span
          className={cn(
            "inline-block",
            searchActiveState === "in" &&
              "animate-[fade-out-left_0.4s_ease-in-out_forwards_0.1s]",

            searchActiveState === "out" && "opacity-0",
            searchActiveState === "out" &&
              "animate-[fade-in-right_0.4s_ease-in-out_forwards_0.2s]",
          )}
        >
          <span className={cn("text-primary")}>
            {currentStep === "favorite" && "선호하는"}
            {currentStep === "hate" && "선호하지 않는"}
          </span>
          <span> 음식을 알려주세요.</span>
        </span>
      </h2>
      <span className={cn("text-slate-800")}>
        <span
          className={cn(
            "inline-block",
            searchActiveState === "in" &&
              "animate-[fade-out-left_0.4s_ease-in-out_forwards_0.2s]",

            searchActiveState === "out" && "opacity-0",
            searchActiveState === "out" &&
              "animate-[fade-in-right_0.4s_ease-in-out_forwards_0.1s]",
          )}
        >
          {currentStep === "favorite" &&
            "맛있게 먹고 싶은 음식을 최소 1개 이상 골라주세요!"}
          {currentStep === "hate" &&
            "먹기 꺼려지는 음식을 최소 1개 이상 골라주세요!"}
        </span>
        <br />
        <span
          className={cn(
            "inline-block",
            searchActiveState === "in" &&
              "animate-[fade-out-left_0.4s_ease-in-out_forwards_0.3s]",

            searchActiveState === "out" && "opacity-0",
            searchActiveState === "out" &&
              "animate-[fade-in-right_0.4s_ease-in-out_forwards_0s]",
          )}
        >
          {currentStep === "favorite" &&
            "알려주시면 모임 메뉴에 반영해 드릴게요!"}
          {currentStep === "hate" &&
            "알려주시면 이번 모임 메뉴에서 제외해 드릴게요!"}
        </span>
      </span>
    </section>
  );
}

export default DescriptionSection;
