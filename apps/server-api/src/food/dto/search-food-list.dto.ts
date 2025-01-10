import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class SearchFoodListDto {
  @IsString()
  @Transform(({ value }) => {
    if (!value) {
      return '';
    }

    return value;
  })
  search: string;
}
