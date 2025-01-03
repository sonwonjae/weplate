import { dehydrate } from "@tanstack/react-query";

import {
  checkAssembleMember,
  checkFoodSurveyStatus,
} from "@/middlewares/pages/assemble";
import { checkAuth } from "@/middlewares/pages/auth";
import { pipe } from "@/middlewares/utils/pipe";
import { RQServer } from "@/utils/react-query";

const middleware = pipe(
  checkAuth(),
  checkAssembleMember(),
  checkFoodSurveyStatus({ permission: "complete" }),
  async (req, res) => {
    const assembleId = req.params?.assembleId as string;
    const foodSurveyQuery = new RQServer({
      url: `/api/food/${assembleId}/survey`,
      res,
    });
    await req.queryClient.fetchQuery(foodSurveyQuery.queryOptions);

    return {
      props: { dehydratedState: dehydrate(req.queryClient) },
    };
  },
);

export default middleware;
