import NextHead from "next/head";

import DefaultMeta from "@/meta/DefaultMeta";

function Head() {
  const title = "Weplate 서비스 이용 약관 동의";

  return (
    <NextHead>
      <title>{title}</title>
      <DefaultMeta />
    </NextHead>
  );
}

export default Head;
