import {
  checkAssembleMember,
  checkFoodSurveyStatus,
  checkRecommendedFoodListStatus,
} from "@/middlewares/pages/assemble";
import { checkAuth } from "@/middlewares/pages/auth";
import { pipe } from "@/middlewares/utils/pipe";

const middleware = pipe(
  checkAuth(),
  checkAssembleMember(),
  checkFoodSurveyStatus({ permission: "not-yet" }),
  checkFoodSurveyStatus({ permission: "complete" }),
  checkRecommendedFoodListStatus({ permission: "not-yet" }),
  checkRecommendedFoodListStatus({ permission: "complete" }),
);

export default middleware;
