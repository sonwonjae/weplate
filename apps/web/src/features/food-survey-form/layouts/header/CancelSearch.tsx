import { ChevronLeftIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

import { foodSurveyForm } from "@/features/food-survey-form/scheme";
import { useFoodSurveyStepsStore } from "@/features/food-survey-form/stores/food-survey-steps";
import { useSearchFoodStore } from "@/features/food-survey-form/stores/search-food";
import { cn } from "@/utils/tailwind";

function CancelSearch() {
  const form = useFormContext<z.infer<typeof foodSurveyForm>>();

  const currentStep = useFoodSurveyStepsStore((state) => {
    return state.currentStep();
  });
  const searchActiveState = useSearchFoodStore((state) => {
    return state.searchActiveState();
  });
  const endSearch = useSearchFoodStore((state) => {
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
