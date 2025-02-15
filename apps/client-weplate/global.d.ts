import "@tanstack/react-query";

type Nullable<T> = T | null;

type UnionToIntersection<U> = (
  U extends unknown ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never;

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError;
  }
}
