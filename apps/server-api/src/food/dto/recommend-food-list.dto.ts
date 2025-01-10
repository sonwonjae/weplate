import { Tables } from '@package/types';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class RecommendFoodListDto {
  @IsString()
  @Transform(({ value }) => {
    if (!value) {
      return '';
    }

    return value;
  })
  assembleId: Tables<'assembles'>['id'];
}
