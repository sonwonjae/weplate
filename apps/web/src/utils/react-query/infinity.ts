import { UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosInstance } from "axios";

import {
  apiAxios,
  // authAxios,
} from "./base";

export interface RQInfinityRequestParams {
  cursor?: string | null;
  search?: string;
  sort: "latest" | "oldest";
  limit: number;
}

/** FIXME: back 로직이랑 타입 싱크 맞추기 */
export type InfinityResponseMap = {
  "/api/assemble/list/my": Array<{
    id: string;
    title: string;
    createdAt: string;
    udpated: string;
    provider: string;
  }>;
};

export interface RQInfinityDefaultParams<
  TQueryFnData extends InfinityResponseMap[ReqURL],
  ReqURL extends keyof InfinityResponseMap,
> {
  url: ReqURL;
  params: RQInfinityRequestParams;
  customQueryOptions?: UseQueryOptions<TQueryFnData, AxiosError>;
}

export class RQInfinity<
  ReqURL extends keyof InfinityResponseMap,
  TQueryFnData extends InfinityResponseMap[ReqURL],
> {
  #method: "GET";

  url: RQInfinityDefaultParams<TQueryFnData, ReqURL>["url"];
  params: RQInfinityDefaultParams<TQueryFnData, ReqURL>["params"];
  customQueryOptions?: RQInfinityDefaultParams<
    TQueryFnData,
    ReqURL
  >["customQueryOptions"];
  axiosInstance: AxiosInstance;

  constructor({
    url,
    params,
    customQueryOptions,
  }: RQInfinityDefaultParams<TQueryFnData, ReqURL>) {
    this.#method = "GET";

    this.url = url;
    this.params = params;
    this.customQueryOptions = customQueryOptions;

    this.axiosInstance = (() => {
      switch (url) {
        case "/api/assemble/list/my":
        default:
          return apiAxios;
      }
    })();
  }

  get baseKey() {
    return [this.url, this.#method];
  }

  get queryKey() {
    return [...this.baseKey, this.params] as const;
  }

  get queryFn() {
    return async () => {
      try {
        const { data } = await this.axiosInstance(this.url, {
          method: this.#method,
          params: this.params,
          withCredentials: true,
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
