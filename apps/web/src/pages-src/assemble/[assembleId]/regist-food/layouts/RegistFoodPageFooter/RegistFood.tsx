import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shad-cn/components/ui/button";
import { cn } from "@/utils/tailwind";

import { foodSurveyForm } from "../../layout";
import { useRegistFoodStore } from "../../stores/regist-foods";
import { useRegistStepsStore } from "../../stores/regist-foods-steps";

function RegistFood() {
  const form = useFormContext<z.infer<typeof foodSurveyForm>>();
  const currentStep = useRegistStepsStore((state) => {
    return state.currentStep();
  });
  const { preList = [] } =
    useWatch<z.infer<typeof foodSurveyForm>>()?.[currentStep] || {};

  const searchActiveState = useRegistFoodStore((state) => {
    return state.searchActiveState();
  });
  const endSearch = useRegistFoodStore((state) => {
    return state.endSearch;
  });

  const isReadyRegistFood = preList.length && searchActiveState === "in";

  const registFoodList = () => {
    const list = form.getValues(`${currentStep}.list`);

    const preCheckedList = form
      .getValues(`${currentStep}.preList`)
      .filter((preFood) => {
        return preFood.status === "pre-checked";
      })
      .map((preCheckedFood) => {
        return {
          id: preCheckedFood.id,
          name: preCheckedFood.name,
        };
      });
    const preUncheckedList = form
      .getValues(`${currentStep}.preList`)
      .filter((preFood) => {
        return preFood.status === "pre-unchecked";
      });

    const changedList = list.filter((food) => {
      return !preUncheckedList.find((preUncheckedFood) => {
        return preUncheckedFood.id === food.id;
      });
    });

    form.setValue(`${currentStep}.list`, [...changedList, ...preCheckedList]);
    form.setValue(`${currentStep}.preList`, []);
    form.setValue(`${currentStep}.searchKeyword`, "");

    endSearch();
  };

  if (!isReadyRegistFood) {
    return null;
  }

  return (
    <Button size="lg" round className={cn("w-full")} onClick={registFoodList}>
      완료
    </Button>
  );
}

export default RegistFood;
