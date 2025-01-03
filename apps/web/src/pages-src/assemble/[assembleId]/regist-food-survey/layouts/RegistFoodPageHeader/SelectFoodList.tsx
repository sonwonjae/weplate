import { useQuery } from "@tanstack/react-query";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import { foodSurveyForm } from "../../layout";
import { useRegistFoodStore } from "../../stores/regist-foods";
import { useRegistStepsStore } from "../../stores/regist-foods-steps";

function SelectFoodList() {
  const form = useFormContext<z.infer<typeof foodSurveyForm>>();
  const allSteps = useRegistStepsStore((state) => {
    return state.allSteps;
  });
  const currentStep = useRegistStepsStore((state) => {
    return state.currentStep();
  });
  const foodSurveyFormValue = useWatch<z.infer<typeof foodSurveyForm>>();
  const { preList = [], list = [] } = foodSurveyFormValue[currentStep] || {};

  const searchActiveState = useRegistFoodStore((state) => {
    return state.searchActiveState();
  });

  const searchKeyword = useRegistFoodStore((state) => {
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
    data: foodList = [],
    isFetching,
    isLoading,
  } = useQuery(foodListQuery.queryOptions);

  const isUpdating = isFetching || isLoading;

  if (!foodList?.length) {
    return null;
  }

  const registedFoodList = allSteps
    .filter((step) => {
      return step !== currentStep;
    })
    .map((step) => {
      const { list = [] } = foodSurveyFormValue[step]!;
      return list;
    })
    .flat();

  const registedFoodListInSearchedFoodList = foodList.filter((searchedFood) => {
    const registedFood = registedFoodList.find(({ id: registedFoodId }) => {
      return registedFoodId === searchedFood.id;
    });

    return !!registedFood;
  });

  const filteredFoodList = foodList.filter((searchedFood) => {
    const preCheckedFood = preList.find(({ id: preFoodId }) => {
      return preFoodId === searchedFood.id;
    });

    const checkedFood = list.find(({ id: foodId }) => {
      return foodId === searchedFood.id;
    });

    if (preCheckedFood?.status === "pre-unchecked") {
      return true;
    }

    return !checkedFood && !preCheckedFood;
  });

  const isAllChecked =
    filteredFoodList.length === registedFoodListInSearchedFoodList.length;

  const finalButtonText = (() => {
    if (registedFoodListInSearchedFoodList.length === foodList.length) {
      return null;
    }

    if (isUpdating) {
      return "불러오는 중...";
    }

    if (isAllChecked) {
      return "선택 해제";
    }

    return "모두 선택";
  })();

  const checkAllFoodList = () => {
    const list = form.getValues(`${currentStep}.list`);

    const preCheckedList = foodList
      .filter((searchedFood) => {
        const checkedFood = list.find(({ id: foodId }) => {
          return foodId === searchedFood.id;
        });

        return !checkedFood;
      })
      .filter((filteredFood) => {
        const registedFood = registedFoodListInSearchedFoodList.find(
          ({ id: registedFoodId }) => {
            return registedFoodId === filteredFood.id;
          },
        );

        return !registedFood;
      })
      .map((filteredFood) => {
        return {
          id: filteredFood.id,
          name: filteredFood.name,
          status: "pre-checked" as const,
        };
      });
    // NOTE: pre check list만 filtering해서 set value
    form.setValue(`${currentStep}.preList`, preCheckedList);
  };
  const uncheckAllFoodList = () => {
    const list = form.getValues(`${currentStep}.list`);

    const preUncheckedList = foodList
      .filter((searchedFood) => {
        const checkedFood = list.find(({ id: foodId }) => {
          return foodId === searchedFood.id;
        });

        return !!checkedFood;
      })
      .filter((filteredFood) => {
        const registedFood = registedFoodListInSearchedFoodList.find(
          ({ id: registedFoodId }) => {
            return registedFoodId === filteredFood.id;
          },
        );

        return !registedFood;
      })
      .map((filteredFood) => {
        return {
          id: filteredFood.id,
          name: filteredFood.name,
          status: "pre-unchecked" as const,
        };
      });
    form.setValue(`${currentStep}.preList`, preUncheckedList);
  };

  const finalClickHandler = (() => {
    if (registedFoodListInSearchedFoodList.length === foodList.length) {
      return () => {};
    }

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
