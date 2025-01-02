import { IncomingMessage, ServerResponse } from "http";

import { QueryClient } from "@tanstack/react-query";
import { GetServerSidePropsResult } from "next";
import { createRouter } from "next-connect";

export interface Params {
  [key: string]: string | undefined;
}

export interface Query {
  [key: string]: string | string[] | undefined;
}

export type CustomIncomingMessage<
  TParams extends Params = Params,
  TQuery extends Query = Query,
> = IncomingMessage & {
  params?: TParams;
  query: TQuery;
  pathname: string;
  cookies: Record<string, string | undefined>;
  queryClient: QueryClient;
} & {
  userInfo?: {
    id: string;
    avatarUrl: string;
    name: string;
    email: string;
    providerId: string;
    provider: string;
  };
} & {
  userInfo: {
    id: string;
    avatarUrl: string;
    name: string;
    email: string;
    providerId: string;
    provider: string;
  };
};

export type Middleware<
  Req extends CustomIncomingMessage = CustomIncomingMessage,
  Props extends object = object,
> = (
  ...params: Parameters<
    Exclude<
      Parameters<
        ReturnType<
          typeof createRouter<CustomIncomingMessage & Req, ServerResponse>
        >["get"]
      >[0],
      string | RegExp
    >
  >
) => GetServerSidePropsResult<Props> | Promise<GetServerSidePropsResult<Props>>;
