import { Type } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { Tables } from 'src/supabase/supabase.types';

export class GetFoodSurveyDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => {
    return String;
  })
  assembleId: Tables<'assembles'>['id'];
}
