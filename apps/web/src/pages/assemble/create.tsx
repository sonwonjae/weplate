import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import { AssembleForm } from "@/pages-src/assemble/create/components";
import Layout from "@/pages-src/assemble/create/layout";
import middleware from "@/pages-src/assemble/create/middleware";
import { cn } from "@/utils/tailwind";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function AssembleCreatePage() {
  return (
    <section className={cn("py-4", "px-5")}>
      <AssembleForm />
    </section>
  );
}

AssembleCreatePage.Layout = Layout;

export default AssembleCreatePage;
