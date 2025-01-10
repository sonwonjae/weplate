import {
  checkAssembleMember,
  checkFoodSurveyStatus,
} from "@/middlewares/pages/assemble";
import { checkAuth } from "@/middlewares/pages/auth";
import { pipe } from "@/middlewares/utils/pipe";

const middleware = pipe(
  checkAuth(),
  checkAssembleMember(),
  checkFoodSurveyStatus({ permission: "none" }),
);

export default middleware;
