import { type PropsWithChildren } from "react";

import {
  StepFooter,
  MoveNextStep,
  RegistFood,
  SubmitFoodList,
  MovePrevStep,
} from "@/features/food-survey-form/layouts/footer";
import {
  CancelSearch,
  SelectFoodList,
  StopRegistFood,
} from "@/features/food-survey-form/layouts/header";
import { Header, Main } from "@/layouts";
import { cn } from "@/utils/tailwind";

function Layout({ children }: PropsWithChildren) {
  return (
    <form className={cn("flex", "flex-col", "h-full")}>
      <Header
        className={cn("w-full", "justify-between", "py-4", "items-center")}
      >
        <CancelSearch />
        <div className={cn("relative", "h-6")}>
          <StopRegistFood type="regist" />
          <SelectFoodList />
        </div>
      </Header>
      <Main>{children}</Main>
      <StepFooter type="regist">
        <MoveNextStep />
        <RegistFood />
        <SubmitFoodList type="regist" />
        <MovePrevStep />
      </StepFooter>
    </form>
  );
}

export default Layout;
