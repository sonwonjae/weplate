import { dehydrate } from "@tanstack/react-query";

import { RQServer } from "@/utils/react-query";

import { CustomIncomingMessage, Middleware } from "../type";

interface CheckAuthParams {
  required: boolean;
}

export const checkAuth = (
  { required = true }: CheckAuthParams = { required: true },
): Middleware<CustomIncomingMessage> => {
  return async (req, res) => {
    try {
      const authQuery = new RQServer({ url: "/api/user/auth/check", res });
      const userInfo = await req.queryClient.fetchQuery(authQuery.queryOptions);

      req.userInfo = userInfo;

      return {
        props: { dehydratedState: dehydrate(req.queryClient) },
      };
    } catch {
      if (required) {
        return {
          redirect: {
            destination: "/login",
            permanent: true,
          },
        };
      } else {
        return {
          props: { dehydratedState: dehydrate(req.queryClient) },
        };
      }
    }
  };
};

interface CheckGuestParams {
  required: boolean;
}

export const checkGuest = (
  { required = true }: CheckGuestParams = { required: true },
): Middleware<CustomIncomingMessage> => {
  return async (req, res) => {
    try {
      const authQuery = new RQServer({ url: "/api/user/auth/check", res });
      await req.queryClient.fetchQuery(authQuery.queryOptions);

      if (required) {
        return {
          redirect: {
            destination: "/",
            permanent: true,
          },
        };
      } else {
        return {
          props: { dehydratedState: dehydrate(req.queryClient) },
        };
      }
    } catch {
      return {
        props: { dehydratedState: dehydrate(req.queryClient) },
      };
    }
  };
};
