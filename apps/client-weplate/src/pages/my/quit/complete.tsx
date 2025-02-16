import type { CustomIncomingMessage } from "@/middlewares/type";
import type { ServerResponse } from "http";

import Image from "next/image";
import { createRouter } from "next-connect";

import { makeGetServerSideProps } from "@/middlewares/common/makeGetServerSideProps";
import Layout from "@/pages-src/my/quit/complete/layout";
import middleware from "@/pages-src/my/quit/complete/middleware";
import { cn } from "@/utils/tailwind";

const router = createRouter<CustomIncomingMessage, ServerResponse>();
router.get(middleware);

export const getServerSideProps = makeGetServerSideProps(router);

function QuitComplete() {
  return (
    <>
      <section
        className={cn(
          "w-full",
          "bg-background",
          "flex",
          "flex-col",
          "items-center",
          "justify-center",
          "gap-5",
          "h-full",
          "py-2",
          "px-5",
          "bg-background",
        )}
      >
        <Image width={110} height={128} src="/plate_chief_smile.svg" alt="chief" />
        <div
          className={cn(
            "flex",
            "flex-col",
            "justify-center",
            "items-center",
            "text-gray-600",
            "text-center",
            "break-keep",
          )}
        >
          <b>회원탈퇴가 완료되었습니다.</b>
          <p>
            지금까지 저희 서비스를 이용해 주셔서
            <br />
            진심으로 감사드립니다.
            <br />
            언제든 다시 찾아주시면 따뜻하게 환영하겠습니다. 😊
          </p>
        </div>
      </section>
    </>
  );
}

QuitComplete.Layout = Layout;

export default QuitComplete;
