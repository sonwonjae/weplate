import { checkWithInCreationLimit } from "@/middlewares/pages/assemble";
import { pipe } from "@/middlewares/utils/pipe";

const middleware = pipe(checkWithInCreationLimit());

export default middleware;
