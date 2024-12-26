import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import {
  DescriptionSection,
  StepSection,
  SearchSection,
  FoodListSection,
  CheckedFoodBadgeListSection,
} from "@/pages-src/assemble/[assembleId]/regist-food/components";
import Layout from "@/pages-src/assemble/[assembleId]/regist-food/layout";
import middleware from "@/pages-src/assemble/[assembleId]/regist-food/middleware";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function AssembleRegistFoodPage() {
  return (
    <>
      <StepSection />
      <DescriptionSection />
      <SearchSection />
      <CheckedFoodBadgeListSection />
      <FoodListSection />
    </>
  );
}

AssembleRegistFoodPage.Layout = Layout;

export default AssembleRegistFoodPage;
