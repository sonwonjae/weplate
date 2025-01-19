import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class ManageFoodListDto {
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
