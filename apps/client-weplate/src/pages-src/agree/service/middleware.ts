import { dehydrate } from "@tanstack/react-query";

import { pipe } from "@/middlewares/utils/pipe";
import { RQServer } from "@/utils/react-query";

const middleware = pipe(async (req, res) => {
  try {
    const agreeServicePolicyQuery = new RQServer({
      url: "/api/agree/check/service/policy",
      req,
      res,
    });
    const agreeServicePolicy = await req.queryClient.fetchQuery(
      agreeServicePolicyQuery.queryOptions,
    );

    if (agreeServicePolicy.isValid) {
      return {
        redirect: {
          destination: String(req.query.redirectUrl) ?? "/",
          permanent: true,
        },
      };
    }

    return {
      props: { dehydratedState: dehydrate(req.queryClient) },
    };
  } catch {
    return {
      redirect: {
        destination: `/login?redirectUrl=${req.pathname}`,
        permanent: true,
      },
    };
  }
});

export default middleware;
