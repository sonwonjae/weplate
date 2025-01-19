import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import { FoodTable } from "@/pages-src/admin/manage/food/list/components";
import Layout from "@/pages-src/admin/manage/food/list/layout";
import middleware from "@/pages-src/admin/manage/food/list/middleware";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function AdminManageFoodList() {
  return (
    <>
      <FoodTable></FoodTable>
    </>
  );
}

AdminManageFoodList.Layout = Layout;

export default AdminManageFoodList;
