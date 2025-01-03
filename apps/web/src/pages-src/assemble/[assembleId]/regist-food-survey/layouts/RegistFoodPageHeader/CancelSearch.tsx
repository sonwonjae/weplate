import { ChevronLeftIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/utils/tailwind";

import { foodSurveyForm } from "../../layout";
import { useRegistFoodStore } from "../../stores/regist-foods";
import { useRegistStepsStore } from "../../stores/regist-foods-steps";

function CancelSearch() {
  const form = useFormContext<z.infer<typeof foodSurveyForm>>();

  const currentStep = useRegistStepsStore((state) => {
    return state.currentStep();
  });
  const searchActiveState = useRegistFoodStore((state) => {
    return state.searchActiveState();
  });
  const endSearch = useRegistFoodStore((state) => {
    return state.endSearch;
  });

  return (
    <div className={cn("h-6")}>
      <button
        type="button"
        onClick={() => {
          if (searchActiveState !== "in") {
            return;
          }
          form.setValue(`${currentStep}.searchKeyword`, "");
          form.setValue(`${currentStep}.preList`, []);

          endSearch();
        }}
        className={cn(
          "flex",
          "items-center",
          searchActiveState === "init" && "hidden",

          searchActiveState === "in" &&
            "animate-[fade-in-right_0.2s_ease-in-out_forwards]",

          searchActiveState === "out" &&
            "animate-[fade-out-left_0.2s_ease-in-out_forwards]",
        )}
      >
        <ChevronLeftIcon size={20} />
      </button>
    </div>
  );
}

export default CancelSearch;
