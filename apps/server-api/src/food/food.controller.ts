import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Tables } from '@package/types';
import { UserInfo } from 'src/auth/auth.decorator';

import { CreateFoodSurveyDto } from './dto/create-food-survey.dto';
import { ManageFoodListDto } from './dto/manage-food-list.dto';
import { SearchFoodListDto } from './dto/search-food-list.dto';
import { FoodService } from './food.service';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('search/list')
  searchFoodList(@Query() query: SearchFoodListDto) {
    return this.foodService.searchFoodList(query);
  }

  @Get('detail/list')
  getFoodListWithCuisine(@Query() query: ManageFoodListDto) {
    return this.foodService.getFoodListWithCuisine(query);
  }

  @Get(':assembleId/survey')
  async getFoodListSurvey(
    @UserInfo() userInfo: Tables<'users'>,
    @Param('assembleId') assembleId: Tables<'assembles'>['id'],
  ) {
    return await this.foodService.getFoodListSurvey(userInfo, {
      assembleId,
    });
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
  @Patch(':assembleId/survey')
  async updateFoodListSurvey(
    @UserInfo() userInfo: Tables<'users'>,
    @Param('assembleId') assembleId: Tables<'assembles'>['id'],
    @Body() body: Omit<CreateFoodSurveyDto, 'assembleId'>,
  ) {
    return await this.foodService.updateFoodListSurvey(userInfo, {
      assembleId,
      ...body,
    });
  }

  @Get(':assembleId/check/survey/complete')
  async checkAlreadyRegistUser(
    @UserInfo() userInfo: Tables<'users'>,
    @Param('assembleId') assembleId: Tables<'assembles'>['id'],
  ) {
    const isRegistedUser = await this.foodService.checkAlreadyRegistUser(
      userInfo,
      {
        assembleId,
      },
    );
    if (isRegistedUser) {
      return true;
    }

    throw new HttpException('not yet regist food', 400);
  }

  @Post(':assembleId/recommend/food')
  async recommendFoodList(
    @Param('assembleId') assembleId: Tables<'assembles'>['id'],
  ) {
    return this.foodService.recommendFoodList({ assembleId });
  }

  @Get(':assembleId/recommend/result')
  async getLatestRecommendFoodList(
    @Param('assembleId') assembleId: Tables<'assembles'>['id'],
  ) {
    return this.foodService.getLatestRecommendFoodList({ assembleId });
  }
}
