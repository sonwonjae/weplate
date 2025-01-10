import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ReRecommendFoodState {
  steps: ["init", "loading-start", "loading-end", "end"];
  reRecommendStatus: ReRecommendFoodState["steps"][number];
  changeReRecommendStatus: (
    newRecommendStatus: ReRecommendFoodState["steps"][number],
  ) => void;
  resetReRecommendFood: () => void;
}

const RECOMMEND_FOOD_INITIAL_STATE: Partial<ReRecommendFoodState> = {
  steps: ["init", "loading-start", "loading-end", "end"],
  reRecommendStatus: "init",
};

export const useReRecommendFoodStore = create<ReRecommendFoodState>()(
  devtools((set) => {
    return {
      ...RECOMMEND_FOOD_INITIAL_STATE,
      changeReRecommendStatus: (newRecommendStatus) => {
        return set(() => {
          return {
            reRecommendStatus: newRecommendStatus,
          };
        });
      },
      resetReRecommendFood: () => {
        return set(RECOMMEND_FOOD_INITIAL_STATE);
      },
    };
  }),
);
