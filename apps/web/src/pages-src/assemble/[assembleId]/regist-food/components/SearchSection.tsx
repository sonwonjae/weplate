import { useFormContext } from "react-hook-form";
import { z } from "zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormInput,
  FormMessage,
} from "@/shad-cn/components/ui/form";
import { cn } from "@/utils/tailwind";

import { foodSurveyForm } from "../layout";
import { useRegistFoodStore } from "../stores/regist-foods";
import { useRegistStepsStore } from "../stores/regist-steps";

function SearchSection() {
  const currentStep = useRegistStepsStore((state) => {
    return state.currentStep();
  });
  const updateInputFocusState = useRegistFoodStore((state) => {
    return state.updateInputFocusState;
  });

  const form = useFormContext<z.infer<typeof foodSurveyForm>>();

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
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </section>
  );
}

export default SearchSection;
