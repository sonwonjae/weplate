import { PropsWithChildren } from "react";
import { useWatch } from "react-hook-form";
import { z } from "zod";

import { Footer } from "@/layouts";
import { cn } from "@/utils/tailwind";

import { foodSurveyForm } from "../../layout";
import { useRegistFoodStore } from "../../stores/regist-foods";
import { useRegistStepsStore } from "../../stores/regist-foods-steps";

function StepFooter({ children }: PropsWithChildren) {
  const currentStep = useRegistStepsStore((state) => {
    return state.currentStep();
  });
  const { preList = [] } =
    useWatch<z.infer<typeof foodSurveyForm>>()?.[currentStep] || {};

  const searchActiveState = useRegistFoodStore((state) => {
    return state.searchActiveState();
  });

  const isHideFooter = searchActiveState === "in" && !preList.length;

  return (
    <Footer
      aria-hidden={searchActiveState !== "in"}
      className={cn(
        searchActiveState === "init" && "hidden",
        !isHideFooter && "animate-[fade-in-up_0.2s_ease-in-out_forwards]",
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
