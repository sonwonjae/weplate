import type { Middleware, CustomIncomingMessage } from "@/middlewares/type";

import { dehydrate } from "@tanstack/react-query";

import { checkAssembleGuest } from "@/middlewares/pages/assemble";
import { checkAuth } from "@/middlewares/pages/auth";
import { pipe } from "@/middlewares/utils/pipe";
import { RQServer } from "@/utils/react-query";

type Req = CustomIncomingMessage;

const prefetch: Middleware<Req> = async (req, res) => {
  const assembleId = req.params?.assembleId as string;

  try {
    const checkJoinableQuery = new RQServer({
      url: `/api/assemble/${assembleId}/check/full`,
      res,
    });
    await req.queryClient.fetchQuery(checkJoinableQuery.queryOptions);

    return {
      props: { dehydratedState: dehydrate(req.queryClient) },
    };
  } catch {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
};

const middleware = pipe<Req>(
  checkAuth({ required: false }),
  checkAssembleGuest(),
  prefetch,
);

export default middleware;
