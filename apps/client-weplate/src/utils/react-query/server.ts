import {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";

import { RQ } from "./base";
import { ResponseMap, RQDefaultParams } from "./base";
import {
  RQInfinity,
  InfinityResponseMap,
  RQInfinityDefaultParams,
} from "./infinity";

interface RQServerParams<
  TQueryFnData extends ResponseMap[ReqURL],
  ReqURL extends keyof ResponseMap,
> extends RQDefaultParams<TQueryFnData, ReqURL> {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}

const setCookie = ({
  setCookieHeader,
  req,
  res,
}: {
  setCookieHeader?: string[];
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  if (!setCookieHeader) {
    return;
  }
  res.setHeader("Set-Cookie", setCookieHeader);
  req.headers.cookie = setCookieHeader
    .map((cookie) => {
      return cookie.split("; ")[0];
    })
    .join("; ");
};

export class RQServer<
  ReqURL extends keyof ResponseMap,
  TQueryFnData extends ResponseMap[ReqURL],
> extends RQ<ReqURL, TQueryFnData> {
  #method = "GET";
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
  baseURL: string;

  constructor({
    url,
    params,
    req,
    res,
    customQueryOptions,
  }: RQServerParams<TQueryFnData, ReqURL>) {
    super({ url, params, customQueryOptions });
    this.req = req;
    this.res = res;
    this.baseURL = (() => {
      switch (true) {
        case /^\/api\/user/.test(this.url):
          return process.env.NEXT_PUBLIC_AUTH_BASE_URL as string;
        case /^\/api/.test(this.url):
        default:
          return process.env.NEXT_PUBLIC_API_BASE_URL as string;
      }
    })();
  }

  get queryFn() {
    return async () => {
      try {
        const { data, headers } = await this.axiosInstance(this.url, {
          baseURL: this.baseURL,
          method: this.#method,
          params: this.params,
          headers: {
            Cookie: this.req.headers.cookie ?? "",
          },
          withCredentials: true,
        });

        setCookie({
          setCookieHeader: headers?.["set-cookie"],
          req: this.req,
          res: this.res,
        });

        return data as TQueryFnData;
      } catch (error) {
        throw error as AxiosError;
      }
    };
  }
}

interface RQInfinityServerParams<ReqURL extends keyof InfinityResponseMap>
  extends RQInfinityDefaultParams<ReqURL> {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}

export class RQInfinityServer<
  ReqURL extends keyof InfinityResponseMap,
  TQueryFnData extends InfinityResponseMap[ReqURL],
> extends RQInfinity<ReqURL, TQueryFnData> {
  #method = "GET";
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
  baseURL: string;

  constructor({ url, params, req, res }: RQInfinityServerParams<ReqURL>) {
    super({ url, params });
    this.req = req;
    this.res = res;
    this.baseURL = (() => {
      switch (true) {
        case /^\/api\/user/.test(this.url):
          return process.env.NEXT_PUBLIC_AUTH_BASE_URL as string;
        case /^\/api/.test(this.url):
        default:
          return process.env.NEXT_PUBLIC_API_BASE_URL as string;
      }
    })();
  }

  get queryFn(): UseInfiniteQueryOptions<
    TQueryFnData,
    AxiosError,
    InfiniteData<TQueryFnData>,
    TQueryFnData,
    QueryKey,
    string | null
  >["queryFn"] {
    return async ({ pageParam: cursor }) => {
      try {
        const { data: { list, cursor: nextCursor } = {}, headers } =
          await this.axiosInstance(this.url, {
            baseURL: this.baseURL,
            method: this.#method,
            params: {
              ...this.params,
              cursor,
            },
            headers: {
              Cookie: this.req.headers.cookie ?? "",
            },
            withCredentials: true,
          });

        setCookie({
          setCookieHeader: headers?.["set-cookie"],
          req: this.req,
          res: this.res,
        });

        return {
          list,
          cursor: nextCursor,
        } as TQueryFnData;
      } catch (error) {
        throw error as AxiosError;
      }
    };
  }
}
