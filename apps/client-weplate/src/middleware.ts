import type { NextFetchEvent, NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";

const router = createEdgeRouter<NextRequest, NextFetchEvent>();

router.get("/ping", () => {
  return new NextResponse("pong", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
});

router.use(async (request, event, next) => {
  return next();
});

router.all(() => {
  // default if none of the above matches
  return NextResponse.next();
});

export function middleware(request: NextRequest, event: NextFetchEvent) {
  return router.run(request, event);
}

export const config = {};
