import { useQuery } from "@tanstack/react-query";
import { CheckIcon, MailPlusIcon } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { foodSurveyForm } from "@/features/food-survey-form/scheme";
import { useFoodSurveyStepsStore } from "@/features/food-survey-form/stores/food-survey-steps";
import { useSearchFoodStore } from "@/features/food-survey-form/stores/search-food";
import { Button } from "@/shad-cn/components/ui/button";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

function FoodListSection() {
  const form = useFormContext<z.infer<typeof foodSurveyForm>>();
  const allSteps = useFoodSurveyStepsStore((state) => {
    return state.allSteps;
  });
  const currentStep = useFoodSurveyStepsStore((state) => {
    return state.currentStep();
  });
  const foodSurveyFormValue = useWatch<z.infer<typeof foodSurveyForm>>();
  const { preList = [], list = [] } = foodSurveyFormValue[currentStep] || {};

  const searchKeyword = useSearchFoodStore((state) => {
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

  if (isUpdating) {
    return (
      <section
        className={cn(
          "pb-6",
          "flex",
          "w-full",
          "flex-col",
          "gap-2",
          "z-20",
          "bg-background",
          "overflow-auto",
        )}
      >
        <ul>
          {Array.from({ length: 15 }, (_, index) => {
            const hasColor = !(index % 2);

            return (
              <li
                key={index}
                className={cn(
                  "flex",
                  "w-full",
                  "h-12",
                  hasColor && "bg-slate-100",
                  hasColor && "animate-pulse",
                )}
              ></li>
            );
          })}
        </ul>
      </section>
    );
  }

  if (!searchKeyword) {
    return null;
  }

  if (!!searchKeyword && !foodList.length) {
    return (
      <section
        className={cn(
          "pb-6",
          "px-5",
          "flex",
          "w-full",
          "flex-1",
          "flex-col",
          "justify-center",
          "items-center",
          "gap-3",
          "z-20",
          "bg-background",
          "overflow-auto",
        )}
      >
        <p className={cn("text-center", "text-slate-500", "leading-6")}>
          찾으시는 음식이 없나요?
          <br />
          음식 추가를 요청해 주세요!
        </p>
        <Button
          type="button"
          size="sm"
          round
          className={cn("font-bold")}
          onClick={() => {
            window.open("https://forms.gle/eNM4D4fzhqPdXc9j6", "_blank");
          }}
        >
          <MailPlusIcon size={20} />
          <span>음식 추가 요청하기</span>
        </Button>
      </section>
    );
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
  const combinedFootList = foodList.map((searchedFood) => {
    const registedFood = registedFoodList.find(({ id: registedFoodId }) => {
      return registedFoodId === searchedFood.id;
    });

    if (registedFood) {
      return {
        id: registedFood.id!,
        name: registedFood.name!,
        status: "registed" as const,
      };
    }

    const preCheckedFood = preList.find(({ id: preFoodId }) => {
      return preFoodId === searchedFood.id;
    });
    if (preCheckedFood) {
      return {
        id: preCheckedFood.id!,
        name: preCheckedFood.name!,
        status: preCheckedFood.status!,
      };
    }

    const checkedFood = list.find(({ id: foodId }) => {
      return foodId === searchedFood.id;
    });
    if (checkedFood) {
      return {
        id: checkedFood.id!,
        name: checkedFood.name!,
        status: "checked" as const,
      };
    }

    return {
      id: searchedFood.id,
      name: searchedFood.name,
      status: "non-checked" as const,
    };
  });

  const changeFoodStatus = (
    food: Required<(typeof combinedFootList)[number]>,
  ) => {
    if (food.status === "registed") {
      return;
    }

    const filteredPreList = preList.filter(
      (prevPreFood) => {
        return prevPreFood.id !== food.id;
      },
      // FIXME: 이거 타입 관련 에러 방법 찾기
    ) as Required<(typeof preList)[number]>[];

    const changedPreFood = (() => {
      switch (food.status) {
        case "pre-checked":
          return null;
        case "pre-unchecked":
          return null;
        case "checked":
          return {
            id: food.id,
            name: food.name,
            status: "pre-unchecked" as const,
          };
        case "non-checked":
        default:
          return {
            id: food.id,
            name: food.name,
            status: "pre-checked" as const,
          };
      }
    })();

    const changedPreList = (() => {
      if (changedPreFood) {
        return [...filteredPreList, changedPreFood];
      }

      return filteredPreList;
    })();

    form.setValue(`${currentStep}.preList`, changedPreList);
  };

  return (
    <section
      className={cn(
        "pb-6",
        "flex",
        "w-full",
        "flex-col",
        "gap-2",
        "z-20",
        "bg-background",
        "overflow-auto",
      )}
    >
      <ul>
        {combinedFootList.map(
          ({ id: foodId, name: foodName, status: foodStatus }) => {
            const isChecked =
              foodStatus === "checked" || foodStatus === "pre-checked";

            return (
              <li
                key={`${foodId}-${foodStatus}`}
                className={cn(
                  "flex",
                  "items-center",
                  "justify-between",
                  "w-full",
                  "py-3",
                  "px-5",
                  "active:bg-slate-200",
                  "cursor-pointer",

                  foodStatus === "registed" && "bg-slate-100",
                  foodStatus === "registed" && "text-slate-400",
                  foodStatus === "registed" && "opacity-40",
                )}
                onClick={() => {
                  if (foodStatus === "registed") {
                    toast.error("이미 등록된 음식입니다.");
                  }

                  changeFoodStatus({
                    id: foodId,
                    name: foodName,
                    status: foodStatus,
                  });
                }}
              >
                <div className={cn("flex-1")}>
                  {foodName
                    .split(new RegExp(`(${searchKeyword})`))
                    .map((foodSyllable, index) => {
                      return (
                        <span
                          key={index}
                          className={cn(
                            foodSyllable === searchKeyword && "text-primary",
                          )}
                        >
                          {foodSyllable}
                        </span>
                      );
                    })}
                </div>
                {isChecked && <CheckIcon className={cn("text-primary")} />}
              </li>
            );
          },
        )}
      </ul>
    </section>
  );
}

export default FoodListSection;
