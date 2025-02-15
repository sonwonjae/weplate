import { toast } from "sonner";

export const shareLink = async ({
  url,
  position = "bottom-left",
}: {
  url: string;
  position?: NonNullable<Parameters<typeof toast.info>["1"]>["position"];
}) => {
  if (navigator.canShare({ url })) {
    await navigator.share({ url });
  } else {
    try {
      await navigator.clipboard.writeText(url);
      toast.info("클립보드에 복사되었어요.", { position });
    } catch {
      toast.error("복사 실패", { position });
    }
  }
};
