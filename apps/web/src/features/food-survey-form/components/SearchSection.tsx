import { useFormContext } from "react-hook-form";
import { z } from "zod";

import { foodSurveyForm } from "@/features/food-survey-form/scheme";
import { useFoodSurveyStepsStore } from "@/features/food-survey-form/stores/food-survey-steps";
import { useSearchFoodStore } from "@/features/food-survey-form/stores/search-food";
import {
  FormControl,
  FormField,
  FormItem,
  FormInput,
  FormMessage,
} from "@/shad-cn/components/ui/form";
import { cn } from "@/utils/tailwind";

function SearchSection() {
  const form = useFormContext<z.infer<typeof foodSurveyForm>>();
  const currentStep = useFoodSurveyStepsStore((state) => {
    return state.currentStep();
  });
  const searchActiveState = useSearchFoodStore((state) => {
    return state.searchActiveState();
  });
  const updateInputFocusState = useSearchFoodStore((state) => {
    return state.updateInputFocusState;
  });

  const search = useSearchFoodStore((state) => {
    return state.search;
  });

  const placeholder = (() => {
    switch (currentStep) {
      case "favorite":
        return "ex. 페퍼로니 피자";
      case "hate":
        return "ex. 꼼장어구이";
    }
  })();

  const searchFoodList = (formValue: z.infer<typeof foodSurveyForm>) => {
    if (!formValue[currentStep].searchKeyword) {
      return;
    }

    if (searchActiveState !== "in") {
      return;
    }

    search(formValue[currentStep].searchKeyword);
  };

  return (
    <section
      className={cn(
        "py-4",
        "px-5",
        "flex",
        "w-full",
        "flex-col",
        "gap-2",
        "bg-background",
      )}
    >
      <FormField
        control={form.control}
        name={`${currentStep}.searchKeyword`}
        render={({ field }) => {
          return (
            <FormItem>
              <FormControl>
                <FormInput
                  type="search"
                  placeholder={placeholder}
                  onDelete={() => {
                    form.setValue(`${currentStep}.searchKeyword`, "");
                  }}
                  onFocus={() => {
                    updateInputFocusState("focus");
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <button
        type="submit"
        hidden
        onClick={form.handleSubmit(searchFoodList)}
      />
    </section>
  );
}

export default SearchSection;
