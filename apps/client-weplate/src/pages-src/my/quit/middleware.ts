import { checkAuth } from "@/middlewares/pages/auth";
import { pipe } from "@/middlewares/utils/pipe";

const middleware = pipe(checkAuth());

export default middleware;
