import type { Middleware, CustomIncomingMessage } from "@/middlewares/type";

import { dehydrate, QueryClient } from "@tanstack/react-query";

import { pipe } from "@/middlewares/utils/pipe";
import { RQServer } from "@/utils/react-query";

type Req = CustomIncomingMessage;

const prefetch: Middleware<Req> = async (req, res) => {
  const queryClient = new QueryClient();

  try {
    const authQuery = new RQServer({ type: "auth", url: "/api/user/auth/check", res });
    await queryClient.fetchQuery(authQuery.queryOptions);

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

const middleware = pipe<Req>(prefetch);

export default middleware;
