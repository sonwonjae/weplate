import { useQuery } from "@tanstack/react-query";
import { CheckIcon, MailPlusIcon } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shad-cn/components/ui/button";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import { foodSurveyForm } from "../layout";
import { useFavoriteFoodStore } from "../stores/regist-foods";

function FoodListSection() {
  const form = useFormContext<z.infer<typeof foodSurveyForm>>();
  const { preFavoriteList = [], favoriteList = [] } =
    useWatch<z.infer<typeof foodSurveyForm>>();

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
        <Button type="button" size="sm" round className={cn("font-bold")}>
          <MailPlusIcon size={20} />
          <span>음식 추가 요청하기</span>
        </Button>
      </section>
    );
  }

  const combinedFootList = foodList.map((searchedFood) => {
    const preCheckedFood = preFavoriteList.find(({ id: preFavoriteFoodId }) => {
      return preFavoriteFoodId === searchedFood.id;
    });
    if (preCheckedFood) {
      return {
        id: preCheckedFood.id!,
        name: preCheckedFood.name!,
        status: preCheckedFood.status!,
      };
    }

    const checkedFood = favoriteList.find(({ id: favoriteFoodId }) => {
      return favoriteFoodId === searchedFood.id;
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
    const filteredPreFavoriteList = preFavoriteList.filter(
      (prevPreFavoriteFood) => {
        return prevPreFavoriteFood.id !== food.id;
      },
      // FIXME: 이거 타입 관련 에러 방법 찾기
    ) as Required<(typeof preFavoriteList)[number]>[];

    const changedPreFavoriteFood = (() => {
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

    const changedPreFavoriteList = (() => {
      if (changedPreFavoriteFood) {
        return [...filteredPreFavoriteList, changedPreFavoriteFood];
      }

      return filteredPreFavoriteList;
    })();

    form.setValue("preFavoriteList", changedPreFavoriteList);
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
                )}
                onClick={() => {
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
