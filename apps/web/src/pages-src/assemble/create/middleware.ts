import { checkWithInCreationLimit } from "@/middlewares/pages/assemble";
import { checkAuth } from "@/middlewares/pages/auth";
import { pipe } from "@/middlewares/utils/pipe";

const middleware = pipe(checkAuth(), checkWithInCreationLimit());

export default middleware;
