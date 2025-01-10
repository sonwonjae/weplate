import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { Button } from "@/shad-cn/components/ui/button";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

function CreateAssembleButton() {
  const router = useRouter();
  const isWithinCreationLimitQuery = new RQClient({
    url: "/api/assemble/check/within-creation-limit",
  });
  const { data: { isWithinCreationLimit, limit } = {} } = useQuery(
    isWithinCreationLimitQuery.queryOptions,
  );

  const moveCreateAssemblePage = () => {
    if (isWithinCreationLimit) {
      router.push("/assemble/create");
    } else {
      toast.info(`모임 갯수는 ${limit}개를 초과할 수 없습니다.`);
    }
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
