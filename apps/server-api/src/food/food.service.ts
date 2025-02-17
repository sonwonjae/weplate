import { HttpException, Injectable } from '@nestjs/common';
import { Tables } from '@package/types';
import { AssembleService } from 'src/assemble/assemble.service';
import { SupabaseService } from 'src/supabase/supabase.service';

import { CheckFoodSurveyDto } from './dto/check-food-survey.dto';
import { CreateFoodSurveyDto } from './dto/create-food-survey.dto';
import { DeleteFoodSurveyDto } from './dto/delete-food-survey.dto';
import { GetFoodSurveyDto } from './dto/get-food-survey.dto';
import { ManageFoodListDto } from './dto/manage-food-list.dto';
import { RecommendFoodListDto } from './dto/recommend-food-list.dto';
import { SearchFoodListDto } from './dto/search-food-list.dto';
import { UpdateFoodSurveyDto } from './dto/update-food-survey.dto';

@Injectable()
export class FoodService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly assembleService: AssembleService,
  ) {}

  async searchFoodList({ search }: SearchFoodListDto) {
    let query = this.supabaseService.client.from('foods').select('*');
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: foodList } = await query;

    return foodList ?? [];
  }

  async getFoodListWithCuisine({ search }: ManageFoodListDto) {
    let query = this.supabaseService.client.from('foods').select(`
        *,
        food__cuisine!inner(
          *,
          cuisine!inner(*)
        )
      `);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: foodListWithCuisine } = await query;

    return (
      foodListWithCuisine?.map(({ food__cuisine, ...food }) => {
        return {
          ...food,
          cuisine: food__cuisine.reduce((acc, { cuisine }) => {
            if (
              acc.find(({ id }) => {
                return id === cuisine?.id;
              })
            ) {
              return acc;
            }

            return [...acc, cuisine];
          }, []),
        };
      }) ?? []
    );
  }

  async getFoodListSurvey(
    userInfo: Tables<'users'>,
    { assembleId }: GetFoodSurveyDto,
  ) {
    const { data: userAssembleFoodList } = await this.supabaseService.client
      .from('user__assemble__foods')
      .select(
        `
          *,
          foods!inner(*)
        `,
      )
      .eq('assembleId', assembleId)
      .eq('userId', userInfo.id);

    const favoriteFoodList =
      userAssembleFoodList
        ?.filter(({ surveyType }) => {
          return surveyType === 'favorite';
        })
        .map(({ foodId, foods: { name } }) => {
          return {
            id: foodId,
            name,
          };
        }) ?? [];
    const hateFoodList =
      userAssembleFoodList
        ?.filter(({ surveyType }) => {
          return surveyType === 'hate';
        })
        .map(({ foodId, foods: { name } }) => {
          return {
            id: foodId,
            name,
          };
        }) ?? [];

    return {
      favorite: favoriteFoodList,
      hate: hateFoodList,
    };
  }

  async registFoodListSurvey(
    userInfo: Tables<'users'>,
    { assembleId, favoriteFoodList, hateFoodList }: CreateFoodSurveyDto,
  ) {
    const { data: userAssemble } = await this.supabaseService.client
      .from('user__assembles')
      .select('*')
      .eq('assembleId', assembleId)
      .eq('userId', userInfo.id)
      .single();

    if (!userAssemble) {
      throw new HttpException('not exist user assemble', 400);
    }

    const mappedFavoriteFoodList = favoriteFoodList.map<
      Omit<Tables<'user__assemble__foods'>, 'id'>
    >(({ foodId }) => {
      return {
        userAssembleId: userAssemble.id,
        userId: userInfo.id,
        assembleId,
        surveyType: 'favorite',
        foodId,
      };
    });
    const mappedHateeFoodList = hateFoodList.map<
      Omit<Tables<'user__assemble__foods'>, 'id'>
    >(({ foodId }) => {
      return {
        userAssembleId: userAssemble.id,
        userId: userInfo.id,
        assembleId,
        surveyType: 'hate',
        foodId,
      };
    });

    try {
      await this.supabaseService.client
        .from('user__assemble__foods')
        .insert([...mappedFavoriteFoodList, ...mappedHateeFoodList]);
      return true;
    } catch (error) {
      throw error as HttpException;
    }
  }

  async deleteFoodListSurvey(
    userInfo: Tables<'users'>,
    { assembleId }: DeleteFoodSurveyDto,
  ) {
    await this.supabaseService.client
      .from('user__assemble__foods')
      .delete()
      .eq('assembleId', assembleId)
      .eq('userId', userInfo.id);
  }

  async updateFoodListSurvey(
    userInfo: Tables<'users'>,
    { assembleId, favoriteFoodList, hateFoodList }: UpdateFoodSurveyDto,
  ) {
    await this.deleteFoodListSurvey(userInfo, { assembleId });
    await this.registFoodListSurvey(userInfo, {
      assembleId,
      favoriteFoodList,
      hateFoodList,
    });
  }

  async checkAlreadyRegistUser(
    userInfo: Tables<'users'>,
    { assembleId }: CheckFoodSurveyDto,
  ) {
    const { data: userAssemble } = await this.supabaseService.client
      .from('user__assembles')
      .select('*')
      .eq('assembleId', assembleId)
      .eq('userId', userInfo.id)
      .single();

    if (!userAssemble) {
      throw new HttpException('not exist user assemble', 400);
    }

    const { data: userAssembleFood } = await this.supabaseService.client
      .from('user__assemble__foods')
      .select('*')
      .eq('userAssembleId', userAssemble.id);

    if (userAssembleFood?.length) {
      return true;
    } else {
      return false;
    }
  }

  async getFoodWithCuisine({
    ninFoodIdList = [],
    ninCuisineIdList = [],
    cuisineCount = 1,
  }: {
    ninFoodIdList?: Array<string>;
    ninCuisineIdList?: Array<string>;
    cuisineCount?: number;
  } = {}) {
    let query = this.supabaseService.client.from('foods').select(
      `
        *,
        food__cuisine!inner(
          *,
          cuisine!inner(*)
        )
      `,
    );

    if (ninFoodIdList.length) {
      query = query.not(
        'id',
        'in',
        `(${ninFoodIdList
          .map((foodId) => {
            return `"${foodId}"`;
          })
          .join(',')})`,
      );
    }

    if (ninCuisineIdList.length) {
      query = query.not(
        'food__cuisine.cuisine.id',
        'in',
        `(${ninCuisineIdList
          .map((cuisineId) => {
            return `"${cuisineId}"`;
          })
          .join(',')})`,
      );
    }

    let { data: foodList } = await query;

    if (!foodList || !foodList.length) {
      throw new HttpException('has not foodlist', 400);
    }

    if (cuisineCount <= 1) {
      foodList = foodList.filter(({ food__cuisine }) => {
        return food__cuisine.length === 1;
      });
    } else {
      foodList = foodList.filter(({ food__cuisine }) => {
        return food__cuisine.length >= cuisineCount;
      });
    }

    return foodList.map(({ id, name, food__cuisine }) => {
      const cuisineList = food__cuisine.map(({ cuisine }) => {
        return cuisine!;
      });

      return {
        foodId: id,
        foodName: name,
        score: 100,
        // FIXME: 이거 가끔 null 나오는데 이유 알아내기(같은 메뉴일때도 나오는 경우 있음)
        cuisineList,
      };
    });
  }

  async recommendFoodList({ assembleId }: RecommendFoodListDto) {
    const remainChanceCount =
      await this.assembleService.countdownRecommendChance(assembleId);
    if (remainChanceCount <= 0) {
      throw new HttpException('is already use all chance', 400);
    }
    const { data: userAssembleFoodList } = await this.supabaseService.client
      .from('user__assemble__foods')
      .select(
        `
          *,
          users!inner(*),
          foods!inner(
            *,
            food__cuisine!inner(
              *,
              cuisine!inner(*)
            )
          )
        `,
      )
      .eq('assembleId', assembleId);

    if (!userAssembleFoodList) {
      throw new HttpException('has not user assemble food', 400);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: alreadyRecommendedList } = await this.supabaseService.client
      .from('recommends')
      .select(
        `
            *,
            recommend__foods!inner(
              *,
              foods!inner(*)
            )
          `,
      )
      .eq('assembleId', assembleId);

    const alreadyRecommendedAssembleFoodList =
      alreadyRecommendedList?.flatMap(({ recommend__foods }) => {
        return recommend__foods;
      }) ?? [];

    const scoredAlreadyRecommendedAssembleFoodList =
      alreadyRecommendedAssembleFoodList?.reduce(
        (preScoredFoodList, alreadyRecommendedAssembleFood) => {
          const hasPreScoredFood = !!preScoredFoodList.find((preScoredFood) => {
            return (
              preScoredFood.foodId === alreadyRecommendedAssembleFood.foodId
            );
          });

          if (!hasPreScoredFood) {
            return [
              ...preScoredFoodList,
              {
                foodId: alreadyRecommendedAssembleFood.foodId,
                foodName: alreadyRecommendedAssembleFood.foods?.name ?? '',
                score: -5,
              },
            ];
          }

          return preScoredFoodList.map((preScoredFood) => {
            if (
              preScoredFood.foodId === alreadyRecommendedAssembleFood.foodId
            ) {
              return {
                foodId: alreadyRecommendedAssembleFood.foodId,
                foodName: alreadyRecommendedAssembleFood.foods?.name ?? '',
                score: preScoredFood.score - 5,
              };
            }

            return preScoredFood;
          });
        },
        [] as Array<{ foodId: string; foodName: string; score: number }>,
      ) ?? [];

    const hateFoodList = userAssembleFoodList
      .filter(({ surveyType }) => {
        return surveyType === 'hate';
      })
      .reduce(
        (preScoredFoodList, userAssembleFood) => {
          const hasPreScoredFood = !!preScoredFoodList.find((preScoredFood) => {
            return preScoredFood.foodId === userAssembleFood.foodId;
          });

          if (!hasPreScoredFood) {
            return [
              ...preScoredFoodList,
              {
                foodId: userAssembleFood.foodId,
                foodName: userAssembleFood.foods?.name ?? '',
                score: -50,
              },
            ];
          }

          return preScoredFoodList.map((preScoredFood) => {
            if (preScoredFood.foodId === userAssembleFood.foodId) {
              return {
                foodId: userAssembleFood.foodId,
                foodName: userAssembleFood.foods?.name ?? '',
                score: preScoredFood.score - 50,
              };
            }

            return preScoredFood;
          });
        },
        [] as Array<{ foodId: string; foodName: string; score: number }>,
      );

    const favoriteFoodList = userAssembleFoodList
      .filter(({ surveyType }) => {
        return surveyType === 'favorite';
      })
      .reduce(
        (preScoredFoodList, userAssembleFood) => {
          const hasPreScoredFood = !!preScoredFoodList.find((preScoredFood) => {
            return preScoredFood.foodId === userAssembleFood.foodId;
          });

          const cuisineList = userAssembleFood.foods.food__cuisine.map(
            ({ cuisine }) => {
              return cuisine!;
            },
          );

          if (!hasPreScoredFood) {
            return [
              ...preScoredFoodList,
              {
                foodId: userAssembleFood.foodId,
                foodName: userAssembleFood.foods?.name ?? '',
                score: 100 + 30,
                cuisineList,
              },
            ];
          }

          return preScoredFoodList.map((preScoredFood) => {
            if (preScoredFood.foodId === userAssembleFood.foodId) {
              return {
                foodId: userAssembleFood.foodId,
                foodName: userAssembleFood.foods?.name ?? '',
                score: preScoredFood.score + 30,
                cuisineList,
              };
            }

            return preScoredFood;
          });
        },
        [] as Array<{
          foodId: string;
          foodName: string;
          score: number;
          cuisineList: Array<{
            id: string;
            name: string;
          }>;
        }>,
      );
    let mostFavoriteFood: (typeof favoriteFoodList)[number];

    // NOTE [C]: 선호 정보 가져와서 점수 책정 후 음식 도출
    mostFavoriteFood = favoriteFoodList
      .filter((favoriteFood) => {
        const hasScoredAlreadyRecommendedAssembleFood =
          scoredAlreadyRecommendedAssembleFoodList.find(
            (scoredAlreadyRecommendedAssembleFood) => {
              return (
                scoredAlreadyRecommendedAssembleFood.foodId ===
                favoriteFood.foodId
              );
            },
          );

        const hasHateFood = hateFoodList.find((hateFood) => {
          return hateFood.foodId === favoriteFood.foodId;
        });

        return !hasHateFood && !hasScoredAlreadyRecommendedAssembleFood;
      })
      .draw();

    if (!mostFavoriteFood) {
      // NOTE [A]: 선호 정보로 음식을 추천할 수 없는 경우 cuisine이 하나인 음식 뽑아서 싫어하는 음식 score 계산 후 제공
      mostFavoriteFood = (await this.getFoodWithCuisine())
        .map((food) => {
          const alreadyRecommendedAssembleFood =
            scoredAlreadyRecommendedAssembleFoodList.find(
              (scoredAlreadyRecommendedAssembleFood) => {
                return (
                  scoredAlreadyRecommendedAssembleFood.foodId === food.foodId
                );
              },
            );
          const hateFood = hateFoodList.find((hateFood) => {
            return hateFood.foodId === food.foodId;
          });

          return {
            ...food,
            score:
              food.score +
              (hateFood?.score ?? 0) +
              (alreadyRecommendedAssembleFood?.score ?? 0),
          };
        })
        .draw();
    }

    // NOTE [B]: cuisine이 두개 이상인 음식 뽑아서 싫어하는 음식 score 계산 후 제공
    const fusionCuisineFood = (
      await this.getFoodWithCuisine({ cuisineCount: 2 })
    )
      .map((food) => {
        const alreadyRecommendedAssembleFood =
          scoredAlreadyRecommendedAssembleFoodList.find(
            (scoredAlreadyRecommendedAssembleFood) => {
              return (
                scoredAlreadyRecommendedAssembleFood.foodId === food.foodId
              );
            },
          );
        const hateFood = hateFoodList.find((hateFood) => {
          return hateFood.foodId === food.foodId;
        });

        return {
          ...food,
          score:
            food.score +
            (hateFood?.score ?? 0) +
            (alreadyRecommendedAssembleFood?.score ?? 0),
        };
      })
      .draw();

    // NOTE [D]: A또는 C에서 나온 cuisine을 제외하고 cuisine이 한개인 음식 뽑아서 싫어하는 음식 score 계산 후 제공
    const singleCuisineFood = (
      await this.getFoodWithCuisine({
        ninCuisineIdList: [mostFavoriteFood.cuisineList[0].id],
        ninFoodIdList: [mostFavoriteFood.foodId],
      })
    )
      .map((food) => {
        const alreadyRecommendedAssembleFood =
          scoredAlreadyRecommendedAssembleFoodList.find(
            (scoredAlreadyRecommendedAssembleFood) => {
              return (
                scoredAlreadyRecommendedAssembleFood.foodId === food.foodId
              );
            },
          );
        const hateFood = hateFoodList.find((hateFood) => {
          return hateFood.foodId === food.foodId;
        });

        return {
          ...food,
          score:
            food.score +
            (hateFood?.score ?? 0) +
            (alreadyRecommendedAssembleFood?.score ?? 0),
        };
      })
      .draw();

    const { data: recommend } = await this.supabaseService.client
      .from('recommends')
      .insert({ assembleId })
      .select('*')
      .single();

    if (!recommend) {
      throw new HttpException('fail create recommends', 400);
    }

    const userList = [
      ...new Set(
        userAssembleFoodList.map(({ userId }) => {
          return userId;
        }),
      ),
    ];

    await this.supabaseService.client.from('recommend__users').insert(
      userList.map((userId) => {
        return {
          userId,
          recommendId: recommend.id,
        };
      }),
    );

    await this.supabaseService.client.from('recommend__foods').insert(
      [
        mostFavoriteFood && {
          recommendId: recommend.id,
          type: 'most-favorite' as const,
          foodId: mostFavoriteFood.foodId,
        },
        fusionCuisineFood && {
          recommendId: recommend.id,
          type: 'multi-cuisine' as const,
          foodId: fusionCuisineFood.foodId,
        },
        singleCuisineFood && {
          recommendId: recommend.id,
          type: 'single-cuisine' as const,
          foodId: singleCuisineFood.foodId,
        },
      ].filter(Boolean),
    );

    await this.supabaseService.client
      .from('assembles')
      .update({ updatedAt: new Date().toISOString() })
      .eq('id', assembleId);

    return [mostFavoriteFood, fusionCuisineFood, singleCuisineFood];
  }

  async getLatestRecommendFoodList({ assembleId }: RecommendFoodListDto) {
    const { data: recommendList } = await this.supabaseService.client
      .from('recommends')
      .select(
        `
          *,
          recommend__foods!inner(
            *,
            foods!inner(*)
          )
        `,
      )
      .eq('assembleId', assembleId)
      .order('createdAt', { ascending: false });

    const recommend = recommendList?.[0];

    if (!recommend) {
      throw new HttpException('has not recommend', 400);
    }

    const mostFavoriteFood = recommend.recommend__foods.filter(({ type }) => {
      return type === 'most-favorite';
    })[0];
    const multiCuisineFood = recommend.recommend__foods.filter(({ type }) => {
      return type === 'multi-cuisine';
    })[0];
    const singleCuisineFood = recommend.recommend__foods.filter(({ type }) => {
      return type === 'single-cuisine';
    })[0];

    if (!mostFavoriteFood || !multiCuisineFood || !singleCuisineFood) {
      throw new HttpException('fail load recommend food list', 400);
    }
    return [mostFavoriteFood, multiCuisineFood, singleCuisineFood].map(
      ({ foodId, foods }) => {
        return {
          foodId,
          foodName: foods.name,
        };
      },
    );
  }
}
