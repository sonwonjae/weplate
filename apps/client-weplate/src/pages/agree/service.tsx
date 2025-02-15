import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import { createRouter } from "next-connect";
import { z } from "zod";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import {
  AgreeCheckbox,
  AllAgreeCheckbox,
} from "@/pages-src/agree/service/components";
import Head from "@/pages-src/agree/service/head";
import Layer, { serviceAgreeForm } from "@/pages-src/agree/service/layer";
import Layout from "@/pages-src/agree/service/layout";
import middleware from "@/pages-src/agree/service/middleware";
import { cn } from "@/utils/tailwind";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

const AGREE_LIST: Array<{
  fieldName: keyof z.infer<typeof serviceAgreeForm>;
  title: string;
  url?: string;
}> = [
  {
    fieldName: "isAdultAgreed",
    title: "만 14세 이상입니다. (필수)",
  },
  {
    fieldName: "isTermsOfUseAgreed",
    title: "서비스 이용약관 동의 (필수)",
    url: "https://achieved-arthropod-648.notion.site/17939793c46d80ae9015e981635f9b8d?pvs=4",
  },
  {
    fieldName: "isPrivacyPolicyAgreed",
    title: "개인정보 수집 및 이용 동의 (필수)",
    url: "https://achieved-arthropod-648.notion.site/17939793c46d80ae9015e981635f9b8d?pvs=4",
  },
  {
    fieldName: "isThirdPartyDataSharingAgreed",
    title: "개인정보 제3자 제공 동의 (선택)",
    url: "https://achieved-arthropod-648.notion.site/17939793c46d80ae9015e981635f9b8d?pvs=4",
  },
];

function AgreeServicePage() {
  return (
    <section
      className={cn(
        "w-full",
        "flex",
        "flex-col",
        "items-center",
        "gap-12",
        "h-full",
        "py-4",
        "px-5",
        "bg-background",
      )}
    >
      <h2
        className={cn(
          "text-2xl",
          "font-bold",
          "leading-snug",
          "text-left",
          "break-keep",
        )}
      >
        Weplate 서비스 이용약관에 동의해주세요.
      </h2>
      <div
        className={cn(
          "w-full",
          "flex",
          "flex-col",
          "justify-start",
          "items-start",
          "gap-4",
        )}
      >
        <AllAgreeCheckbox />
        <hr className={cn("w-full")} />
        {AGREE_LIST.map(({ fieldName, title, url }) => {
          return (
            <AgreeCheckbox
              key={fieldName}
              fieldName={fieldName}
              title={title}
              url={url}
            />
          );
        })}
      </div>
    </section>
  );
}

AgreeServicePage.Head = Head;
AgreeServicePage.Layout = Layout;
AgreeServicePage.Layer = Layer;

export default AgreeServicePage;
