import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { foodSurveyForm } from "@/features/food-survey-form/scheme";
import { useFoodSurveyStepsStore } from "@/features/food-survey-form/stores/food-survey-steps";
import { useSearchFoodStore } from "@/features/food-survey-form/stores/search-food";
import { Form } from "@/shad-cn/components/ui/form";

function EditFoodSurveyFormLayer({ children }: PropsWithChildren) {
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
  const resetSearchFoods = useSearchFoodStore((state) => {
    return state.resetSearchFoods;
  });
  const resetStep = useFoodSurveyStepsStore((state) => {
    return state.resetStep;
  });

  useEffect(() => {
    form.reset();
    resetSearchFoods();
    resetStep();
  }, [router.pathname]);

  return <Form {...form}>{children}</Form>;
}

export default EditFoodSurveyFormLayer;
