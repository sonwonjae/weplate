import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/tailwind";

const inputVariants = cva(
  cn(
    "flex",
    "w-full",
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
        sm: cn("h-10", "rounded-md", "px-3", "py-2", "text-sm"),
        md: cn("h-12", "px-4", "py-3", "text-md"),
        lg: cn("h-14", "px-4", "py-3", "text-lg"),
      },
    },
  },
);

export interface BaseInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
    VariantProps<typeof inputVariants> {
  asChild?: boolean;
}

interface TextInputProps extends BaseInputProps {
  type?: "text";
  counter?: boolean;
}

interface OtherInputProps extends BaseInputProps {
  type: Exclude<React.HTMLInputTypeAttribute, "text">;
  counter?: undefined;
}

export type InputProps = TextInputProps | OtherInputProps;

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
    const counterRef = React.useRef<HTMLSpanElement>(null);
    const Comp = asChild ? Slot : "input";

    const hasCounter = type === "text" && !!counter;
    const valueLength = String(props.value).length;

    return (
      <div
        className={cn(
          "relative",
          "w-full",
          "h-fit",
          "rounded-md",
          "border",
          "border-input",
          "focus-within:ring-2",
          "focus-within:ring-ring",
          "focus-within:ring-offset-2",
          className,
        )}
        style={{
          paddingRight: `${counterRef.current?.clientWidth || 0}px`,
        }}
      >
        <Comp
          type={type}
          className={cn(inputVariants({ uiSize }))}
          ref={ref}
          {...props}
        />
        {hasCounter && (
          <span
            ref={counterRef}
            className={cn(
              "absolute",
              "right-0",
              "top-1/2",
              "-translate-y-1/2",
              uiSize === "sm" && "pr-3",
              uiSize === "md" && "pr-4",
              uiSize === "lg" && "pr-4",
            )}
          >
            {valueLength} / {maxLength}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
