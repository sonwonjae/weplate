import { create } from "zustand";
import { devtools } from "zustand/middleware";

// 1. 추천 대기
// 2. marquee가 보이는 로딩 시작
// 3. marquee가 보이는 로딩 끝
// 4. 세 개 아이템 리스트 보이는 로딩 시작
// 5. 세 개 아이템 리스트 보이는 로딩 끝
// 6. 결과 제공

interface RecommendFoodState {
  steps: ["wait", "marquee-loading", "recommend-loading", "end"];
  recommendStatus: RecommendFoodState["steps"][number];
  changeRecommendStatus: (
    newRecommendStatus: RecommendFoodState["steps"][number],
  ) => void;
  resetRecommendFood: () => void;
}

const RECOMMEND_FOOD_INITIAL_STATE: Partial<RecommendFoodState> = {
  steps: ["wait", "marquee-loading", "recommend-loading", "end"],
  recommendStatus: "wait",
};

export const useRecommendFoodStore = create<RecommendFoodState>()(
  devtools((set) => {
    return {
      ...RECOMMEND_FOOD_INITIAL_STATE,
      changeRecommendStatus: (newRecommendStatus) => {
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
