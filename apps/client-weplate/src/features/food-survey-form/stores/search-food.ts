import { create } from "zustand";
import { devtools } from "zustand/middleware";

type InputFocusState = "init" | "focus" | "blur";
type SearchActiveState = "init" | "out" | "in";

interface SearchFoodState {
  searchKeyword: string;
  search: (newSearchKeyword: string) => void;
  endSearch: () => void;
  inputFocusState: InputFocusState;
  updateInputFocusState: (newInputFocusState: InputFocusState) => void;
  searchActiveState: () => SearchActiveState;
  resetSearchFoods: () => void;
}

const SEARCH_FOOD_INITIAL_STATE: Partial<SearchFoodState> = {
  searchKeyword: "",
  inputFocusState: "init",
};

export const useSearchFoodStore = create<SearchFoodState>()(
  devtools((set, get) => {
    return {
      ...SEARCH_FOOD_INITIAL_STATE,
      search: (newSearchKeyword) => {
        return set(() => {
          const searchActiveState = get().searchActiveState();

          const isSearchUsable =
            !!newSearchKeyword && searchActiveState === "in";

          if (isSearchUsable) {
            return {
              searchKeyword: newSearchKeyword,
              inputFocusState: "focus",
            };
          }

          return {};
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
      resetSearchFoods: () => {
        return set(SEARCH_FOOD_INITIAL_STATE);
      },
    };
  }),
);
