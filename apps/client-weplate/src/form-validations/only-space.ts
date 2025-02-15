import { ZodType } from "zod";

export const checkOnlySpace: Parameters<ZodType<string>["refine"]>[0] = (
  value,
) => {
  return !!value.trim().length;
};

export const checkOnlySpaceErrorMessage: Parameters<
  ZodType<string>["refine"]
>[1] = "공백만 입력할 수 없습니다.";
