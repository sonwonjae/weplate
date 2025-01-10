import { Tables } from '@package/types';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAssembleDto {
  @Type(() => {
    return String;
  })
  @IsString()
  @IsNotEmpty()
  title: Tables<'assembles'>['title'];
}
