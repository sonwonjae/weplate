import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cva } from "class-variance-authority";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authAxios, RQClient } from "@/utils/react-query";
import { cn } from "@/utils/tailwind";

import { useUpdatableUserInfoStore } from "../../stores/updatable-user-info";

import { userInfoForm } from "./UpdateUserInfoForm";

const formButtonVariants = cva(
  cn("absolute", "top-0", "right-0", "mt-0", "text-sm", "font-bold", "py-0.5"),
);

function UserInfoFormSubmitButton() {
  const queryClient = useQueryClient();
  const authQuery = new RQClient({ url: "/api/user/auth/check" });
  const { data: { nickname: originNickname = "" } = {} } = useQuery(
    authQuery.queryOptions,
  );

  const form = useFormContext<z.infer<typeof userInfoForm>>();
  const { nickname: updatedNickname = "" } =
    useWatch<z.infer<typeof userInfoForm>>();

  const isUpdatable = useUpdatableUserInfoStore((state) => {
    return state.isUpdatable;
  });
  const toggleIsUpdatable = useUpdatableUserInfoStore((state) => {
    return state.toggleIsUpdatable;
  });

  const { mutateAsync: updateUserInfo } = useMutation({
    mutationFn: async () => {
      const nickname = form.getValues("nickname");

      await authAxios.patch("/api/user/auth", {
        nickname: nickname.trim(),
      });

      await queryClient.refetchQueries({
        queryKey: authQuery.queryKey,
      });

      toggleIsUpdatable();
      toast.info("닉네임을 변경했어요! 😋", { position: "bottom-left" });
    },
  });

  if (!isUpdatable) {
    return (
      <button
        type="button"
        className={cn(formButtonVariants())}
        onClick={toggleIsUpdatable}
      >
        변경
      </button>
    );
  }

  if (originNickname === updatedNickname) {
    return (
      <button
        type="button"
        className={cn(formButtonVariants())}
        onClick={toggleIsUpdatable}
      >
        취소
      </button>
    );
  }

  return (
    <button
      type="submit"
      className={cn(formButtonVariants())}
      onClick={form.handleSubmit(() => {
        updateUserInfo();
      })}
    >
      저장
    </button>
  );
}

export default UserInfoFormSubmitButton;
