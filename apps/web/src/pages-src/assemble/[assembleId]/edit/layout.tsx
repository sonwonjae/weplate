import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useId, type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Header, Main, Footer } from "@/layouts";
import { Button } from "@/shad-cn/components/ui/button";
import { Form } from "@/shad-cn/components/ui/form";
import { apiAxios, RQClient } from "@/utils/react-query";
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

  const assembleQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/item`,
  });

  const { data: assemble } = useQuery(assembleQuery.queryOptions);

  const form = useForm<z.infer<typeof assembleFormSchema>>({
    resolver: zodResolver(assembleFormSchema),
    defaultValues: {
      title: assemble?.title,
    },
  });

  const { mutateAsync: updateAssemble, isPending } = useMutation({
    mutationFn: async ({ title }: { title: string }) => {
      // FIXME: 유틸화 하기
      const { data: updatedAssemble } = await apiAxios.patch<{
        id: string;
        title: string;
      }>(`/api/assemble/${router.query.assembleId}/item`, {
        title,
      });

      if (
        router.query.redirectUrl &&
        typeof router.query.redirectUrl === "string" &&
        /^\//.test(router.query.redirectUrl)
      ) {
        router.replace(router.query.redirectUrl);
      } else {
        router.replace(`/`);
      }
      return updatedAssemble;
    },
  });

  const onSubmit = async (values: z.infer<typeof assembleFormSchema>) => {
    if (isPending) {
      return;
    }
    await updateAssemble(values);
  };

  return (
    <>
      <Form {...form}>
        <Header className={cn("w-full", "justify-center", "relative")}>
          <Header.Title>모임 수정하기</Header.Title>
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
            모임 수정
          </Button>
        </Footer>
      </Form>
    </>
  );
}

export default Layout;
