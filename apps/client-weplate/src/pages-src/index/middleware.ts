import type {
  Middleware,
  CustomIncomingMessage,
  Params,
  Query,
} from "@/middlewares/type";

import { dehydrate } from "@tanstack/react-query";

import { checkSingleQuery } from "@/middlewares/common/queryValidation";
import { checkWithInCreationLimit } from "@/middlewares/pages/assemble";
import { checkAuth } from "@/middlewares/pages/auth";
import { pipe } from "@/middlewares/utils/pipe";
import { RQInfinityServer } from "@/utils/react-query";
import { RQInfinityRequestParams } from "@/utils/react-query/infinity";

export type HomePageReq = CustomIncomingMessage<
  Params,
  RQInfinityRequestParams & Query
>;

const prefetch: Middleware<HomePageReq> = async (req, res) => {
  const myAssembleListQuery = new RQInfinityServer({
    url: "/api/assemble/list/my",
    params: req.query,
    req,
    res,
  });
  await req.queryClient.fetchInfiniteQuery(myAssembleListQuery.queryOptions);

  return {
    props: { dehydratedState: dehydrate(req.queryClient) },
  };
};

const middleware = pipe<HomePageReq>(
  checkSingleQuery({
    queryName: "search",
  }),
  checkSingleQuery({
    queryName: "sort",
    defaultSingleQuery: "latest",
  }),
  checkSingleQuery({
    queryName: "limit",
    defaultSingleQuery: Number(process.env.NEXT_PUBLIC_ASSEMBLE_PAGE_LIMIT),
  }),
  checkAuth(),
  checkWithInCreationLimit(),
  prefetch,
);

export default middleware;
