import type { ReactNode } from "react";

import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { serviceAgreeForm } from "@/pages-src/agree/service/layer";
import { cn } from "@/utils/tailwind";

interface AgreeCheckboxProps {
  fieldName: keyof z.infer<typeof serviceAgreeForm>;
  title: ReactNode;
  url?: string;
}

function AgreeCheckbox({ fieldName, title, url }: AgreeCheckboxProps) {
  const form = useFormContext<z.infer<typeof serviceAgreeForm>>();

  const formValues = useWatch<z.infer<typeof serviceAgreeForm>>();
  const isAgree = formValues[fieldName]!;

  return (
    <div
      className={cn("w-full", "flex", "items-center", "gap-2")}
      onClick={(e) => {
        if ((e.target as HTMLAnchorElement).tagName.toUpperCase() === "A") {
          return;
        }
        form.setValue(fieldName, !isAgree);
      }}
    >
      <CheckIcon
        role="checkbox"
        aria-checked={isAgree}
        className={cn(isAgree && "stroke-primary")}
      />
      <span className={cn("inline-block", "flex-1", "text-gray-600")}>
        {title}
      </span>
      {url && (
        <Link
          href={url}
          target="_blank"
          className={cn("text-sm", "underline", "text-gray-400")}
        >
          보기
        </Link>
      )}
    </div>
  );
}

export default AgreeCheckbox;
