import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum SortOrder {
  LATEST = 'latest',
  OLDEST = 'oldest',
}

export class GetAssembleInfinityListParamsDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (!value) {
      return null;
    }
    return value;
  })
  cursor: string | null;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (!value) {
      return undefined;
    }

    return value;
  })
  search?: string;

  @IsEnum(SortOrder)
  @Transform(({ value }) => {
    return value?.toLowerCase();
  })
  sort: `${SortOrder}`;

  @IsNumber()
  @Transform(({ value }) => {
    return parseInt(value, 10);
  })
  limit: number;
}
