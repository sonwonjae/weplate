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
import { useFavoriteFoodStore } from "../stores/regist-food";

function SearchSection() {
  const updateInputFocusState = useFavoriteFoodStore((state) => {
    return state.updateInputFocusState;
  });

  const form = useFormContext<z.infer<typeof foodSurveyForm>>();

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
        name="favorite"
        render={({ field }) => {
          return (
            <FormItem>
              <FormControl>
                <FormInput
                  type="search"
                  placeholder="ex. 꼼장어구이"
                  onDelete={() => {
                    form.setValue("favorite", "");
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
