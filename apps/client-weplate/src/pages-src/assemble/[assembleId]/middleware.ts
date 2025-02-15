import {
  checkAssembleMember,
  checkFoodSurveyStatus,
} from "@/middlewares/pages/assemble";
import { checkAuth } from "@/middlewares/pages/auth";
import { pipe } from "@/middlewares/utils/pipe";

const middleware = pipe(
  (req) => {
    console.log("come here?", req.url);
    return { props: {} };
  },
  checkAuth(),
  checkAssembleMember(),
  checkFoodSurveyStatus({ permission: "none" }),
);

export default middleware;
