import { create } from "zustand";
import { devtools } from "zustand/middleware";

// 1. 추천 대기
// 2. marquee가 보이는 로딩 시작
// 3. marquee가 보이는 로딩 끝
// 4. 세 개 아이템 리스트 보이는 로딩 시작
// 5. 세 개 아이템 리스트 보이는 로딩 끝
// 6. 결과 제공

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
