import { dehydrate } from "@tanstack/react-query";
import qs from "query-string";

import { checkSingleQuery } from "@/middlewares/common/queryValidation";
import { checkAuth } from "@/middlewares/pages/auth";
import { CustomIncomingMessage, Middleware, Params } from "@/middlewares/type";
import { pipe } from "@/middlewares/utils/pipe";
import { RQServer } from "@/utils/react-query";

type Req = CustomIncomingMessage<Params, { search?: string }>;

const prefetch: Middleware<Req> = async (req, res) => {
  const { search = "" } = req.query;
  const foodListQuery = new RQServer({
    url: `/api/food/detail/list?${qs.stringify({ search })}`,
    req,
    res,
  });
  await req.queryClient.fetchQuery(foodListQuery.queryOptions);

  return {
    props: { dehydratedState: dehydrate(req.queryClient) },
  };
};

const middleware = pipe(
  checkAuth({ authority: "manager" }),
  checkSingleQuery({
    queryName: "search",
    defaultSingleQuery: "",
  }),
  prefetch,
);

export default middleware;
