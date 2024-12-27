import { HttpException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Tables } from 'src/supabase/supabase.types';

import { CheckFoodSurveyDto } from './dto/check-food-survey.dto';
import { CreateFoodSurveyDto } from './dto/create-food-survey.dto';
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
      Tables<'user__assemble__foods'>
    >(({ foodId }) => {
      return {
        surveyType: 'favorite',
        foodId,
        userAssembleId: userAssemble.id,
      };
    });
    const mappedHateeFoodList = hateFoodList.map<
      Tables<'user__assemble__foods'>
    >(({ foodId }) => {
      return {
        surveyType: 'hate',
        foodId,
        userAssembleId: userAssemble.id,
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
}
