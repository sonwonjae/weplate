import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/shad-cn/components/ui/badge";
import { ResponseMap } from "@/utils/react-query/base";
import { cn } from "@/utils/tailwind";

type Payment = ResponseMap[`/api/food/detail/list?${string}`][number];

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "name",
    header: "음식 이름",
  },
  {
    accessorKey: "cuisine",
    header: "음식 카테고리",
    cell: ({ row }) => {
      const cuisine = row.original.cuisine;

      return (
        <div className={cn("flex", "gap-2", "items-center")}>
          {cuisine.map(({ id, name }) => {
            return (
              <Badge key={id} size="sm" outline>
                {name}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
];
