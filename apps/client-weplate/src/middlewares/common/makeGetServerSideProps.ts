import { parse } from "url";

import Cookies from "js-cookie";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import qs from "query-string";

export const makeGetServerSideProps = <PageProps extends object, Router>(
  router: Router,
) => {
  const getServerSideProps: GetServerSideProps = async ({
    req,
    res,
    params,
    resolvedUrl,
  }) => {
    // @ts-expect-error: attach pathname to req.pathname
    req.pathname = parse(resolvedUrl).pathname;

    /** FIXME: type으로 제어할 수 있게 수정가능하다면 수정 시도하기 */
    // @ts-expect-error: attach params to req.params
    req.params = params ?? {};

    /** FIXME: type으로 제어할 수 있게 수정가능하다면 수정 시도하기 */
    // @ts-expect-error: attach query to req.query
    req.query = qs.parse(parse(req.url).query);

    function overloadCookieGet(): { [key: string]: string };
    function overloadCookieGet(name: string): string;
    function overloadCookieGet(name?: string) {
      const cookies = (req.headers.cookie ?? "")
        .split(";")
        .map((cookie) => {
          return cookie.split("=");
        })
        .reduce(
          (acc, [key, value]) => {
            acc[key.trim()] = decodeURIComponent(value);
            return acc;
          },
          {} as { [key: string]: string },
        );

      if (name) {
        return cookies[name];
      }
      return cookies;
    }
    Cookies.get = overloadCookieGet;
    Cookies.withConverter({
      read: () => {
        return "success";
      },
    });

    /** FIXME: type으로 제어할 수 있게 수정가능하다면 수정 시도하기 */
    // @ts-expect-error: attach custom req
    return router.run(req, res) as Promise<GetServerSidePropsResult<PageProps>>;
  };

  return getServerSideProps;
};
