import NextHead from "next/head";

function Head() {
  const title = "로그인";

  return (
    <NextHead>
      <title>{title}</title>
      <meta property="og:type" content="website" />
      <meta property="og:url" content={process.env.NEXT_PUBLIC_HOST} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content="Description Here" />
      <meta property="og:site_name" content="Weplate" />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:image" content="https://example.com/image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </NextHead>
  );
}

export default Head;
