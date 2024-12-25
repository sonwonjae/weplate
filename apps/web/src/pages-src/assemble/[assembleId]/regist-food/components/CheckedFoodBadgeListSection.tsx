import { XIcon } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/shad-cn/components/ui/badge";
import { cn } from "@/utils/tailwind";

import { foodSurveyForm } from "../layout";
import { useFavoriteFoodStore } from "../stores/regist-food";

function CheckedFoodBadgeListSection() {
  const form = useFormContext<z.infer<typeof foodSurveyForm>>();

  const searchActiveState = useFavoriteFoodStore((state) => {
    return state.searchActiveState();
  });

  const { favoriteList = [] } = useWatch<z.infer<typeof foodSurveyForm>>();

  if (searchActiveState === "in") {
    return;
  }

  if (!favoriteList?.length) {
    return (
      <section
        className={cn(
          "pb-4",
          "px-5",
          "flex",
          "w-full",
          "flex-col",
          "gap-2",
          "z-20",
          "bg-background",
          "overflow-auto",
        )}
      >
        <ul className={cn("inline-flex", "gap-1", "flex-wrap")}>
          <Badge outline color="secondary">
            <span>ex. 꼼장어구이</span>
            <XIcon size={16} />
          </Badge>
        </ul>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "pb-4",
        "px-5",
        "flex",
        "w-full",
        "flex-col",
        "gap-2",
        "z-20",
        "bg-background",
        "overflow-auto",
      )}
    >
      <ul className={cn("inline-flex", "gap-1", "flex-wrap")}>
        {favoriteList.map(({ id: foodId, name: foodName }) => {
          return (
            <Badge
              key={foodId}
              outline
              onClick={() => {
                const filteredFavoriteList = form
                  .getValues("favoriteList")
                  .filter((favoriteFood) => {
                    return favoriteFood.id !== foodId;
                  });

                form.setValue("favoriteList", filteredFavoriteList);
              }}
            >
              <span>{foodName}</span>
              <XIcon size={16} />
            </Badge>
          );
        })}
      </ul>
    </section>
  );
}

export default CheckedFoodBadgeListSection;
