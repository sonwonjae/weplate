import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/tailwind";

const inputVariants = cva(
  cn(
    "flex",
    "w-full",
    "rounded-md",
    "border",
    "border-input",
    "bg-background",
    "text-base",
    "ring-offset-background",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
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
    defaultVariants: {
      uiSize: "lg",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  asChild?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, uiSize, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "input";

    return (
      <Comp
        type={type}
        className={cn(inputVariants({ uiSize }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
