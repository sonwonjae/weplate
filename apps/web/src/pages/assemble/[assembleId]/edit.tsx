import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import { AssembleForm } from "@/pages-src/assemble/[assembleId]/edit/components";
import Layout from "@/pages-src/assemble/[assembleId]/edit/layout";
import middleware from "@/pages-src/assemble/[assembleId]/edit/middleware";
import { cn } from "@/utils/tailwind";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function AssembleUpdatePage() {
  return (
    <section className={cn("py-4", "px-5")}>
      <AssembleForm />
    </section>
  );
}

AssembleUpdatePage.Layout = Layout;

export default AssembleUpdatePage;
