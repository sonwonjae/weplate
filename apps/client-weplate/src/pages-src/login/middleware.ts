import { checkGuest } from "@/middlewares/pages/auth";
import { pipe } from "@/middlewares/utils/pipe";

const middleware = pipe(checkGuest({ required: false }));

export default middleware;
