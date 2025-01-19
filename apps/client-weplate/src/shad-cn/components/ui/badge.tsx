import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/tailwind";

const badgeVariants = cva(
  cn(
    "inline-flex",
    "items-center",
    "rounded-full",
    "border",
    "font-semibold",
    "transition-colors",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-ring",
    "focus:ring-offset-2",
    "cursor-default",
  ),
  {
    variants: {
      color: {
        primary: cn(
          "border-transparent",
          "bg-primary",
          "text-primary-foreground",
          "hover:bg-primary/80",
        ),
        secondary: cn(
          "border-transparent",
          "bg-secondary",
          "text-secondary-foreground",
          "hover:bg-secondary/80",
        ),
        destructive: cn(
          "border-transparent",
          "bg-destructive",
          "text-destructive-foreground",
          "hover:bg-destructive/80",
        ),
      },
      size: {
        sm: cn("px-2", "py-0.5", "text-xs", "gap-0.5"),
        md: cn("px-3", "py-1", "text-sm", "gap-0.5"),
        lg: cn("px-4", "py-1.5", "text-md", "gap-1"),
      },
      outline: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        color: "primary",
        outline: true,
        className: cn(
          "bg-background",
          "text-primary",
          "border-primary",
          "hover:bg-primary/20",
        ),
      },
      {
        color: "secondary",
        outline: true,
        className: cn(
          "bg-background",
          "text-secondary",
          "border-secondary",
          "hover:bg-secondary/20",
        ),
      },
      {
        color: "destructive",
        outline: true,
        className: cn(
          "bg-background",
          "text-destructive",
          "border-destructive",
          "hover:bg-destructive/20",
        ),
      },
    ],
    defaultVariants: {
      color: "primary",
      size: "md",
      outline: false,
    },
  },
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, color, outline, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ color, outline, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
