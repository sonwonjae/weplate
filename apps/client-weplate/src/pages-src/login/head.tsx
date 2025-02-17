import NextHead from "next/head";

import DefaultMeta from "@/meta/DefaultMeta";

function Head() {
  const title = "로그인";

  return (
    <NextHead>
      <title>{title}</title>
      <DefaultMeta />
    </NextHead>
  );
}

export default Head;
