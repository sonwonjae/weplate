import { Tables } from '@package/types';
import { Type } from 'class-transformer';
import { IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';

class FoodItemDto {
  @IsString()
  foodId: string;
}

export class CreateFoodSurveyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => {
    return FoodItemDto;
  })
  favoriteFoodList: Array<{ foodId: Tables<'foods'>['id'] }>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => {
    return FoodItemDto;
  })
  hateFoodList: Array<{ foodId: Tables<'foods'>['id'] }>;

  @IsString()
  @IsNotEmpty()
  @Type(() => {
    return String;
  })
  assembleId: Tables<'assembles'>['id'];
}
