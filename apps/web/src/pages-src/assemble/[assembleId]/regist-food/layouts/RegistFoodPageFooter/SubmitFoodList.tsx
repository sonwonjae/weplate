import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shad-cn/components/ui/button";
import { cn } from "@/utils/tailwind";

import { foodSurveyForm } from "../../layout";
import { useRegistFoodStore } from "../../stores/regist-foods";
import { useRegistStepsStore } from "../../stores/regist-foods-steps";

function SubmitFoodList() {
  const form = useFormContext<z.infer<typeof foodSurveyForm>>();

  const currentStep = useRegistStepsStore((state) => {
    return state.currentStep();
  });
  const { list = [] } =
    useWatch<z.infer<typeof foodSurveyForm>>()?.[currentStep] || {};

  const searchActiveState = useRegistFoodStore((state) => {
    return state.searchActiveState();
  });
  const isLastStep = useRegistStepsStore((state) => {
    return state.isLastStep();
  });
  const isReadySubmitFoodList =
    isLastStep && !!list.length && searchActiveState === "out";

  if (!isReadySubmitFoodList) {
    return null;
  }

  const submitFoodList = () => {
    console.log("last submit");
  };

  return (
    <Button
      type="submit"
      size="lg"
      round
      className={cn("w-full")}
      onClick={form.handleSubmit(submitFoodList)}
    >
      비선호 음식 등록 완료
    </Button>
  );
}

export default SubmitFoodList;
