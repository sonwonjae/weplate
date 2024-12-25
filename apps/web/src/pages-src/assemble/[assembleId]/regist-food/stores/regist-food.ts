import { create } from "zustand";
import { devtools } from "zustand/middleware";

type InputFocusState = "init" | "focus" | "blur";
type SearchActiveState = "init" | "out" | "in";

interface FavoriteFoodState {
  searchKeyword: string;
  search: (newSearchKeyword: string) => void;
  endSearch: () => void;
  inputFocusState: InputFocusState;
  updateInputFocusState: (newInputFocusState: InputFocusState) => void;
  searchActiveState: () => SearchActiveState;
  reset: () => void;
}

const FAVORITE_FOOD_INITIAL_STATE: Partial<FavoriteFoodState> = {
  searchKeyword: "",
  inputFocusState: "init",
};

export const useFavoriteFoodStore = create<FavoriteFoodState>()(
  devtools((set, get) => {
    return {
      ...FAVORITE_FOOD_INITIAL_STATE,
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
      reset: () => {
        return set(FAVORITE_FOOD_INITIAL_STATE);
      },
    };
  }),
);
