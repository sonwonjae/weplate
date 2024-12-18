import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { type PropsWithChildren } from "react";

import { Header, Main, Footer } from "@/layouts";
import { RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

function Layout({ children }: PropsWithChildren) {
  const router = useRouter();
  const assembleQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/item`,
  });

  const { data: assemble } = useQuery(assembleQuery.queryOptions);

  return (
    <>
      <Header className={cn("w-full", "justify-center", "relative")}>
        <Header.Title>{assemble?.title}</Header.Title>
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
