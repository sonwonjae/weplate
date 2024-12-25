import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const REGIST_STEPS = ["favorite", "hate"] as const;

interface FoodState {
  currentStepIndex: number;
  currentStep: () => (typeof REGIST_STEPS)[number];
  moveNextStep: () => void;
  resetStep: () => void;
}

const INIT_STEP_INDEX = 0;

const FOOD_INITIAL_STATE: Partial<FoodState> = {
  currentStepIndex: INIT_STEP_INDEX,
};

export const useRegistStepsStore = create<FoodState>()(
  devtools((set, get) => {
    return {
      ...FOOD_INITIAL_STATE,
      currentStep: () => {
        return REGIST_STEPS[get().currentStepIndex];
      },
      moveNextStep: () => {
        return set(() => {
          const nextStepIndex = get().currentStepIndex + 1;
          if (REGIST_STEPS.length - 1 < nextStepIndex) {
            return {};
          }

          return {
            currentStepIndex: nextStepIndex,
          };
        });
      },
      resetStep: () => {
        return set(FOOD_INITIAL_STATE);
      },
    };
  }),
);
