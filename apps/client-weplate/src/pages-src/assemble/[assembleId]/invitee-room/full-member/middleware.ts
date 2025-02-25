import type { Middleware, CustomIncomingMessage } from "@/middlewares/type";

import { dehydrate } from "@tanstack/react-query";

import { checkAssembleGuest } from "@/middlewares/pages/assemble";
import { checkAuth } from "@/middlewares/pages/auth";
import { pipe } from "@/middlewares/utils/pipe";
import { RQServer } from "@/utils/react-query";

type Req = CustomIncomingMessage;

const prefetch: Middleware<Req> = async (req, res) => {
  const assembleId = req.params?.assembleId as string;

  const assembleUserListQuery = new RQServer({
    url: `/api/assemble/${assembleId}/user/list`,
    req,
    res,
  });
  await req.queryClient.fetchQuery(assembleUserListQuery.queryOptions);

  try {
    const isWithinCreationLimitQuery = new RQServer({
      url: "/api/assemble/check/within-creation-limit",
      req,
      res,
    });
    const { isWithinCreationLimit } = await req.queryClient.fetchQuery(
      isWithinCreationLimitQuery.queryOptions,
    );

    if (!isWithinCreationLimit) {
      /** NOTE: 참여 가능한 모임 개수를 초과한 경우에는 모임 개수 초과 페이지로 이동 */
      return {
        redirect: {
          destination: `/assemble/${assembleId}/invitee-room/max-assemble`,
          permanent: true,
        },
      };
    }

    const checkJoinableQuery = new RQServer({
      url: `/api/assemble/${assembleId}/check/full`,
      req,
      res,
    });
    const { joinable, message } = await req.queryClient.fetchQuery(
      checkJoinableQuery.queryOptions,
    );

    if (!joinable && message === "full assemble") {
      return {
        props: { dehydratedState: dehydrate(req.queryClient) },
      };
    } else {
      return {
        redirect: {
          destination: `/assemble/${assembleId}/invitee-room`,
          permanent: true,
        },
      };
    }
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
