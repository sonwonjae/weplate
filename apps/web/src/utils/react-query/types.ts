/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig } from "axios";

import { ServerResponse } from "http";

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
  "/auth/check": {
    id: string;
    avatarUrl: string;
    name: string;
    email: string;
    providerId: string;
    provider: string;
  };
  "/api/assemble/list/my": Array<{
    id: string;
    title: string;
    createdAt: string;
    udpated: string;
    provider: string;
  }>;
};
export interface RQDefaultParams<
  TQueryFnData extends ResponseMap[ReqURL],
  ReqURL extends keyof ResponseMap,
> {
  url: ReqURL;
  type?: "api" | "auth";
  axiosConfig?: AxiosRequestConfig;
  customQueryOptions?: UseQueryOptions<TQueryFnData, AxiosError>;
}

export interface RQParams<
  TQueryFnData extends ResponseMap[ReqURL],
  ReqURL extends keyof ResponseMap,
> extends RQDefaultParams<TQueryFnData, ReqURL> {}

export interface RQServerParams<
  TQueryFnData extends ResponseMap[ReqURL],
  ReqURL extends keyof ResponseMap,
> extends RQParams<TQueryFnData, ReqURL> {
  res: ServerResponse;
}
