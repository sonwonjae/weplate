import { Enums } from "@package/types";
import { dehydrate } from "@tanstack/react-query";

import { RQServer } from "@/utils/react-query";

import { CustomIncomingMessage, Middleware } from "../type";

interface CheckAuthOptions {
  required?: boolean;
  authority?: Enums<"authority">;
}

export const checkAuth = (
  options: CheckAuthOptions = {
    required: true,
    authority: "member",
  },
): Middleware<CustomIncomingMessage> => {
  const required: CheckAuthOptions["required"] = (() => {
    if (options.authority === "manager") {
      return true;
    }

    if (typeof options.required !== "undefined") {
      return options.required;
    }
    return true;
  })();

  const authority: CheckAuthOptions["authority"] = (() => {
    if (typeof options.authority !== "undefined") {
      return options.authority;
    }
    return "member";
  })();

  return async (req, res) => {
    try {
      const authQuery = new RQServer({ url: "/api/user/auth/check", res });
      const userInfo = await req.queryClient.fetchQuery(authQuery.queryOptions);

      if (authority === "manager" && userInfo.authority !== "manager") {
        /** FIXME: 403 페이지 만들어서 그리로 redirect로 수정 필요 */
        return {
          redirect: {
            destination: "/",
            permanent: true,
          },
        };
      }

      req.userInfo = userInfo;

      return {
        props: { dehydratedState: dehydrate(req.queryClient) },
      };
    } catch {
      if (required) {
        return {
          redirect: {
            destination: `/login?redirectUrl=${req.pathname}`,
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
