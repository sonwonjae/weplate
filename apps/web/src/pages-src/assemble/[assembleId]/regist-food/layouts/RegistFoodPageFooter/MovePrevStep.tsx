import { useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shad-cn/components/ui/button";
import { cn } from "@/utils/tailwind";

import { foodSurveyForm } from "../../layout";
import { useRegistFoodStore } from "../../stores/regist-foods";
import { useRegistStepsStore } from "../../stores/regist-foods-steps";

function MovePrevStep() {
  const currentStepIndex = useRegistStepsStore((state) => {
    return state.currentStepIndex;
  });
  const currentStep = useRegistStepsStore((state) => {
    return state.currentStep();
  });
  const movePrevStep = useRegistStepsStore((state) => {
    return state.movePrevStep;
  });
  const searchActiveState = useRegistFoodStore((state) => {
    return state.searchActiveState();
  });
  const { preList = [] } =
    useWatch<z.infer<typeof foodSurveyForm>>()?.[currentStep] || {};

  const isReadyMoveToPrevStep =
    !preList.length && currentStepIndex !== 0 && searchActiveState !== "in";

  if (!isReadyMoveToPrevStep) {
    return null;
  }

  return (
    <Button
      size="lg"
      outline
      round
      className={cn("w-full")}
      onClick={movePrevStep}
    >
      이전 단계로 돌아가기
    </Button>
  );
}

export default MovePrevStep;
