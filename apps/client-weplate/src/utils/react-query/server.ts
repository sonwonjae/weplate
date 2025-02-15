import type { ServerResponse } from "http";

import {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

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
  res: ServerResponse;
}

export class RQServer<
  ReqURL extends keyof ResponseMap,
  TQueryFnData extends ResponseMap[ReqURL],
> extends RQ<ReqURL, TQueryFnData> {
  #method = "GET";
  res: ServerResponse;

  constructor({
    url,
    params,
    res,
    customQueryOptions,
  }: RQServerParams<TQueryFnData, ReqURL>) {
    super({ url, params, customQueryOptions });
    this.res = res;
  }

  get queryFn() {
    return async () => {
      try {
        const { data, headers } = await this.axiosInstance(this.url, {
          baseURL: /^\/api\/user/.test(this.url)
            ? "http://localhost:5555"
            : "http://localhost:7777",
          method: this.#method,
          params: this.params,
          withCredentials: true,
        });
        const setCookieHeader = headers["set-cookie"];

        if (setCookieHeader) {
          this.res.setHeader("Set-Cookie", setCookieHeader);
        }

        return data as TQueryFnData;
      } catch (error) {
        throw error as AxiosError;
      }
    };
  }
}

interface RQInfinityServerParams<ReqURL extends keyof InfinityResponseMap>
  extends RQInfinityDefaultParams<ReqURL> {
  res: ServerResponse;
}

export class RQInfinityServer<
  ReqURL extends keyof InfinityResponseMap,
  TQueryFnData extends InfinityResponseMap[ReqURL],
> extends RQInfinity<ReqURL, TQueryFnData> {
  #method = "GET";
  res: ServerResponse;

  constructor({ url, params, res }: RQInfinityServerParams<ReqURL>) {
    super({ url, params });
    this.res = res;
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
            method: this.#method,
            params: {
              ...this.params,
              cursor,
            },
            withCredentials: true,
          });
        const setCookieHeader = headers["set-cookie"];

        if (setCookieHeader) {
          this.res.setHeader("Set-Cookie", setCookieHeader);
        }

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
