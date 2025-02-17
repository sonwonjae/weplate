function DefaultMeta() {
  return (
    <>
      <meta property="og:type" content="website" />
      <meta property="og:url" content={process.env.NEXT_PUBLIC_HOST} />
      <meta property="og:title" content="취향 존중 메뉴 추천 - 위플레이트" />
      <meta
        property="og:description"
        content="혼자도 함께도 즐거운 취향 맞춤 음식 메뉴를 추천해드립니다."
      />
      <meta property="og:site_name" content="위플레이트" />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:image" content="/meta-main.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </>
  );
}

export default DefaultMeta;
