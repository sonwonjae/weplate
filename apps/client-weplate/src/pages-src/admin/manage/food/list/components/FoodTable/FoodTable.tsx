import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import qs from "query-string";
import { useState } from "react";

import { Input } from "@/shad-cn/components/ui/input";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import { columns } from "./columns";
import DataTable from "./DataTable";

function FoodTable() {
  const router = useRouter();
  const search = String(router.query.search ?? "");
  const queryString = qs.stringify({
    search,
  });

  const foodListQuery = new RQClient({
    url: `/api/food/detail/list?${queryString}`,
  });
  const { data: foodList } = useQuery(foodListQuery.queryOptions);

  const [searchKeyword, setSearchKeyword] = useState(search);

  if (!foodList) {
    return null;
  }

  return (
    <div className={cn("container", "mx-auto", "pb-10", "flex", "flex-col")}>
      <form
        className={cn("sticky", "top-0", "z-10", "bg-white", "pt-10", "pb-4")}
        onSubmit={(e) => {
          e.preventDefault();
          router.push({
            query: {
              search: searchKeyword,
            },
          });
        }}
      >
        <Input
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
          }}
          className={cn("w-full", "bg-white")}
          uiSize="md"
          type="search"
          onDelete={() => {
            setSearchKeyword("");
          }}
        />
      </form>
      <DataTable columns={columns} data={foodList} />
    </div>
  );
}

export default FoodTable;
