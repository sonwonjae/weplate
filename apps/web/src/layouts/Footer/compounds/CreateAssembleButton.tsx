import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";

import { Button } from "@/shad-cn/components/ui/button";
import { cn } from "@/utils/tailwind";

function CreateAssembleButton() {
  const router = useRouter();
  const moveCreateAssemblePage = () => {
    router.push("/assemble/create");
  };

  return (
    <div
      role="button"
      onClick={moveCreateAssemblePage}
      className={cn(
        "absolute",
        "bottom-0",
        "left-1/2",
        "rounded-full",
        "p-3",
        "-translate-x-1/2",
        "bg-gradient-radial",
        "from-white",
        "via-white",
        "to-transparent",
        "flex",
        "flex-col",
        "gap-1",
        "justify-center",
        "items-center",
        "text-xs",
      )}
    >
      <Button size="icon-xl" className={cn("rounded-full")}>
        <PlusIcon />
      </Button>
      <span>새 모임</span>
    </div>
  );
}

export default CreateAssembleButton;
