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
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
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
        onClick={form.handleSubmit((formValue) => {
          search(formValue[currentStep].searchKeyword);
        })}
      />
    </section>
  );
}

export default SearchSection;
