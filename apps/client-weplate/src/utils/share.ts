import { toast } from "sonner";

export const shareLink = async ({
  url,
  position = "bottom-left",
}: {
  url: string;
  position?: NonNullable<Parameters<typeof toast.info>["1"]>["position"];
}) => {
  try {
    if (navigator.canShare()) {
      try {
        await navigator.share({
          url,
        });
        return toast.info("공유 성공");
      } catch {
        return toast.error("공유 실패");
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.info("클립보드에 복사되었어요.", {
        position,
      });
    }
  } catch {
    return toast.error("공유 실패");
  }
};
