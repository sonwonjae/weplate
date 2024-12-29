import { HttpException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Tables } from 'src/supabase/supabase.types';

import { CheckFoodSurveyDto } from './dto/check-food-survey.dto';
import { CreateFoodSurveyDto } from './dto/create-food-survey.dto';
import { RecommendFoodListDto } from './dto/recommend-food-list.dto';
import { SearchFoodListDto } from './dto/search-food-list.dto';

@Injectable()
export class FoodService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async searchFoodList({ search }: SearchFoodListDto) {
    let query = this.supabaseService.client.from('foods').select('*');

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: foodList } = await query;

    return foodList ?? [];
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
      // query = query.not('food__cuisine.cuisine.id', 'in', ninCuisineIdList);
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
    const { data: userAssembleFoodList } = await this.supabaseService.client
      .from('user__assemble__foods')
      .select(
        `
          *,
          users!inner(*),
          foods(
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

    const { data: alreadyRecommendedAssembleFoodList } =
      await this.supabaseService.client
        .from('recommended__assemble_foods')
        .select(
          `
            *,
            foods!inner(*)
          `,
        )
        .eq('assembleId', assembleId);

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
                score: -9999,
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
                score: preScoredFood.score - 9999,
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

          const cuisineList = userAssembleFood.foods!.food__cuisine.map(
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

    // NOTE [A]: 선호 정보 가져와서 점수 책정 후 음식 도출
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
      .sort((a, b) => {
        return b.score - a.score;
      })[0];

    if (!mostFavoriteFood) {
      // NOTE [D]: 선호 정보로 음식을 추천할 수 없는 경우 cuisine이 하나인 음식 뽑아서 싫어하는 음식 score 계산 후 제공
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
        .sort((a, b) => {
          return b.score - a.score;
        })[0];
    }

    // NOTE [B]: cuisine이 두개 이상인 음식 뽑아서 싫어하는 음식 score 계산 후 제공
    const fusionCuisineFoodList = (
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
      .sort((a, b) => {
        return b.score - a.score;
      });
    const fusionCuisineFood = fusionCuisineFoodList[0];
    console.log(
      'single food query: ',
      [mostFavoriteFood.cuisineList[0].id],
      [mostFavoriteFood.foodId],
    );

    // NOTE [B]: A또는 D에서 나온 cuisine을 제외하고 cuisine이 한개인 음식 뽑아서 싫어하는 음식 score 계산 후 제공
    const singleCuisineFoodList = (
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
      .sort((a, b) => {
        return b.score - a.score;
      });
    const singleCuisineFood = singleCuisineFoodList[0];

    await this.supabaseService.client
      .from('recommended__assemble_foods')
      .insert(
        [
          mostFavoriteFood && {
            foodId: mostFavoriteFood.foodId,
            assembleId,
          },
          fusionCuisineFood && {
            foodId: fusionCuisineFood.foodId,
            assembleId,
          },
          singleCuisineFood && {
            foodId: singleCuisineFood.foodId,
            assembleId,
          },
        ].filter(Boolean),
      );

    return [mostFavoriteFood, fusionCuisineFood, singleCuisineFood];
  }
}
