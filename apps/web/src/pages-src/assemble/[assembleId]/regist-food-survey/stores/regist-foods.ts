import { create } from "zustand";
import { devtools } from "zustand/middleware";

type InputFocusState = "init" | "focus" | "blur";
type SearchActiveState = "init" | "out" | "in";

interface RegistFoodState {
  searchKeyword: string;
  search: (newSearchKeyword: string) => void;
  endSearch: () => void;
  inputFocusState: InputFocusState;
  updateInputFocusState: (newInputFocusState: InputFocusState) => void;
  searchActiveState: () => SearchActiveState;
  resetRegistFoods: () => void;
}

const REGIST_FOOD_INITIAL_STATE: Partial<RegistFoodState> = {
  searchKeyword: "",
  inputFocusState: "init",
};

export const useRegistFoodStore = create<RegistFoodState>()(
  devtools((set, get) => {
    return {
      ...REGIST_FOOD_INITIAL_STATE,
      search: (newSearchKeyword) => {
        return set(() => {
          return {
            searchKeyword: newSearchKeyword,
            inputFocusState: "focus",
          };
        });
      },
      endSearch: () => {
        return set(() => {
          return {
            searchKeyword: "",
            inputFocusState: "blur",
          };
        });
      },
      updateInputFocusState: (newInputFocusState) => {
        return set(() => {
          return {
            inputFocusState: newInputFocusState,
          };
        });
      },
      searchActiveState: () => {
        const { searchKeyword, inputFocusState } = get();

        if (!!searchKeyword || inputFocusState === "focus") {
          return "in";
        }

        if (
          inputFocusState !== "init" &&
          (!searchKeyword || inputFocusState === "blur")
        ) {
          return "out";
        }

        return "init";
      },
      resetRegistFoods: () => {
        return set(REGIST_FOOD_INITIAL_STATE);
      },
    };
  }),
);
