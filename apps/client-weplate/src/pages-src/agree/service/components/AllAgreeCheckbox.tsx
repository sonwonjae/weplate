import { useId } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { serviceAgreeForm } from "@/pages-src/agree/service/layer";
import { Checkbox } from "@/shad-cn/components/ui/checkbox";
import { Label } from "@/shad-cn/components/ui/label";
import { cn } from "@/utils/tailwind";

function AllAgreeCheckbox() {
  const allAgreeCheckboxId = useId();
  const form = useFormContext<z.infer<typeof serviceAgreeForm>>();

  const formValues = useWatch<z.infer<typeof serviceAgreeForm>>();
  const isAllAgree = Object.values(formValues).every(Boolean);

  return (
    <div className={cn("w-full", "flex", "items-center", "space-x-2")}>
      <Checkbox
        id={allAgreeCheckboxId}
        checked={isAllAgree}
        onCheckedChange={() => {
          Object.keys(formValues).forEach((key) => {
            form.setValue(
              key as keyof z.infer<typeof serviceAgreeForm>,
              !isAllAgree,
            );
          });
        }}
      />
      <Label htmlFor={allAgreeCheckboxId}>모두 동의</Label>
    </div>
  );
}

export default AllAgreeCheckbox;
