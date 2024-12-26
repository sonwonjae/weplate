import type { Middleware, CustomIncomingMessage } from "@/middlewares/type";

import { dehydrate, QueryClient } from "@tanstack/react-query";

import { pipe } from "@/middlewares/utils/pipe";
import { RQServer } from "@/utils/react-query";

type Req = CustomIncomingMessage;

const prefetch: Middleware<Req> = async (req, res) => {
  const queryClient = new QueryClient();

  const assembleId = req.params?.assembleId as string;
  const assembleQuery = new RQServer({
    url: `/api/food/${assembleId}/check/survey/complete`,
    res,
  });

  try {
    await queryClient.fetchQuery(assembleQuery.queryOptions);
    return {
      redirect: {
        destination: `/assemble/${assembleId}/waiting-room`,
        permanent: true,
      },
    };
  } catch {
    try {
      const authQuery = new RQServer({ url: "/api/user/auth/check", res });
      await queryClient.fetchQuery(authQuery.queryOptions);

      return {
        props: { dehydratedState: dehydrate(queryClient) },
      };
    } catch {
      return {
        redirect: {
          destination: `/login`,
          permanent: true,
        },
      };
    }
  }
};

const middleware = pipe<Req>(prefetch);

export default middleware;
