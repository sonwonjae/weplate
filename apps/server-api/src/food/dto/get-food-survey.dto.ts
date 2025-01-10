import { Tables } from '@package/types';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetFoodSurveyDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => {
    return String;
  })
  assembleId: Tables<'assembles'>['id'];
}
