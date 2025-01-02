import { dehydrate } from "@tanstack/react-query";

import { RQServer } from "@/utils/react-query";

import { CustomIncomingMessage, Middleware } from "../type";
import { pipe } from "../utils/pipe";

import { checkAuth } from "./auth";

const checkAssembleParams = (): Middleware<CustomIncomingMessage> => {
  return (req) => {
    const assembleId = req.params?.assembleId as string;

    if (typeof assembleId !== "string") {
      return {
        redirect: {
          destination: "/",
          permanent: true,
        },
      };
    }

    return {
      props: { dehydratedState: dehydrate(req.queryClient) },
    };
  };
};

export const checkWithInCreationLimit =
  (): Middleware<CustomIncomingMessage> => {
    return pipe(checkAuth(), async (req, res) => {
      const isWithinCreationLimitQuery = new RQServer({
        url: "/api/assemble/check/within-creation-limit",
        res,
      });
      await req.queryClient.fetchQuery(isWithinCreationLimitQuery.queryOptions);

      return {
        props: { dehydratedState: dehydrate(req.queryClient) },
      };
    });
  };

interface CheckAssembleMember {
  required: boolean;
}

export const checkAssembleMember = (
  { required = true }: CheckAssembleMember = { required: true },
): Middleware<CustomIncomingMessage> => {
  return pipe(checkAssembleParams(), async (req, res) => {
    const assembleId = req.params?.assembleId as string;

    if (!required) {
      return {
        props: { dehydratedState: dehydrate(req.queryClient) },
      };
    }

    const assembleQuery = new RQServer({
      url: `/api/assemble/${assembleId}/item`,
      res,
    });
    const assemble = await req.queryClient.fetchQuery(
      assembleQuery.queryOptions,
    );
    const isOwner = assemble.ownerInfo.id === req.userInfo.id;
    const isMember = !!assemble.memberList.find(({ id: memberId }) => {
      return req?.userInfo && memberId === req.userInfo.id;
    });

    if (isOwner || isMember) {
      return {
        props: { dehydratedState: dehydrate(req.queryClient) },
      };
    }

    return {
      redirect: {
        destination: `/assemble/${assembleId}/invitee-room`,
        permanent: true,
      },
    };
  });
};

export const checkAssembleOwner = (): Middleware<
  CustomIncomingMessage & {
    userInfo: NonNullable<CustomIncomingMessage["userInfo"]>;
  }
> => {
  return pipe(
    checkAuth(),
    checkAssembleParams(),
    checkAssembleMember(),
    async (req, res) => {
      const assembleId = req.params?.assembleId as string;

      const assembleQuery = new RQServer({
        url: `/api/assemble/${assembleId}/item`,
        res,
      });
      const assemble = await req.queryClient.fetchQuery(
        assembleQuery.queryOptions,
      );
      const isOwner = assemble.ownerInfo.id === req.userInfo.id;

      if (!isOwner) {
        return {
          redirect: {
            destination: `/assemble/${assembleId}`,
            permanent: true,
          },
        };
      }

      return {
        props: { dehydratedState: dehydrate(req.queryClient) },
      };
    },
  );
};

export const checkAssembleGuest = (): Middleware<CustomIncomingMessage> => {
  return pipe(checkAssembleParams(), async (req, res) => {
    const assembleId = req.params?.assembleId as string;

    const assembleQuery = new RQServer({
      url: `/api/assemble/${assembleId}/item`,
      res,
    });
    const assemble = await req.queryClient.fetchQuery(
      assembleQuery.queryOptions,
    );

    const isOwner = req?.userInfo && assemble.ownerInfo.id === req.userInfo.id;
    const isMember = !!assemble.memberList.find(({ id: memberId }) => {
      return req?.userInfo && memberId === req.userInfo.id;
    });

    /** NOTE: 이미 참여한 사람이면 방으로 이동 */
    if (isOwner || isMember) {
      return {
        redirect: {
          destination: `/assemble/${assembleId}`,
          permanent: true,
        },
      };
    }

    return {
      props: { dehydratedState: dehydrate(req.queryClient) },
    };
  });
};

interface CheckFoodSurveyStatus {
  permission: "not-yet" | "complete";
}

export const checkFoodSurveyStatus = ({
  permission,
}: CheckFoodSurveyStatus): Middleware<CustomIncomingMessage> => {
  return pipe(checkAssembleParams(), async (req, res) => {
    const assembleId = req.params?.assembleId as string;

    try {
      const foodSurveyCompleteQuery = new RQServer({
        url: `/api/food/${assembleId}/check/survey/complete`,
        res,
      });
      await req.queryClient.fetchQuery(foodSurveyCompleteQuery.queryOptions);

      switch (permission) {
        case "not-yet":
          return {
            redirect: {
              destination: `/assemble/${assembleId}/waiting-room`,
              permanent: true,
            },
          };
        case "complete":
          return {
            props: { dehydratedState: dehydrate(req.queryClient) },
          };
      }
    } catch {
      switch (permission) {
        case "not-yet":
          return {
            props: { dehydratedState: dehydrate(req.queryClient) },
          };
        case "complete":
          return {
            redirect: {
              destination: `/assemble/${assembleId}/regist-food`,
              permanent: true,
            },
          };
      }
    }
  });
};

interface CheckRecommendedFoodListStatus {
  permission: "not-yet" | "complete";
}

export const checkRecommendedFoodListStatus = ({
  permission,
}: CheckRecommendedFoodListStatus): Middleware<CustomIncomingMessage> => {
  return pipe(checkAssembleParams(), async (req, res) => {
    const assembleId = req.params?.assembleId as string;

    try {
      const recommendedFoodListQuery = new RQServer({
        url: `/api/food/${assembleId}/recommend/result`,
        res,
      });
      const hasRecommendedFoodList = !!(
        await req.queryClient.fetchQuery(recommendedFoodListQuery.queryOptions)
      )?.filter(Boolean)?.length;

      if (!hasRecommendedFoodList) {
        throw new Error("has not yet recommended food list");
      }

      switch (permission) {
        case "not-yet":
          return {
            redirect: {
              destination: `/assemble/${assembleId}/result-room`,
              permanent: true,
            },
          };
        case "complete":
          return {
            props: { dehydratedState: dehydrate(req.queryClient) },
          };
      }
    } catch {
      switch (permission) {
        case "not-yet":
          return {
            props: { dehydratedState: dehydrate(req.queryClient) },
          };
        case "complete":
          return {
            redirect: {
              destination: `/assemble/${assembleId}/waiting-room`,
              permanent: true,
            },
          };
      }
    }
  });
};
