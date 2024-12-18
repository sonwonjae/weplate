import { Module } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

import { AssembleController } from './assemble.controller';
import { AssembleService } from './assemble.service';

@Module({
  controllers: [AssembleController],
  providers: [AssembleService, SupabaseService],
})
export class AssembleModule {}
