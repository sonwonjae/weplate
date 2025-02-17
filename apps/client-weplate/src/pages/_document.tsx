import { Html, Head, Main, NextScript } from "next/document";

import { cn } from "@/utils/tailwind";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={cn("bg-white")}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
