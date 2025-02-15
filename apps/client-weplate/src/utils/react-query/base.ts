import type { AxiosError } from "axios";

import { Tables } from "@package/types";
import { UseQueryOptions } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

import apiAxios from "./apiAxios";
import authAxios from "./authAxios";

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
  [key in `/api/food/detail/list?${string}`]: Array<
    {
      cuisine: {
        id: string;
        name: string;
      }[];
    } & Tables<"foods">
  >;
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
    ownerInfo: Tables<"users">;
    memberList: Tables<"users">[];
  };
} & {
  "/api/assemble/check/within-creation-limit": {
    isWithinCreationLimit: boolean;
    limit: number;
  };
  "/api/user/auth/check": Tables<"users">;
  "/api/food/search/list": Array<Tables<"foods">>;
  "/api/agree/check/service/policy": { isValid: boolean };
};

export interface RQDefaultParams<
  TQueryFnData extends ResponseMap[ReqURL],
  ReqURL extends keyof ResponseMap,
> {
  url: ReqURL;
  params?: Record<string, unknown>;
  customQueryOptions?: Partial<UseQueryOptions<TQueryFnData, AxiosError>>;
}

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
        case /^\/api/.test(this.url):
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
        console.log({ data });
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
