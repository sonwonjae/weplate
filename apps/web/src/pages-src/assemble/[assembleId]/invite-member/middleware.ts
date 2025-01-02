import { dehydrate } from "@tanstack/react-query";

import { checkAssembleOwner } from "@/middlewares/pages/assemble";
import { checkAuth } from "@/middlewares/pages/auth";
import { pipe } from "@/middlewares/utils/pipe";
import { RQServer } from "@/utils/react-query";

const middleware = pipe(checkAuth(), checkAssembleOwner(), async (req, res) => {
  const assembleId = req.params?.assembleId as string;

  const assembleUserListQuery = new RQServer({
    url: `/api/assemble/${assembleId}/user/list`,
    res,
  });
  await req.queryClient.fetchQuery(assembleUserListQuery.queryOptions);

  return {
    props: { dehydratedState: dehydrate(req.queryClient) },
  };
});

export default middleware;
