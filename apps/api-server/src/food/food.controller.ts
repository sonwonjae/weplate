import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserInfo } from 'src/auth/auth.decorator';
import { Tables } from 'src/supabase/supabase.types';

import { CreateFoodSurveyDto } from './dto/create-food-survey.dto';
import { SearchFoodListDto } from './dto/search-food-list.dto';
import { FoodService } from './food.service';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('search/list')
  searchFoodList(@Query() query: SearchFoodListDto) {
    return this.foodService.searchFoodList(query);
  }

  @Post(':assembleId/survey')
  async registFoodListSurvey(
    @UserInfo() userInfo: Tables<'users'>,
    @Param('assembleId') assembleId: Tables<'assembles'>['id'],
    @Body() body: Omit<CreateFoodSurveyDto, 'assembleId'>,
  ) {
    return await this.foodService.registFoodListSurvey(userInfo, {
      assembleId,
      ...body,
    });
  }
}
