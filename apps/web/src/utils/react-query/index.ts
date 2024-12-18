// import type { RQParams, RQServerParams } from "./types";
import type {
  ResponseMap,
  RQDefaultParams,
  RQParams,
  RQServerParams,
} from "./types";
import type { ServerResponse } from "http";

import axios, { AxiosError, AxiosInstance } from "axios";

export const apiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_HOST,
  timeout: 1000 * 60,
  withCredentials: true,
});

export const authAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_SERVER_HOST,
  timeout: 1000 * 60,
  withCredentials: true,
});

class RQ<
  ReqURL extends keyof ResponseMap,
  TQueryFnData extends ResponseMap[ReqURL],
> {
  #method: "GET";

  url: RQDefaultParams<TQueryFnData, ReqURL>["url"];
  type?: RQDefaultParams<TQueryFnData, ReqURL>["type"];
  axiosConfig?: RQDefaultParams<TQueryFnData, ReqURL>["axiosConfig"];
  customQueryOptions?: RQDefaultParams<
    TQueryFnData,
    ReqURL
  >["customQueryOptions"];
  axiosInstance: AxiosInstance;

  constructor({
    url,
    type = "api",
    axiosConfig,
    customQueryOptions,
  }: RQParams<TQueryFnData, ReqURL>) {
    this.#method = "GET";

    this.url = url;
    this.type = type;
    this.axiosConfig = axiosConfig;
    this.customQueryOptions = customQueryOptions;
    this.axiosInstance = (() => {
      switch (type) {
        case "auth":
          return authAxios;
        case "api":
        default:
          return apiAxios;
      }
    })();
  }

  get baseKey() {
    return [this.url, this.#method];
  }

  get queryKey() {
    return [
      ...this.baseKey,
      ...Object.values({ ...this.axiosConfig?.params }),
      ...Object.values({ ...this.axiosConfig?.data }),
    ] as const;
  }

  get queryFn() {
    return async () => {
      try {
        const { data } = await this.axiosInstance(this.url, {
          method: this.#method,
          withCredentials: true,
          ...this.axiosConfig,
        });

        return data as TQueryFnData;
      } catch (error) {
        throw error as AxiosError;
      }
    };
  }

  get queryOptions() {
    return {
      ...this.customQueryOptions,
      queryKey: this.queryKey,
      queryFn: this.queryFn,
    };
  }
}

export class RQClient<
  ReqURL extends keyof ResponseMap,
  TQueryFnData extends ResponseMap[ReqURL],
> extends RQ<ReqURL, TQueryFnData> {
  constructor({
    url,
    axiosConfig,
    customQueryOptions,
    type = "api",
  }: RQParams<TQueryFnData, ReqURL>) {
    super({ url, axiosConfig, customQueryOptions, type });
  }
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
    axiosConfig,
    customQueryOptions,
    type = "api",
  }: RQServerParams<TQueryFnData, ReqURL>) {
    super({ url, axiosConfig, customQueryOptions, type });
    this.#method = "GET";
    this.res = res;
  }

  get queryFn() {
    return async () => {
      try {
        const { data, headers } = await this.axiosInstance(this.url, {
          method: this.#method,
          withCredentials: true,
          ...this.axiosConfig,
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
