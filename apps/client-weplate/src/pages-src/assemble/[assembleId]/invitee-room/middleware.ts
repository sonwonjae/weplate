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
      /** NOTE: 모임 참여 인원이 가득 찬 경우 모임 인원 초과 페이지로 이동 */
      return {
        redirect: {
          destination: `/assemble/${assembleId}/invitee-room/full-member`,
          permanent: true,
        },
      };
    }

    /** NOTE: 이 외의 경우에는 통과 */
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
