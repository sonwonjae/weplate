import { useWatch } from "react-hook-form";
import { z } from "zod";

import { foodSurveyForm } from "@/features/food-survey-form/scheme";
import { useFoodSurveyStepsStore } from "@/features/food-survey-form/stores/food-survey-steps";
import { useSearchFoodStore } from "@/features/food-survey-form/stores/search-food";
import { Button } from "@/shad-cn/components/ui/button";
import { cn } from "@/utils/tailwind";

function MoveNextStep() {
  const isLastStep = useFoodSurveyStepsStore((state) => {
    return state.isLastStep();
  });
  const currentStep = useFoodSurveyStepsStore((state) => {
    return state.currentStep();
  });
  const moveNextStep = useFoodSurveyStepsStore((state) => {
    return state.moveNextStep;
  });
  const { preList = [], list = [] } =
    useWatch<z.infer<typeof foodSurveyForm>>()?.[currentStep] || {};

  const searchActiveState = useSearchFoodStore((state) => {
    return state.searchActiveState();
  });
  const isReadyMoveToNextStep =
    !isLastStep && !!list.length && searchActiveState === "out";

  if (!isReadyMoveToNextStep) {
    return null;
  }

  return (
    <Button
      size="lg"
      round
      className={cn("w-full")}
      disabled={!isReadyMoveToNextStep && !preList.length}
      onClick={moveNextStep}
    >
      선호 음식 등록 완료
    </Button>
  );
}

export default MoveNextStep;
