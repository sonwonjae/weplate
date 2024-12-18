import { useFormContext } from "react-hook-form";
import { z } from "zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormInput,
  FormMessage,
} from "@/shad-cn/components/ui/form";

import { assembleFormSchema } from "../../layout";

function AssembleForm() {
  const form = useFormContext<z.infer<typeof assembleFormSchema>>();

  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel required>모임명</FormLabel>
            <FormControl>
              <FormInput
                placeholder="ex. 연말 동창회, 크리스마스 파티"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default AssembleForm;
