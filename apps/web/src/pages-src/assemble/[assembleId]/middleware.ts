import type { Middleware, CustomIncomingMessage } from "@/middlewares/type";

import { dehydrate, QueryClient } from "@tanstack/react-query";

import { pipe } from "@/middlewares/utils/pipe";
import { RQServer } from "@/utils/react-query";

type Req = CustomIncomingMessage;

const prefetch: Middleware<Req> = async (req, res) => {
  const queryClient = new QueryClient();

  const assembleId = req.params?.assembleId as string;

  try {
    const authQuery = new RQServer({ url: "/api/user/auth/check", res });
    const assembleQuery = new RQServer({
      url: `/api/assemble/${assembleId}/item`,
      res,
    });
    await queryClient.fetchQuery(authQuery.queryOptions);
    await queryClient.fetchQuery(assembleQuery.queryOptions);

    return {
      props: { dehydratedState: dehydrate(queryClient) },
    };
  } catch {
    return {
      redirect: {
        destination: `/assemble/${assembleId}/request-invite`,
        permanent: true,
      },
    };
  }
};

const middleware = pipe<Req>(prefetch);

export default middleware;
