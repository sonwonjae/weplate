export const WRITING_LIST = [
  "모임원 취향을 반영한 메뉴 3가지를 추천드려요.",
  "‘다른 메뉴 추천 받기’ 버튼으로 새 추천을 받아보세요.",
  "음식 정보를 업데이트하면 다음 추천에 반영돼요!",
  "새 모임원 음식정보는 다음 추천에 반영돼요!",
  "비선호 음식은 해당 모임 메뉴 추천에서 제외돼요!",
];

const BOLD_LIST = [
  "모임원 취향",
  "‘다른 메뉴 추천 받기’",
  "메뉴 3가지",
  "음식 정보",
  "업데이트",
  "새 모임원 음식정보",
  "비선호 음식",
  "제외",
];

export const SPLIT_FOOD_CHECK_REGEXP = new RegExp(
  `${BOLD_LIST.map((FOOD) => {
    return `(${FOOD})`;
  }).join("|")}`,
);
