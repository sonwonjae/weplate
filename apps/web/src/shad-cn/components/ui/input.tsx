import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleXIcon, SearchIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/utils/tailwind";

const intputContainerVariants = cva(
  cn(
    "relative",
    "flex",
    "gap-2",
    "items-center",
    "w-full",
    "h-fit",
    "rounded-md",
    "border",
    "border-input",
    "focus-within:ring-2",
    "focus-within:ring-ring",
    "focus-within:ring-offset-2",
  ),
  {
    variants: {
      uiSize: {
        sm: cn("h-10", "px-3", "py-2"),
        md: cn("h-12", "px-4", "py-3"),
        lg: cn("h-14", "px-4", "py-3"),
      },
    },
  },
);

const inputVariants = cva(
  cn(
    "flex-1",
    "flex",
    "bg-background",
    "rounded-md",
    "text-base",
    "ring-offset-background",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
    "md:text-sm",
    "file:border-0",
    "file:bg-transparent",
    "file:text-sm",
    "file:font-medium",
    "file:text-foreground",
  ),
  {
    variants: {
      uiSize: {
        sm: cn("rounded-md", "text-sm"),
        md: cn("text-md"),
        lg: cn("text-lg"),
      },
    },
  },
);

export interface BaseInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
    VariantProps<typeof inputVariants> {
  asChild?: boolean;
}

interface SearchInputProps extends BaseInputProps {
  type: "search";
  counter?: undefined;
  onDelete: () => void;
}

interface TextInputProps extends BaseInputProps {
  type?: "text";
  counter?: boolean;
  onDelete?: undefined;
}

interface OtherInputProps extends BaseInputProps {
  type: Exclude<React.HTMLInputTypeAttribute, "text" | "search">;
  counter?: undefined;
  onDelete?: undefined;
}

export type InputProps = SearchInputProps | TextInputProps | OtherInputProps;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      counter = false,
      maxLength = 9999,
      className,
      type = "text",
      uiSize = "lg",
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "input";

    const hasCounter = type === "text" && !!counter;
    const valueLength = String(props.value).length;

    return (
      <div
        className={cn(
          intputContainerVariants({
            uiSize,
          }),
          className,
        )}
      >
        {type === "search" && (
          <SearchIcon
            onClick={(e) => {
              const $searchInput = e.currentTarget
                .closest("div")
                ?.querySelector('input[type="search"]') as HTMLInputElement;
              if ($searchInput) {
                $searchInput.focus();
              }
            }}
          />
        )}
        <Comp
          type={type}
          className={cn(inputVariants({ uiSize }))}
          ref={ref}
          {...props}
        />
        {hasCounter && (
          <span className={cn("whitespace-nowrap")}>
            {valueLength} / {maxLength}
          </span>
        )}
        {type === "search" && props.value && (
          <CircleXIcon
            onClick={(e) => {
              const $searchInput = e.currentTarget
                .closest("div")
                ?.querySelector('input[type="search"]') as HTMLInputElement;
              if ($searchInput) {
                $searchInput.focus();
              }
              if (typeof props.onDelete === "function") {
                props.onDelete();
              }
            }}
          />
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
