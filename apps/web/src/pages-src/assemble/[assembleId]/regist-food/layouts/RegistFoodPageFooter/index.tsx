import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { Footer } from "@/layouts";
import { Button } from "@/shad-cn/components/ui/button";
import { cn } from "@/utils/tailwind";

import { foodSurveyForm } from "../../layout";
import { useRegistFoodStore } from "../../stores/regist-foods";
import { useRegistStepsStore } from "../../stores/regist-steps";

function RegistFoodPageFooter() {
  const form = useFormContext<z.infer<typeof foodSurveyForm>>();
  const currentStep = useRegistStepsStore((state) => {
    return state.currentStep();
  });
  const isLastStep = useRegistStepsStore((state) => {
    return state.isLastStep();
  });

  const moveNextStep = useRegistStepsStore((state) => {
    return state.moveNextStep;
  });
  const { preList = [], list = [] } =
    useWatch<z.infer<typeof foodSurveyForm>>()?.[currentStep] || {};

  const searchActiveState = useRegistFoodStore((state) => {
    return state.searchActiveState();
  });
  const endSearch = useRegistFoodStore((state) => {
    return state.endSearch;
  });

  const isReadyMoveToNextStep = !!list.length && searchActiveState === "out";

  const submitFoodList = () => {
    //
  };

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

  const finalClickHandler = (() => {
    if (isReadyMoveToNextStep) {
      if (!isLastStep) {
        return moveNextStep;
      }
      return submitFoodList;
    }

    return registFoodList;
  })();

  return (
    <Footer
      aria-hidden={searchActiveState !== "in"}
      className={cn(
        searchActiveState === "init" && "opacity-0",
        searchActiveState === "in" &&
          "animate-[fade-in-up_0.2s_ease-in-out_forwards]",
        !isReadyMoveToNextStep &&
          searchActiveState === "out" &&
          "animate-[fade-out-down_0.2s_ease-in-out_forwards]",
      )}
    >
      <Button
        size="lg"
        round
        className={cn("w-full")}
        disabled={!isReadyMoveToNextStep && !preList.length}
        onClick={finalClickHandler}
      >
        {isReadyMoveToNextStep && "선호 음식 등록 완료"}
        {!isReadyMoveToNextStep && "완료"}
      </Button>
    </Footer>
  );
}

export default RegistFoodPageFooter;
