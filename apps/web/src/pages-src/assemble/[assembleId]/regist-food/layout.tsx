import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Main } from "@/layouts";
import { Form } from "@/shad-cn/components/ui/form";
import { cn } from "@/utils/tailwind";

import { RegistFoodPageHeader, RegistFoodPageFooter } from "./layouts";
import { useRegistFoodStore } from "./stores/regist-foods";
import { useRegistStepsStore } from "./stores/regist-foods-steps";

const preListScheme = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    status: z.union([z.literal("pre-checked"), z.literal("pre-unchecked")]),
  }),
);
const listScheme = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);

export const foodSurveyForm = z.object({
  favorite: z.object({
    searchKeyword: z.string(),
    preList: preListScheme,
    list: listScheme,
  }),
  hate: z.object({
    searchKeyword: z.string(),
    preList: preListScheme,
    list: listScheme,
  }),
});

function Layout({ children }: PropsWithChildren) {
  const form = useForm<z.infer<typeof foodSurveyForm>>({
    resolver: zodResolver(foodSurveyForm),
    defaultValues: {
      favorite: {
        searchKeyword: "",
        preList: [],
        list: [],
      },
      hate: {
        searchKeyword: "",
        preList: [],
        list: [],
      },
    },
  });

  const router = useRouter();
  const resetRegistFoods = useRegistFoodStore((state) => {
    return state.resetRegistFoods;
  });
  const resetStep = useRegistStepsStore((state) => {
    return state.resetStep;
  });

  useEffect(() => {
    form.reset();
    resetRegistFoods();
    resetStep();
  }, [router.pathname]);

  return (
    <Form {...form}>
      <form className={cn("flex", "flex-col", "h-full")}>
        <RegistFoodPageHeader />
        <Main>{children}</Main>
        <RegistFoodPageFooter />
      </form>
    </Form>
  );
}

export default Layout;
