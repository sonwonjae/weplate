import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { foodSurveyForm } from "@/features/food-survey-form/scheme";
import { useFoodSurveyStepsStore } from "@/features/food-survey-form/stores/food-survey-steps";
import { useSearchFoodStore } from "@/features/food-survey-form/stores/search-food";
import { Form } from "@/shad-cn/components/ui/form";
import { RQClient } from "@/utils/react-query";

function EditFoodSurveyFormLayer({ children }: PropsWithChildren) {
  const router = useRouter();

  const foodSurveyQuery = new RQClient({
    url: `/api/food/${router.query.assembleId}/survey`,
  });
  const { data: { favorite = [], hate = [] } = {} } = useQuery(
    foodSurveyQuery.queryOptions,
  );

  const form = useForm<z.infer<typeof foodSurveyForm>>({
    resolver: zodResolver(foodSurveyForm),
    values: {
      favorite: {
        searchKeyword: "",
        preList: [],
        list: favorite,
      },
      hate: {
        searchKeyword: "",
        preList: [],
        list: hate,
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

export default EditFoodSurveyFormLayer;
