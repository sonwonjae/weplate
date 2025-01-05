import { PropsWithChildren } from "react";
import { useWatch } from "react-hook-form";
import { z } from "zod";

import { foodSurveyForm } from "@/features/food-survey-form/scheme";
import { useFoodSurveyStepsStore } from "@/features/food-survey-form/stores/food-survey-steps";
import { useSearchFoodStore } from "@/features/food-survey-form/stores/search-food";
import { Footer } from "@/layouts";
import { cn } from "@/utils/tailwind";

interface StepFooterProps extends PropsWithChildren {
  type: "regist" | "update";
}

function StepFooter({ type, children }: StepFooterProps) {
  const currentStep = useFoodSurveyStepsStore((state) => {
    return state.currentStep();
  });
  const { preList = [] } =
    useWatch<z.infer<typeof foodSurveyForm>>()?.[currentStep] || {};

  const searchActiveState = useSearchFoodStore((state) => {
    return state.searchActiveState();
  });

  const isHideFooter = searchActiveState === "in" && !preList.length;

  return (
    <Footer
      className={cn(
        type === "regist" && searchActiveState === "init" && "hidden",
        !(type === "update" && searchActiveState === "init") &&
          !isHideFooter &&
          "animate-[fade-in-up_0.2s_ease-in-out_forwards]",

        isHideFooter && "animate-[fade-out-down_0.2s_ease-in-out_forwards]",
      )}
    >
      <div className={cn("w-full", "flex", "flex-col", "gap-2")}>
        {children}
      </div>
    </Footer>
  );
}

export default StepFooter;
