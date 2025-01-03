import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { foodSurveyForm } from "@/features/food-survey-form/scheme";
import { useFoodSurveyStepsStore } from "@/features/food-survey-form/stores/food-survey-steps";
import { useSearchFoodStore } from "@/features/food-survey-form/stores/search-food";
import { Button } from "@/shad-cn/components/ui/button";
import { apiAxios } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

function SubmitFoodList() {
  const router = useRouter();
  const form = useFormContext<z.infer<typeof foodSurveyForm>>();

  const { mutateAsync: submitFoodSurvey } = useMutation({
    mutationFn: async () => {
      await apiAxios.post(`/api/food/${router.query.assembleId}/survey`, {
        favoriteFoodList: form.getValues("favorite.list").map(({ id }) => {
          return { foodId: id };
        }),
        hateFoodList: form.getValues("hate.list").map(({ id }) => {
          return { foodId: id };
        }),
      });
    },
  });

  const currentStep = useFoodSurveyStepsStore((state) => {
    return state.currentStep();
  });
  const { list = [] } =
    useWatch<z.infer<typeof foodSurveyForm>>()?.[currentStep] || {};

  const searchActiveState = useSearchFoodStore((state) => {
    return state.searchActiveState();
  });
  const isLastStep = useFoodSurveyStepsStore((state) => {
    return state.isLastStep();
  });
  const isReadySubmitFoodList =
    isLastStep && !!list.length && searchActiveState === "out";

  if (!isReadySubmitFoodList) {
    return null;
  }

  const submitFoodList = () => {
    submitFoodSurvey();
    router.replace(`/assemble/${router.query.assembleId}/waiting-room`);
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
