import { z } from "zod";

const preListScheme = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    status: z.union([z.literal("pre-checked"), z.literal("pre-unchecked")]),
  }),
);
const listScheme = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);

export const foodSurveyForm = z.object({
  favorite: z.object({
    searchKeyword: z.string().max(50, "최대 50글자까지 입력할 수 있어요."),
    preList: preListScheme,
    list: listScheme,
  }),
  hate: z.object({
    searchKeyword: z.string().max(50, "최대 50글자까지 입력할 수 있어요."),
    preList: preListScheme,
    list: listScheme,
  }),
});
