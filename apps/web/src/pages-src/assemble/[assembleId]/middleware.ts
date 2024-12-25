import type { Middleware, CustomIncomingMessage } from "@/middlewares/type";

import { pipe } from "@/middlewares/utils/pipe";

type Req = CustomIncomingMessage;

const prefetch: Middleware<Req> = async (req) => {
  const assembleId = req.params?.assembleId as string;

  // FIXME: 추후에 이런 저런 권한 체크 후 알맞은 페이지로 redirect하도록 수정하기
  return {
    redirect: {
      destination: `/assemble/${assembleId}/regist-food`,
      permanent: true,
    },
  };
};

const middleware = pipe<Req>(prefetch);

export default middleware;
