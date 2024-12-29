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
    const userInfo = await queryClient.fetchQuery(authQuery.queryOptions);

    const assembleQuery = new RQServer({
      url: `/api/assemble/${assembleId}/item`,
      res,
    });
    const assemble = await queryClient.fetchQuery(assembleQuery.queryOptions);

    const checkJoinableQuery = new RQServer({
      url: `/api/assemble/${assembleId}/check/full`,
      res,
    });
    await queryClient.fetchQuery(checkJoinableQuery.queryOptions);

    const isOwner = assemble.ownerInfo.id === userInfo.id;

    const isMember = !!assemble.memberList.find(({ id: memberId }) => {
      return memberId === userInfo.id;
    });

    /** NOTE: 이미 참여한 사람이면 방으로 이동 */
    if (isOwner || isMember) {
      return {
        redirect: {
          destination: `/assemble/${assembleId}`,
          permanent: true,
        },
      };
    }

    return {
      props: { dehydratedState: dehydrate(queryClient) },
    };
  } catch {
    return {
      props: { dehydratedState: dehydrate(queryClient) },
    };
  }
};

const middleware = pipe<Req>(prefetch);

export default middleware;
