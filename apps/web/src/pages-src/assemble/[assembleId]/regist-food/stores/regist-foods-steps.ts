import { create } from "zustand";
import { devtools } from "zustand/middleware";

type RegistStep = ["favorite", "hate"];

interface RegistFoodsStepsState {
  allSteps: RegistStep;
  currentStepIndex: number;
  isLastStep: () => boolean;
  currentStep: () => RegistStep[number];
  movePrevStep: () => void;
  moveNextStep: () => void;
  resetStep: () => void;
}

const INIT_STEP_INDEX = 0;

const REGIST_FOODS_STEPS_INITIAL_STATE: Partial<RegistFoodsStepsState> = {
  allSteps: ["favorite", "hate"],
  currentStepIndex: INIT_STEP_INDEX,
};

export const useRegistStepsStore = create<RegistFoodsStepsState>()(
  devtools((set, get) => {
    return {
      ...REGIST_FOODS_STEPS_INITIAL_STATE,
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
        return set(REGIST_FOODS_STEPS_INITIAL_STATE);
      },
    };
  }),
);
