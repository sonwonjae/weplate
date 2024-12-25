import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Main } from "@/layouts";
import { Form } from "@/shad-cn/components/ui/form";

import { RegistFoodPageHeader, RegistFoodPageFooter } from "./layouts";
import { useFavoriteFoodStore } from "./stores/regist-foods";

export const foodSurveyForm = z.object({
  favorite: z.string(),
  preFavoriteList: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      status: z.union([z.literal("pre-checked"), z.literal("pre-unchecked")]),
    }),
  ),
  favoriteList: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
  hate: z.string(),
  hateList: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
});

function Layout({ children }: PropsWithChildren) {
  const form = useForm<z.infer<typeof foodSurveyForm>>({
    resolver: zodResolver(foodSurveyForm),
    defaultValues: {
      favorite: "",
      preFavoriteList: [],
      favoriteList: [],
      hate: "",
      hateList: [],
    },
  });

  const router = useRouter();
  const reset = useFavoriteFoodStore((state) => {
    return state.reset;
  });

  useEffect(() => {
    reset();
    form.reset();
  }, [router.pathname]);

  return (
    <Form {...form}>
      <RegistFoodPageHeader />
      <Main>{children}</Main>
      <RegistFoodPageFooter />
    </Form>
  );
}

export default Layout;
