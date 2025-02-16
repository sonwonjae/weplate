import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { Button } from "@/shad-cn/components/ui/button";
import { apiAxios, RQClient } from "@/utils/react-query";
import { sleep } from "@/utils/sleep";
import { cn } from "@/utils/tailwind";

import { useReRecommendFoodStore } from "../stores/re-recommend-food";

function ReRecommendFoodButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const reRecommendStatus = useReRecommendFoodStore((state) => {
    return state.reRecommendStatus;
  });
  const changeReRecommendStatus = useReRecommendFoodStore((state) => {
    return state.changeReRecommendStatus;
  });

  const recommendedFoodResultQuery = new RQClient({
    url: `/api/food/${router.query.assembleId}/recommend/result`,
  });

  const recommendCountdownQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/check/countdown`,
  });
  const { data: recommendCountdown = 0 } = useQuery(
    recommendCountdownQuery.queryOptions,
  );

  const newRegistedFoodMemberListQuery = new RQClient({
    url: `/api/assemble/${router.query.assembleId}/check/new-registed-food-member`,
  });

  const { mutateAsync: reRecommendFoodList } = useMutation({
    mutationFn: async () => {
      try {
        // NOTE: 1. 음식 문구 로딩 시작
        changeReRecommendStatus("loading-start");

        // NOTE: 2. 음식 추천 시작
        await apiAxios.post(
          `/api/food/${router.query.assembleId}/recommend/food`,
        );

        await Promise.all([
          (async () => {
            // NOTE: 3-1. 음식 추천 리스트 새로고침
            await queryClient.refetchQueries({
              queryKey: recommendedFoodResultQuery.queryKey,
            });
          })(),
          (async () => {
            // NOTE: 3-2. 최소 3000ms 후 음식 문구 로딩 종료
            await sleep(3000);
            changeReRecommendStatus("loading-end");
          })(),
        ]);

        // NOTE: 4. 1000ms 후 결과 제공
        await sleep(1000);
        changeReRecommendStatus("end");
        await queryClient.refetchQueries({
          queryKey: recommendCountdownQuery.queryKey,
        });
        await queryClient.refetchQueries({
          queryKey: newRegistedFoodMemberListQuery.queryKey,
        });

        const currentRecommendCountdown = Number(
          queryClient.getQueryData(recommendCountdownQuery.queryKey),
        );
        if (recommendCountdown <= 5) {
          if (currentRecommendCountdown > 0) {
            toast.info(
              `메뉴 추천이 ${queryClient.getQueryData(recommendCountdownQuery.queryKey)}회 남았습니다.`,
            );
          } else {
            toast.info(
              <p>
                매일 밤 자정, 새로운 메뉴 추천이 활성화됩니다!
                <br />
                하루 20번의 추천을 마음껏 즐겨보세요.
              </p>,
            );
          }
        }
      } catch (error) {
        throw error as AxiosError;
      }
    },
  });

  return (
    <Button
      size="lg"
      round
      outline
      disabled={
        recommendCountdown <= 0 ||
        reRecommendStatus === "loading-start" ||
        reRecommendStatus === "loading-end"
      }
      className={cn("w-full")}
      onClick={() => {
        if (recommendCountdown <= 0) {
          return;
        }
        reRecommendFoodList();
      }}
    >
      {recommendCountdown <= 0 && <span>내일 또 만나요!</span>}
      {recommendCountdown > 0 && (
        <>
          <span>다른 메뉴 추천 받기</span>{" "}
          {recommendCountdown <= 5 && `${recommendCountdown}/5`}
        </>
      )}
    </Button>
  );
}
export default ReRecommendFoodButton;
