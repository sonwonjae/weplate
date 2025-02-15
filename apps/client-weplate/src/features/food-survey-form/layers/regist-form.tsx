import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { foodSurveyForm } from "@/features/food-survey-form/scheme";
import { useFoodSurveyStepsStore } from "@/features/food-survey-form/stores/food-survey-steps";
import { useSearchFoodStore } from "@/features/food-survey-form/stores/search-food";
import { Form } from "@/shad-cn/components/ui/form";

function RegistFoodSurveyFormLayer({ children }: PropsWithChildren) {
  const form = useForm<z.infer<typeof foodSurveyForm>>({
    resolver: zodResolver(foodSurveyForm),
    values: {
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

  const resetSearchFoods = useSearchFoodStore((state) => {
    return state.resetSearchFoods;
  });
  const resetStep = useFoodSurveyStepsStore((state) => {
    return state.resetStep;
  });

  useEffect(() => {
    return () => {
      form.reset();
      resetSearchFoods();
      resetStep();
    };
  }, []);

  return <Form {...form}>{children}</Form>;
}

export default RegistFoodSurveyFormLayer;
