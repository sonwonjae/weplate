import { ChevronLeftIcon } from "lucide-react";
import { useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shad-cn/components/ui/button";
import { cn } from "@/utils/tailwind";

import { foodSurveyForm } from "../../layout";
// import { useRegistFoodStore } from "../../stores/regist-foods";
import { useRegistStepsStore } from "../../stores/regist-steps";

function MovePrevStep() {
  const currentStepIndex = useRegistStepsStore((state) => {
    return state.currentStepIndex;
  });
  const currentStep = useRegistStepsStore((state) => {
    return state.currentStep();
  });
  // const moveNextStep = useRegistStepsStore((state) => {
  //   return state.moveNextStep;
  // });
  const {
    preList = [],
    // list = []
  } = useWatch<z.infer<typeof foodSurveyForm>>()?.[currentStep] || {};

  // const searchActiveState = useRegistFoodStore((state) => {
  //   return state.searchActiveState();
  // });
  // const isReadyMoveToNextStep = !!list.length && searchActiveState === "out";

  if (preList.length || currentStepIndex === 0) {
    return null;
  }

  return (
    <Button
      size="lg"
      outline
      round
      className={cn("w-full", "justify-between")}
      // onClick={moveNextStep}
    >
      <ChevronLeftIcon />
      <span>선호 음식 등록하기</span>
      <div />
    </Button>
  );
}

export default MovePrevStep;
