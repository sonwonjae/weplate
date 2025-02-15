import type { PropsWithChildren } from "react";

import { Header, Main } from "@/layouts";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header>
        <div />
        <Header.Title>회원 탈퇴 완료</Header.Title>
        <div />
      </Header>
      <Main>{children}</Main>
    </>
  );
}

export default Layout;
