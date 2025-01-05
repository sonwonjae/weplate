import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UpdatableUserInfoState {
  isUpdatable: boolean;
  toggleIsUpdatable: () => void;
  resetUpdatableUserInfos: () => void;
}

const UPDATABLE_USER_INFO_INITIAL_STATE: Partial<UpdatableUserInfoState> = {
  isUpdatable: false,
};

export const useUpdatableUserInfoStore = create<UpdatableUserInfoState>()(
  devtools((set, get) => {
    return {
      ...UPDATABLE_USER_INFO_INITIAL_STATE,
      toggleIsUpdatable: () => {
        return set(() => {
          return {
            isUpdatable: !get().isUpdatable,
          };
        });
      },
      resetUpdatableUserInfos: () => {
        return set(UPDATABLE_USER_INFO_INITIAL_STATE);
      },
    };
  }),
);
