import { useWatch } from "react-hook-form";
import { z } from "zod";

import { foodSurveyForm } from "@/features/food-survey-form/scheme";
import { useFoodSurveyStepsStore } from "@/features/food-survey-form/stores/food-survey-steps";
import { useSearchFoodStore } from "@/features/food-survey-form/stores/search-food";
import { Button } from "@/shad-cn/components/ui/button";
import { cn } from "@/utils/tailwind";

function MovePrevStep() {
  const currentStepIndex = useFoodSurveyStepsStore((state) => {
    return state.currentStepIndex;
  });
  const currentStep = useFoodSurveyStepsStore((state) => {
    return state.currentStep();
  });
  const movePrevStep = useFoodSurveyStepsStore((state) => {
    return state.movePrevStep;
  });
  const searchActiveState = useSearchFoodStore((state) => {
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
