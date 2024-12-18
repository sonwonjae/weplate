import type { PropsWithChildren } from "react";

import { Header, Main, Footer } from "@/layouts";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header>
        <Header.Title>마이 페이지</Header.Title>
        <Header.Auth />
      </Header>
      <Main>{children}</Main>
      <Footer>
        <Footer.HomePageLink />
        <Footer.CreateAssembleButton />
        <Footer.MyInfoPageLink />
      </Footer>
    </>
  );
}

export default Layout;
