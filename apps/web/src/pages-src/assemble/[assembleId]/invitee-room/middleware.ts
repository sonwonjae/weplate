import type { Middleware, CustomIncomingMessage } from "@/middlewares/type";

import { dehydrate, QueryClient } from "@tanstack/react-query";

import { pipe } from "@/middlewares/utils/pipe";
import { RQServer } from "@/utils/react-query";

type Req = CustomIncomingMessage;

const prefetch: Middleware<Req> = async (req, res) => {
  const queryClient = new QueryClient();
  const assembleId = req.params?.assembleId as string;

  const assembleQuery = new RQServer({
    url: `/api/assemble/${assembleId}/item`,
    res,
  });
  await queryClient.fetchQuery(assembleQuery.queryOptions);

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
};

const middleware = pipe<Req>(prefetch);

export default middleware;
