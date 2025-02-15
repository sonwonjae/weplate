import { ZodType } from "zod";

import { BAD_WORD_LIST } from "./bad-word-list.constants";

export const checkBadWord: Parameters<ZodType<string>["refine"]>[0] = (
  value,
) => {
  return !BAD_WORD_LIST.some((badWord) => {
    return value.includes(badWord);
  });
};

export const createCheckBadWordErrorMessage: Parameters<
  ZodType<string>["refine"]
>[1] = (output) => {
  return {
    message: `"${output}"는 사용할 수 없습니다.`,
  };
};
