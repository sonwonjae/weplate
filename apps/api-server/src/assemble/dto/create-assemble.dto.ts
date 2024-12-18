import { Type } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { Tables } from 'src/supabase/supabase.types';

export class CreateAssembleDto {
  @Type(() => {
    return String;
  })
  @IsString()
  @IsNotEmpty()
  title: Tables<'assemble'>['title'];
}
