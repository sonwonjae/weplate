import { Controller, Get, Query } from '@nestjs/common';

import { SearchFoodListDto } from './dto/search-food-list.dto';
import { FoodService } from './food.service';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('search/list')
  searchFoodList(@Query() query: SearchFoodListDto) {
    return this.foodService.searchFoodList(query);
  }
}
