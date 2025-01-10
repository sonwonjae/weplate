import { useFoodSurveyStepsStore } from "@/features/food-survey-form/stores/food-survey-steps";
import { useSearchFoodStore } from "@/features/food-survey-form/stores/search-food";
import { cn } from "@/utils/tailwind";

function StepSection() {
  const allSteps = useFoodSurveyStepsStore((state) => {
    return state.allSteps;
  });
  const currentStep = useFoodSurveyStepsStore((state) => {
    return state.currentStep();
  });
  const searchActiveState = useSearchFoodStore((state) => {
    return state.searchActiveState();
  });

  return (
    <section
      className={cn(
        "py-4",
        "px-5",
        "flex",
        "w-full",
        "gap-3",
        "justify-center",
        "h-10",
        searchActiveState === "in" &&
          "animate-[collapse-out-up_0.6s_ease-in-out_forwards_0s]",

        searchActiveState === "out" &&
          "animate-[collapse-in-down_0.6s_ease-in-out_forwards_0s]",
      )}
    >
      {allSteps.map((step) => {
        const isActive = step === currentStep;

        return (
          <div
            key={`${step}-${isActive}`}
            className={cn(
              "w-2",
              "h-2",
              "rounded-full",
              isActive && "bg-primary",
              !isActive && "bg-slate-200",
            )}
          />
        );
      })}
    </section>
  );
}

export default StepSection;
