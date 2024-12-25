import { Header } from "@/layouts";
import { cn } from "@/utils/tailwind";

import CancelSearch from "./CancelSearch";
import SelectFoodList from "./SelectFoodList";
import StopRegistFood from "./StopRegistFood";

function RegistFoodPageHeader() {
  return (
    <Header className={cn("w-full", "justify-between", "py-4", "items-center")}>
      <CancelSearch />
      <div className={cn("relative", "h-6")}>
        <StopRegistFood />
        <SelectFoodList />
      </div>
    </Header>
  );
}

export default RegistFoodPageHeader;
