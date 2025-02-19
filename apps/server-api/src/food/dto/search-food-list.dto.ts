import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class SearchFoodListDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (!value) {
      return '';
    }

    return value;
  })
  search: string;
}
