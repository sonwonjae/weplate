import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { createRouter } from "next-connect";

import {
  DescriptionSection,
  StepSection,
  SearchSection,
  FoodListSection,
  CheckedFoodBadgeListSection,
} from "@/features/food-survey-form/components";
import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import Layer from "@/pages-src/assemble/[assembleId]/update-food-survey/layer";
import Layout from "@/pages-src/assemble/[assembleId]/update-food-survey/layout";
import middleware from "@/pages-src/assemble/[assembleId]/update-food-survey/middleware";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function AssembleUpdateFoodSurveyPage() {
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

AssembleUpdateFoodSurveyPage.Layer = Layer;
AssembleUpdateFoodSurveyPage.Layout = Layout;

export default AssembleUpdateFoodSurveyPage;
