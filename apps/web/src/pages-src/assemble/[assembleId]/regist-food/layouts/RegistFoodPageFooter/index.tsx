import { useWatch } from "react-hook-form";
import { z } from "zod";

import { Footer } from "@/layouts";
import { cn } from "@/utils/tailwind";

import { foodSurveyForm } from "../../layout";
import { useRegistFoodStore } from "../../stores/regist-foods";
import { useRegistStepsStore } from "../../stores/regist-steps";

import MoveNextStep from "./MoveNextStep";
import MovePrevStep from "./MovePrevStep";
import RegistFood from "./RegistFood";

function RegistFoodPageFooter() {
  const currentStep = useRegistStepsStore((state) => {
    return state.currentStep();
  });
  const { list = [] } =
    useWatch<z.infer<typeof foodSurveyForm>>()?.[currentStep] || {};

  const searchActiveState = useRegistFoodStore((state) => {
    return state.searchActiveState();
  });

  const isReadyMoveToNextStep = !!list.length && searchActiveState === "out";

  return (
    <Footer
      aria-hidden={searchActiveState !== "in"}
      className={cn(
        searchActiveState === "init" && "hidden",
        searchActiveState === "in" &&
          "animate-[fade-in-up_0.2s_ease-in-out_forwards]",

        !isReadyMoveToNextStep &&
          searchActiveState === "out" &&
          "animate-[fade-out-down_0.2s_ease-in-out_forwards]",
      )}
    >
      <MoveNextStep />
      <RegistFood />
      <MovePrevStep />
    </Footer>
  );
}

export default RegistFoodPageFooter;
