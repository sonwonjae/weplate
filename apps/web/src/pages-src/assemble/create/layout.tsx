import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useId, type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Header, Main, Footer } from "@/layouts";
import { Button } from "@/shad-cn/components/ui/button";
import { Form } from "@/shad-cn/components/ui/form";
import { apiAxios } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

export const assembleFormSchema = z.object({
  title: z
    .string()
    .nonempty({ message: "모임 이름을 입력해주세요." })
    .max(20, "모임 이름은 20자 이내로 입력해주세요."),
});

function Layout({ children }: PropsWithChildren) {
  const router = useRouter();
  const formId = useId();

  const form = useForm<z.infer<typeof assembleFormSchema>>({
    resolver: zodResolver(assembleFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const { mutateAsync: createAssemble, isPending } = useMutation({
    mutationFn: async ({ title }: { title: string }) => {
      // FIXME: 유틸화 하기
      const { data: createdAssemble } = await apiAxios.post<{
        id: string;
        title: string;
      }>("/api/assemble/item", {
        title,
      });

      router.replace(`/assemble/${createdAssemble.id}`);
      return createdAssemble;
    },
  });

  const onSubmit = async (values: z.infer<typeof assembleFormSchema>) => {
    if (isPending) {
      return;
    }
    await createAssemble(values);
  };

  return (
    <>
      <Form {...form}>
        <Header className={cn("w-full", "justify-center", "relative")}>
          <Header.Title>새 모임 만들기</Header.Title>
          <Link
            href="/"
            replace
            className={cn(
              "absolute",
              "top-0",
              "right-5",
              "h-full",
              "flex",
              "items-center",
            )}
          >
            <XIcon size={20} />
          </Link>
        </Header>
        <Main>
          <form
            id={formId}
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-8")}
          >
            {children}
          </form>
        </Main>
        <Footer className={cn("px-5")}>
          <Button
            form={formId}
            type="submit"
            size="lg"
            round
            loading={isPending}
            disabled={isPending}
            className={cn("w-full")}
          >
            모임 생성
          </Button>
        </Footer>
      </Form>
    </>
  );
}

export default Layout;
