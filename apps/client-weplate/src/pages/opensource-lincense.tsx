import Head from "next/head";

import {
  APACHE_LICENSE,
  ISC_LICENSE,
  MIT_LICENSE,
  OPENSOURCE_LICENSE_LIST,
} from "@/pages-src/opensource-lincense/consts";
import { cn } from "@/utils/tailwind";

function OpensourceLicense() {
  return (
    <>
      <Head>
        <title>오픈소스 라이선스</title>
      </Head>
      <section className={cn("overflow-y-auto", "my-4", "px-6", "space-y-3")}>
        <h1 className={cn("font-bold", "text-xl")}>License</h1>
        <section className={cn("space-y-3")}>
          {OPENSOURCE_LICENSE_LIST.map(({ name, link, copyright, license }) => {
            return (
              <div key={name}>
                <h3 className={cn("font-semibold")}>{name}</h3>
                <ul className={cn("list-disc", "list-inside", "text-sm")}>
                  <li>
                    <a
                      href={link}
                      className={cn(
                        "text-blue-400",
                        "underline",
                        "visited:text-violet-400",
                      )}
                    >
                      {link}
                    </a>
                  </li>
                  {copyright && <li>Copyright (c) {copyright}</li>}
                  {license === "MIT" && <li>The MIT License</li>}
                  {license === "Apache 2.0" && <li>Apache License 2.0</li>}
                  {license === "ISC" && <li>ISC License</li>}
                </ul>
              </div>
            );
          })}
        </section>
        <hr />
        <section className={cn("space-y-3", "text-sm")}>
          <pre>{ISC_LICENSE}</pre>
          <hr />
          <pre>{APACHE_LICENSE}</pre>
          <hr />
          <pre>{MIT_LICENSE}</pre>
        </section>
      </section>
    </>
  );
}

export default OpensourceLicense;
