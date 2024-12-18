import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

import { CreateAssembleDto } from './dto/create-assemble.dto';
import { UpdateAssembleDto } from './dto/update-assemble.dto';

@Injectable()
export class AssembleService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createAssemble({ title }: CreateAssembleDto) {
    const { data: assemble } = await this.supabaseService.client
      .from('assemble')
      .insert({
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select('*')
      .single();

    return assemble;
  }

  // FIXME: pagination 구현하기
  async getMyAssembleList() {
    const { data: myAssembleList } = await this.supabaseService.client
      .from('assemble')
      .select('*');
    return myAssembleList;
  }

  async getAssembleItem(assembleId: string) {
    const { data: assemble } = await this.supabaseService.client
      .from('assemble')
      .select('*')
      .eq('id', assembleId)
      .single();

    return assemble;
  }

  async updateAssemble(assembleId: string, { title }: UpdateAssembleDto) {
    console.log({assembleId, title})
    const { data: assemble } = await this.supabaseService.client
      .from('assemble')
      .update({
        title,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', assembleId)
      .select('*')
      .single();

    return assemble;
  }

  async removeAssemble(assembleId: string) {
    await this.supabaseService.client
      .from('assemble')
      .delete()
      .eq('id', assembleId);

    return true;
  }
}
