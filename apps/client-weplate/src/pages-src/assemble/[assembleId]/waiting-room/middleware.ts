import type { Middleware, CustomIncomingMessage } from "@/middlewares/type";

import { dehydrate } from "@tanstack/react-query";

import {
  checkAssembleMember,
  checkFoodSurveyStatus,
  checkRecommendedFoodListStatus,
} from "@/middlewares/pages/assemble";
import { pipe } from "@/middlewares/utils/pipe";
import { RQServer } from "@/utils/react-query";

type Req = CustomIncomingMessage;

const prefetch: Middleware<Req> = async (req, res) => {
  const assembleId = req.params?.assembleId as string;

  const assembleUserListQuery = new RQServer({
    url: `/api/assemble/${assembleId}/user/list`,
    req,
    res,
  });
  await req.queryClient.fetchQuery(assembleUserListQuery.queryOptions);

  return {
    props: { dehydratedState: dehydrate(req.queryClient) },
  };
};

const middleware = pipe<Req>(
  checkAssembleMember(),
  checkFoodSurveyStatus({ permission: "complete" }),
  checkRecommendedFoodListStatus({ permission: "not-yet" }),
  prefetch,
  (req) => {
    return { props: { dehydratedState: dehydrate(req.queryClient) } };
  },
);

export default middleware;
