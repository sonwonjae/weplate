import { create } from "zustand";
import { devtools } from "zustand/middleware";

type FoodSurveySteps = ["favorite", "hate"];

interface FoodSurveyStepsState {
  allSteps: FoodSurveySteps;
  currentStepIndex: number;
  isLastStep: () => boolean;
  currentStep: () => FoodSurveySteps[number];
  movePrevStep: () => void;
  moveNextStep: () => void;
  resetStep: () => void;
}

const INIT_STEP_INDEX = 0;

const FOOD_SURVEY_STEPS_INITIAL_STATE: Partial<FoodSurveyStepsState> = {
  allSteps: ["favorite", "hate"],
  currentStepIndex: INIT_STEP_INDEX,
};

export const useFoodSurveyStepsStore = create<FoodSurveyStepsState>()(
  devtools((set, get) => {
    return {
      ...FOOD_SURVEY_STEPS_INITIAL_STATE,
      currentStep: () => {
        return get().allSteps[get().currentStepIndex];
      },
      isLastStep: () => {
        return get().currentStepIndex === get().allSteps.length - 1;
      },
      movePrevStep: () => {
        return set(() => {
          const prevStepIndex = get().currentStepIndex - 1;
          if (prevStepIndex < 0) {
            return {};
          }

          return {
            currentStepIndex: prevStepIndex,
          };
        });
      },
      moveNextStep: () => {
        return set(() => {
          const nextStepIndex = get().currentStepIndex + 1;
          if (get().allSteps.length - 1 < nextStepIndex) {
            return {};
          }

          return {
            currentStepIndex: nextStepIndex,
          };
        });
      },
      resetStep: () => {
        return set(FOOD_SURVEY_STEPS_INITIAL_STATE);
      },
    };
  }),
);
