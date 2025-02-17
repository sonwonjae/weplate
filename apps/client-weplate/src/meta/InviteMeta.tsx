interface InviteMetaProps {
  description: string;
}

function InviteMeta({ description }: InviteMetaProps) {
  return (
    <>
      <meta property="og:type" content="website" />
      <meta property="og:url" content={process.env.NEXT_PUBLIC_HOST} />
      <meta property="og:title" content="취향 존중 메뉴 추천 - 위플레이트" />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="위플레이트" />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:image" content="/meta-user-invite.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </>
  );
}

export default InviteMeta;
