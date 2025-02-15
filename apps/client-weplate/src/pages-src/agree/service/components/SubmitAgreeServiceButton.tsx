import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/shad-cn/components/ui/button";
import { apiAxios } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import { serviceAgreeForm } from "../layer";

function SubmitAgreeServiceButton() {
  const router = useRouter();
  const form = useFormContext<z.infer<typeof serviceAgreeForm>>();
  const { isAdultAgreed, isTermsOfUseAgreed, isPrivacyPolicyAgreed } =
    useWatch<z.infer<typeof serviceAgreeForm>>();

  const { mutateAsync: submit } = useMutation({
    mutationFn: async () => {
      if (!isSubmitable) {
        return;
      }
      try {
        await apiAxios.post("/api/agree/service/policy", form.getValues());
        if (typeof router.query.redirectUrl === "string") {
          router.replace(router.query.redirectUrl);
        } else {
          router.replace("/");
        }
      } catch {
        toast.error("제출에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });

  const isSubmitable =
    isAdultAgreed && isTermsOfUseAgreed && isPrivacyPolicyAgreed;

  return (
    <Button
      type="submit"
      disabled={!isSubmitable}
      onClick={() => {
        submit();
      }}
      size="lg"
      round
      className={cn("w-full")}
    >
      동의하고 시작하기
    </Button>
  );
}

export default SubmitAgreeServiceButton;
