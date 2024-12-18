import type { PropsWithChildren } from "react";

import { Header, Footer, Main } from "@/layouts";
import { cn } from "@/utils/tailwind";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header>
        <Header.Title>모임</Header.Title>
        <Header.Auth />
      </Header>
      <Main className={cn("flex", "flex-col")}>{children}</Main>
      <Footer>
        <Footer.HomePageLink />
        <Footer.CreateAssembleButton />
        <Footer.MyInfoPageLink />
      </Footer>
    </>
  );
}

export default Layout;
