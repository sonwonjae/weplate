import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { Tables } from 'src/supabase/supabase.types';

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
