import { cn } from "@/utils/tailwind";

import { useFavoriteFoodStore } from "../stores/regist-foods";

function StepSection() {
  const searchActiveState = useFavoriteFoodStore((state) => {
    return state.searchActiveState();
  });

  return (
    <section
      className={cn(
        "py-4",
        "px-5",
        "flex",
        "w-full",
        "gap-3",
        "justify-center",

        "h-10",
        searchActiveState === "in" &&
          "animate-[collapse-out-up_0.6s_ease-in-out_forwards_0s]",

        searchActiveState === "out" &&
          "animate-[collapse-in-down_0.6s_ease-in-out_forwards_0s]",
      )}
    >
      <div className={cn("w-2", "h-2", "rounded-full", "bg-primary")} />
      <div className={cn("w-2", "h-2", "rounded-full", "bg-slate-200")} />
    </section>
  );
}

export default StepSection;
