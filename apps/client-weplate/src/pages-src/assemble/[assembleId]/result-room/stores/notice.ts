import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ResultRoomNoticeState {
  shownNewRegistedFoodMemberList: Array<string>;
  updateShownNewRegistedFoodMemberList: (
    updatedShownNewRegistedFoodMemberList: ResultRoomNoticeState["shownNewRegistedFoodMemberList"],
  ) => void;
}

const RECOMMEND_FOOD_INITIAL_STATE: Partial<ResultRoomNoticeState> = {
  shownNewRegistedFoodMemberList: [],
};

export const useResultRoomNoticeStore = create<ResultRoomNoticeState>()(
  persist(
    devtools((set) => {
      return {
        ...RECOMMEND_FOOD_INITIAL_STATE,
        updateShownNewRegistedFoodMemberList: (
          updatedShownNewRegistedFoodMemberList,
        ) => {
          return set(() => {
            return {
              shownNewRegistedFoodMemberList:
                updatedShownNewRegistedFoodMemberList,
            };
          });
        },
      };
    }),
    {
      name: "result-room-notice",
    },
  ),
);
