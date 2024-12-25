import { useQuery } from "@tanstack/react-query";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import { foodSurveyForm } from "../../layout";
import { useFavoriteFoodStore } from "../../stores/regist-food";

function SelectFoodList() {
  const form = useFormContext<z.infer<typeof foodSurveyForm>>();
  const { preFavoriteList = [], favoriteList = [] } =
    useWatch<z.infer<typeof foodSurveyForm>>();

  const searchActiveState = useFavoriteFoodStore((state) => {
    return state.searchActiveState();
  });

  const searchKeyword = useFavoriteFoodStore((state) => {
    return state.searchKeyword;
  });

  const foodListQuery = new RQClient({
    url: "/api/food/search/list",
    params: { search: searchKeyword },
    customQueryOptions: {
      enabled: !!searchKeyword,
    },
  });

  const {
    data: foodList,
    isFetching,
    isLoading,
  } = useQuery(foodListQuery.queryOptions);

  const isUpdating = isFetching || isLoading;

  if (!foodList?.length) {
    return null;
  }

  const filteredFoodList = foodList.filter((searchedFood) => {
    const preCheckedFood = preFavoriteList.find(({ id: preFavoriteFoodId }) => {
      return preFavoriteFoodId === searchedFood.id;
    });

    const checkedFood = favoriteList.find(({ id: favoriteFoodId }) => {
      return favoriteFoodId === searchedFood.id;
    });

    if (preCheckedFood?.status === "pre-unchecked") {
      return true;
    }

    return !checkedFood && !preCheckedFood;
  });

  const isAllChecked = filteredFoodList.length === 0;

  const finalButtonText = (() => {
    if (isUpdating) {
      return "불러오는 중...";
    }

    if (isAllChecked) {
      return "선택 해제";
    }

    return "모두 선택";
  })();

  const checkAllFoodList = () => {
    const favoriteList = form.getValues("favoriteList");

    const preCheckedFavoriteList = foodList
      .filter((searchedFood) => {
        const checkedFood = favoriteList.find(({ id: favoriteFoodId }) => {
          return favoriteFoodId === searchedFood.id;
        });

        return !checkedFood;
      })
      .map((filteredFood) => {
        return {
          id: filteredFood.id,
          name: filteredFood.name,
          status: "pre-checked" as const,
        };
      });
    // NOTE: pre check list만 filtering해서 set value
    form.setValue("preFavoriteList", preCheckedFavoriteList);
  };
  const uncheckAllFoodList = () => {
    const favoriteList = form.getValues("favoriteList");

    const preUncheckedFavoriteList = foodList
      .filter((searchedFood) => {
        const checkedFood = favoriteList.find(({ id: favoriteFoodId }) => {
          return favoriteFoodId === searchedFood.id;
        });

        return !!checkedFood;
      })
      .map((filteredFood) => {
        return {
          id: filteredFood.id,
          name: filteredFood.name,
          status: "pre-unchecked" as const,
        };
      });

    form.setValue("preFavoriteList", preUncheckedFavoriteList);
  };

  const finalClickHandler = (() => {
    if (isUpdating) {
      return () => {};
    }

    if (isAllChecked) {
      return uncheckAllFoodList;
    }

    return checkAllFoodList;
  })();

  return (
    <button
      type="button"
      hidden={searchActiveState !== "in"}
      className={cn(
        "absolute",
        "top-0",
        "right-0",
        "whitespace-nowrap",
        "text-primary",
        searchActiveState === "init" && "hidden",
        searchActiveState === "in" &&
          "animate-[fade-in-left_0.2s_ease-in-out_forwards]",
        searchActiveState === "out" &&
          "animate-[fade-out-right_0.2s_ease-in-out_forwards]",
      )}
      onClick={finalClickHandler}
    >
      {finalButtonText}
    </button>
  );
}

export default SelectFoodList;
