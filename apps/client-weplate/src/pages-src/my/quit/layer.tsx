import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/shad-cn/components/ui/form";

export const myQuitForm = z.object({
  isVerified: z.boolean(),
  isAgree: z.boolean(),
  reason: z.string(),
  suggestion: z.string().max(500, "소중한 의견은 500자 이내로 입력해주세요."),
});

function Layer({ children }: PropsWithChildren) {
  const form = useForm<z.infer<typeof myQuitForm>>({
    resolver: zodResolver(myQuitForm),
    values: {
      isVerified: false,
      isAgree: false,
      reason: "",
      suggestion: "",
    },
  });

  const router = useRouter();
  useEffect(() => {
    form.reset();
  }, [router.pathname]);

  return <Form {...form}>{children}</Form>;
}

export default Layer;
