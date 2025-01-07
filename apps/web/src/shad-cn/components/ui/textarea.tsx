import * as React from "react";

import { cn } from "@/utils/tailwind";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  counter?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ counter = false, maxLength = 9999, className, ...props }, ref) => {
    const hasCounter = !!counter;
    const valueLength = String(props.value).length;

    return (
      <div>
        <textarea
          className={cn(
            cn(
              "flex",
              "min-h-[80px]",
              "w-full",
              "rounded-md",
              "border",
              "border-input",
              "bg-background",
              "py-2",
              "px-3",
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
            ),
            className,
          )}
          ref={ref}
          {...props}
        />
        {hasCounter && (
          <span
            className={cn(
              "block",
              "text-right",
              "w-full",
              "whitespace-nowrap",
              "py-2",
              "text-xs",
            )}
          >
            {valueLength} / {maxLength}
          </span>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
