import type { ServerResponse } from "http";

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
  #method: "GET";
  res: ServerResponse;

  constructor({
    url,
    res,
    customQueryOptions,
    type = "api",
  }: RQServerParams<TQueryFnData, ReqURL>) {
    super({ url, customQueryOptions, type });
    this.#method = "GET";
    this.res = res;
  }

  get queryFn() {
    return async () => {
      try {
        const { data, headers } = await this.axiosInstance(this.url, {
          method: this.#method,
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

interface RQInfinityServerParams<
  TQueryFnData extends InfinityResponseMap[ReqURL],
  ReqURL extends keyof InfinityResponseMap,
> extends RQInfinityDefaultParams<TQueryFnData, ReqURL> {
  res: ServerResponse;
}

export class RQInfinityServer<
  ReqURL extends keyof InfinityResponseMap,
  TQueryFnData extends InfinityResponseMap[ReqURL],
> extends RQInfinity<ReqURL, TQueryFnData> {
  #method: "GET";
  res: ServerResponse;

  constructor({
    url,
    params,
    res,
    customQueryOptions,
  }: RQInfinityServerParams<TQueryFnData, ReqURL>) {
    super({ url, params, customQueryOptions });
    this.#method = "GET";
    this.res = res;
  }

  get queryFn() {
    return async () => {
      try {
        const { data, headers } = await this.axiosInstance(this.url, {
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
