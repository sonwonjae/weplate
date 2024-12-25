import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { Footer } from "@/layouts";
import { Button } from "@/shad-cn/components/ui/button";
import { cn } from "@/utils/tailwind";

import { foodSurveyForm } from "../../layout";
import { useFavoriteFoodStore } from "../../stores/favorite-food";

function RegistFoodPageFooter() {
  const form = useFormContext<z.infer<typeof foodSurveyForm>>();
  const { favoriteList = [], preFavoriteList = [] } =
    useWatch<z.infer<typeof foodSurveyForm>>();

  const searchActiveState = useFavoriteFoodStore((state) => {
    return state.searchActiveState();
  });
  const endSearch = useFavoriteFoodStore((state) => {
    return state.endSearch;
  });

  const isReadyMoveToNextStep =
    !!favoriteList.length && searchActiveState === "out";

  const moveNextStep = () => {
    console.log("move to hate");
  };

  const registFavoriteFoodList = () => {
    const favoriteList = form.getValues("favoriteList");

    const preCheckedFavoriteList = form
      .getValues("preFavoriteList")
      .filter((preFavoriteFood) => {
        return preFavoriteFood.status === "pre-checked";
      })
      .map((preCheckedFavoriteFood) => {
        return {
          id: preCheckedFavoriteFood.id,
          name: preCheckedFavoriteFood.name,
        };
      });
    const preUncheckedFavoriteList = form
      .getValues("preFavoriteList")
      .filter((preFavoriteFood) => {
        return preFavoriteFood.status === "pre-unchecked";
      });

    const changedFavoriteList = favoriteList.filter((favoriteFood) => {
      return !preUncheckedFavoriteList.find((preUncheckedFavoriteFood) => {
        return preUncheckedFavoriteFood.id === favoriteFood.id;
      });
    });

    form.setValue("favoriteList", [
      ...changedFavoriteList,
      ...preCheckedFavoriteList,
    ]);
    form.setValue("preFavoriteList", []);
    form.setValue("favorite", "");

    endSearch();
  };

  const finalClickHandler = (() => {
    if (isReadyMoveToNextStep) {
      return moveNextStep;
    }
    return registFavoriteFoodList;
  })();

  return (
    <Footer
      aria-hidden={searchActiveState !== "in"}
      className={cn(
        searchActiveState === "init" && "opacity-0",
        searchActiveState === "in" &&
          "animate-[fade-in-up_0.2s_ease-in-out_forwards]",
        !isReadyMoveToNextStep &&
          searchActiveState === "out" &&
          "animate-[fade-out-down_0.2s_ease-in-out_forwards]",
      )}
    >
      <Button
        size="lg"
        round
        className={cn("w-full")}
        disabled={!isReadyMoveToNextStep && !preFavoriteList.length}
        onClick={finalClickHandler}
      >
        {isReadyMoveToNextStep && "선호 음식 등록 완료"}
        {!isReadyMoveToNextStep && "완료"}
      </Button>
    </Footer>
  );
}

export default RegistFoodPageFooter;
