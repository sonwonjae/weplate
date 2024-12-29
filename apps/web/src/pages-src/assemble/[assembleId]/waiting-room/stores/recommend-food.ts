import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface RecommendFoodState {
  duration: number;
  animationStatus: "wait" | "loading-start" | "loading-end";
  recommendStatus: "not-yet" | "start" | "end";
  changeRecommendStatus: (
    newRecommendStatus: Exclude<
      RecommendFoodState["recommendStatus"],
      "not-yet"
    >,
  ) => void;
  resetRecommendFood: () => void;
}

const RECOMMEND_FOOD_INITIAL_STATE: Partial<RecommendFoodState> = {
  duration: 1000,
  animationStatus: "wait",
  recommendStatus: "not-yet",
};

export const useRecommendFoodStore = create<RecommendFoodState>()(
  devtools((set, get) => {
    return {
      ...RECOMMEND_FOOD_INITIAL_STATE,
      changeRecommendStatus: (
        newRecommendStatus: Exclude<
          RecommendFoodState["recommendStatus"],
          "not-yet"
        >,
      ) => {
        if (
          newRecommendStatus === "start" &&
          get().animationStatus === "wait"
        ) {
          setTimeout(() => {
            set(() => {
              setTimeout(() => {
                set(() => {
                  setTimeout(() => {
                    set(() => {
                      return {
                        recommendStatus: "end",
                      };
                    });
                  }, 1500);

                  return {
                    animationStatus: "loading-end",
                  };
                });
              }, 2000);

              return {
                animationStatus: "loading-start",
              };
            });
          }, 2250);
        }
        return set(() => {
          return {
            recommendStatus: newRecommendStatus,
          };
        });
      },
      resetRecommendFood: () => {
        return set(RECOMMEND_FOOD_INITIAL_STATE);
      },
    };
  }),
);
