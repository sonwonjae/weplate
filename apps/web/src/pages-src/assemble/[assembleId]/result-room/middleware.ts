import type { Middleware, CustomIncomingMessage } from "@/middlewares/type";

import { dehydrate } from "@tanstack/react-query";

import {
  checkAssembleMember,
  checkFoodSurveyStatus,
  checkRecommendedFoodListStatus,
} from "@/middlewares/pages/assemble";
import { checkAuth } from "@/middlewares/pages/auth";
import { pipe } from "@/middlewares/utils/pipe";
import { RQServer } from "@/utils/react-query";

type Req = CustomIncomingMessage;

const prefetch: Middleware<Req> = async (req, res) => {
  const assembleId = req.params?.assembleId as string;

  const assembleUserListQuery = new RQServer({
    url: `/api/assemble/${assembleId}/user/list`,
    res,
  });
  await req.queryClient.fetchQuery(assembleUserListQuery.queryOptions);

  const newRegistedFoodMemberListQuery = new RQServer({
    url: `/api/assemble/${assembleId}/check/new-registed-food-member`,
    res,
  });
  await req.queryClient.fetchQuery(newRegistedFoodMemberListQuery.queryOptions);

  return {
    props: { dehydratedState: dehydrate(req.queryClient) },
  };
};

const middleware = pipe<Req>(
  checkAuth(),
  checkAssembleMember(),
  checkFoodSurveyStatus({ permission: "complete" }),
  checkRecommendedFoodListStatus({ permission: "complete" }),
  prefetch,
);

export default middleware;
