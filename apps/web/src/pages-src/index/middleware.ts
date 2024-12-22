import type {
  Middleware,
  CustomIncomingMessage,
  Params,
  Query,
} from "@/middlewares/type";

import { dehydrate, QueryClient } from "@tanstack/react-query";

import { checkSingleQuery } from "@/middlewares/common/queryValidation";
import { pipe } from "@/middlewares/utils/pipe";
import { RQInfinityServer, RQServer } from "@/utils/react-query";
import { RQInfinityRequestParams } from "@/utils/react-query/infinity";

export type HomePageReq = CustomIncomingMessage<
  Params,
  RQInfinityRequestParams & Query
>;

const prefetch: Middleware<HomePageReq> = async (req, res) => {
  const queryClient = new QueryClient();

  try {
    const authQuery = new RQServer({ url: "/api/user/auth/check", res });
    await queryClient.fetchQuery(authQuery.queryOptions);

    const myAssembleListQuery = new RQInfinityServer({
      url: "/api/assemble/list/my",
      params: req.query,
      res,
    });
    await queryClient.fetchInfiniteQuery(myAssembleListQuery.queryOptions);

    const isWithinCreationLimitQuery = new RQServer({
      url: "/api/assemble/check/within-creation-limit",
      res,
    });
    await queryClient.fetchQuery(isWithinCreationLimitQuery.queryOptions);

    return {
      props: { dehydratedState: dehydrate(queryClient) },
    };
  } catch {
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  }
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
  prefetch,
);

export default middleware;
