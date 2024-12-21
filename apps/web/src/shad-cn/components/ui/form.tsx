import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import { Input } from "@/shad-cn/components/ui/input";
import { Label } from "@/shad-cn/components/ui/label";
import { cn } from "@/utils/tailwind";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label> & { required?: boolean }
>(({ required = false, className, children, ...props }, ref) => {
  const {
    //  error,
    formItemId,
  } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(
        // error && "text-destructive",
        required && cn("flex", "gap-1", "items-start"),
        className,
      )}
      htmlFor={formItemId}
      {...props}
    >
      <span>{children}</span>
      {required && (
        <span className={cn("text-xs", "text-primary", "font-medium")}>
          (필수)
        </span>
      )}
    </Label>
  );
});
FormLabel.displayName = "FormLabel";

const FormInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentPropsWithoutRef<typeof Input>
>(({ className, ...props }, ref) => {
  const { trigger } = useFormContext();
  const { name, error } = useFormField();

  /** NOTE: maxLength가 있는 경우 trigger 활성화 */
  React.useEffect(() => {
    if (props.value) {
      trigger(name);
    }
  }, [
    (typeof props.type === "undefined" || props.type === "text") &&
      typeof props.value === "string" &&
      typeof props.maxLength === "number" &&
      props.value.length > props.maxLength,
    name,
  ]);

  return (
    <Input
      ref={ref}
      className={cn(
        error && "border-destructive",
        error && "animate-[vibe_0.2s_ease-in-out]",
        className,
      )}
      {...props}
    />
  );
});
FormInput.displayName = "FormInput";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormInput,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
