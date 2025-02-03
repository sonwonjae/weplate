import {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { AxiosError, AxiosInstance } from "axios";

import apiAxios from "./apiAxios";

export interface RQInfinityRequestParams {
  search?: string;
  sort: "latest" | "oldest";
  limit: number;
}

/** FIXME: back 로직이랑 타입 싱크 맞추기 */
export type InfinityResponseMap = {
  "/api/assemble/list/my": {
    list: Array<{
      id: string;
      title: string;
      createdAt: string;
      udpatedAt: string;
      userAssembleList: Array<{
        id: string;
        permission: "owner" | "member";
        userId: string | undefined;
        nickname: string | undefined;
        isRegisted: boolean;
      }>;
    }>;
    cursor: string | null;
  };
};

export interface RQInfinityDefaultParams<
  ReqURL extends keyof InfinityResponseMap,
> {
  url: ReqURL;
  params: Record<string, unknown>;
}

export class RQInfinity<
  ReqURL extends keyof InfinityResponseMap,
  TQueryFnData extends InfinityResponseMap[ReqURL],
> {
  #method = "GET";

  url: RQInfinityDefaultParams<ReqURL>["url"];
  _params: RQInfinityDefaultParams<ReqURL>["params"];
  axiosInstance: AxiosInstance;

  constructor({ url, params }: RQInfinityDefaultParams<ReqURL>) {
    this.url = url;
    this._params = params;

    this.axiosInstance = (() => {
      switch (true) {
        case /^\/api/.test(this.url):
        default:
          return apiAxios;
      }
    })();
  }

  get params(): RQInfinityRequestParams {
    const params: Partial<RQInfinityRequestParams> = {};

    if (typeof this._params?.search === "string") {
      params.search = this._params.search;
    } else {
      params.search = "";
    }

    if (this._params?.sort === "latest" || this._params?.sort === "oldest") {
      params.sort = this._params.sort;
    } else {
      throw new Error("RQInfinity에서 sort 값은 필수입니다.");
    }

    if (!Number.isNaN(Number(this._params?.limit))) {
      params.limit = Number(this._params?.limit);
    } else {
      throw new Error("RQInfinity에서 limit 값은 필수입니다.");
    }

    return params as Required<RQInfinityRequestParams>;
  }

  get baseKey() {
    return [this.url, this.#method];
  }

  get queryKey() {
    return [...this.baseKey, this.params] as const;
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
        const { data: { list, cursor: nextCursor } = {} } =
          await this.axiosInstance(this.url, {
            method: this.#method,
            params: {
              ...this.params,
              cursor,
            },
            withCredentials: true,
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

  get queryOptions(): UseInfiniteQueryOptions<
    TQueryFnData,
    AxiosError,
    InfiniteData<TQueryFnData>,
    TQueryFnData,
    QueryKey,
    string | null
  > {
    return {
      queryKey: this.queryKey,
      queryFn: this.queryFn,
      getNextPageParam: ({ cursor }) => {
        return cursor;
      },
      initialPageParam: null,
    };
  }
}
