import type { PropsWithChildren } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/shad-cn/components/ui/form";

export const serviceAgreeForm = z.object({
  isAdultAgreed: z.boolean(), // 만 14세 이상
  isTermsOfUseAgreed: z.boolean(), // 서비스 이용약관 동의
  isPrivacyPolicyAgreed: z.boolean(), // 개인정보 수집 및 이용 동의
  isThirdPartyDataSharingAgreed: z.boolean(), // 개인정보 제3자 제공 동의
});

function ServiceAgreeFormLayer({ children }: PropsWithChildren) {
  const form = useForm<z.infer<typeof serviceAgreeForm>>({
    resolver: zodResolver(serviceAgreeForm),
    values: {
      isAdultAgreed: false,
      isTermsOfUseAgreed: false,
      isPrivacyPolicyAgreed: false,
      isThirdPartyDataSharingAgreed: false,
    },
  });

  return <Form {...form}>{children}</Form>;
}

export default ServiceAgreeFormLayer;
