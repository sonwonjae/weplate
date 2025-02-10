import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

import { cn } from "@/utils/tailwind";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      toastOptions={{
        classNames: {
          toast: cn(
            "group",
            "toast",
            "group-[.toaster]:bg-background",
            "group-[.toaster]:text-foreground",
            "group-[.toaster]:border-border",
            "group-[.toaster]:shadow-lg",
          ),
          description: "group-[.toast]:text-muted-foreground",
          actionButton: cn(
            "group-[.toast]:bg-primary",
            "group-[.toast]:text-primary-foreground",
          ),
          cancelButton: cn(
            "group-[.toast]:bg-muted",
            "group-[.toast]:text-muted-foreground",
          ),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
