import type { AxiosError } from "axios";

import { UseQueryOptions } from "@tanstack/react-query";
import axios, { AxiosInstance } from "axios";

/** FIXME: back 로직이랑 타입 싱크 맞추기 */
export type ResponseMap = {
  [key in `/api/assemble/${string}/item`]: {
    id: string;
    title: string;
    createdAt: string;
    udpated: string;
    provider: string;
  };
} & {
  "/api/assemble/check/within-creation-limit": {
    isWithinCreationLimit: boolean;
    limit: number;
  };
  "/api/user/auth/check": {
    id: string;
    avatarUrl: string;
    name: string;
    email: string;
    providerId: string;
    provider: string;
  };
};

export interface RQDefaultParams<
  TQueryFnData extends ResponseMap[ReqURL],
  ReqURL extends keyof ResponseMap,
> {
  url: ReqURL;
  customQueryOptions?: UseQueryOptions<TQueryFnData, AxiosError>;
}

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

export class RQ<
  ReqURL extends keyof ResponseMap,
  TQueryFnData extends ResponseMap[ReqURL],
> {
  #method = "GET";

  url: RQDefaultParams<TQueryFnData, ReqURL>["url"];
  customQueryOptions?: RQDefaultParams<
    TQueryFnData,
    ReqURL
  >["customQueryOptions"];
  axiosInstance: AxiosInstance;

  constructor({
    url,
    customQueryOptions,
  }: RQDefaultParams<TQueryFnData, ReqURL>) {
    this.url = url;
    this.customQueryOptions = customQueryOptions;
    this.axiosInstance = (() => {
      switch (true) {
        case /^\/api\/user/.test(this.url):
          return authAxios;
        case /^^\/api/.test(this.url):
        default:
          return apiAxios;
      }
    })();
  }

  get baseKey() {
    return [this.url, this.#method];
  }

  get queryKey() {
    return [...this.baseKey] as const;
  }

  get queryFn() {
    return async () => {
      try {
        const { data } = await this.axiosInstance(this.url, {
          method: this.#method,
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
