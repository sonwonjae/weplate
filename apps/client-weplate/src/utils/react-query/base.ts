import type { AxiosError } from "axios";

import https from "https";

import { UseQueryOptions } from "@tanstack/react-query";
import axios, { AxiosInstance } from "axios";

/** FIXME: back 로직이랑 타입 싱크 맞추기 */
export type ResponseMap = {
  [key in `/api/assemble/${string}/check/full`]:
    | {
        readonly joinable: false;
        readonly message: "already member";
      }
    | {
        readonly joinable: false;
        readonly message: "full assemble";
      }
    | {
        readonly joinable: true;
        readonly message: "joinable assemble";
      };
} & {
  [key in `/api/assemble/${string}/check/new-registed-food-member`]: Array<string>;
} & {
  [key in `/api/assemble/${string}/check/countdown`]: number;
} & {
  [key in `/api/food/${string}/recommend/result`]: Array<{
    foodId: string;
    foodName: string;
  }>;
} & {
  [key in `/api/food/${string}/survey`]: {
    favorite: Array<{
      id: string;
      name: string;
    }>;
    hate: Array<{
      id: string;
      name: string;
    }>;
  };
} & {
  [key in `/api/food/${string}/check/survey/complete`]: boolean;
} & {
  [key in `/api/assemble/${string}/user/list`]: Array<{
    id: string;
    permission: "owner" | "member";
    userId: string;
    nickname: string | undefined;
    isRegisted: boolean;
  }>;
} & {
  [key in `/api/assemble/${string}/item`]: {
    createdAt: string;
    id: string;
    title: string;
    updatedAt: string;
    ownerInfo: {
      avatarUrl: string;
      createdAt: string;
      email: string;
      id: string;
      nickname: string;
      provider: "kakao";
      providerId: string;
      updatedAt: string;
    };
    memberList: {
      avatarUrl: string;
      createdAt: string;
      email: string;
      id: string;
      nickname: string;
      provider: "kakao";
      providerId: string;
      updatedAt: string;
    }[];
  };
} & {
  "/api/assemble/check/within-creation-limit": {
    isWithinCreationLimit: boolean;
    limit: number;
  };
  "/api/user/auth/check": {
    id: string;
    avatarUrl: string;
    nickname: string;
    email: string;
    providerId: string;
    provider: string;
  };
  "/api/food/search/list": Array<{
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

export interface RQDefaultParams<
  TQueryFnData extends ResponseMap[ReqURL],
  ReqURL extends keyof ResponseMap,
> {
  url: ReqURL;
  params?: Record<string, unknown>;
  customQueryOptions?: Partial<UseQueryOptions<TQueryFnData, AxiosError>>;
}

export const apiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST,
  timeout: 1000 * 60,
  withCredentials: true,
  httpsAgent: new https.Agent({
    rejectUnauthorized: process.env.NEXT_PUBLIC_MODE !== "dev",
  }),
});

export const authAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST,
  timeout: 1000 * 60,
  withCredentials: true,
  httpsAgent: new https.Agent({
    rejectUnauthorized: process.env.NEXT_PUBLIC_MODE !== "dev",
  }),
});

export class RQ<
  ReqURL extends keyof ResponseMap,
  TQueryFnData extends ResponseMap[ReqURL],
> {
  #method = "GET";

  url: RQDefaultParams<TQueryFnData, ReqURL>["url"];
  params: RQDefaultParams<TQueryFnData, ReqURL>["params"];
  customQueryOptions?: RQDefaultParams<
    TQueryFnData,
    ReqURL
  >["customQueryOptions"];
  axiosInstance: AxiosInstance;

  constructor({
    url,
    params,
    customQueryOptions,
  }: RQDefaultParams<TQueryFnData, ReqURL>) {
    this.url = url;
    this.params = params;
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
    return [...this.baseKey, this.params].filter(Boolean);
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
