import type { PropsWithChildren } from "react";

import { useRouter } from "next/router";

function Layout({ children }: PropsWithChildren) {
  const router = useRouter();

  return <>초대 페이지</>;
}

export default Layout;
