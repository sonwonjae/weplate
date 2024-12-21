import { HttpService } from '@nestjs/axios';
import { ConflictException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Tables } from 'src/supabase/supabase.types';

import { CreateAssembleDto } from './dto/create-assemble.dto';
import { GetAssembleInfinityListParamsDto } from './dto/get-assemble-infinity-list.dto';
import { UpdateAssembleDto } from './dto/update-assemble.dto';

@Injectable()
export class AssembleService {
  constructor(
    private readonly httpService: HttpService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async createAssemble(
    { title }: CreateAssembleDto,
    userInfo: Tables<'users'>,
  ) {
    const { data: assemble } = await this.supabaseService.client
      .from('assembles')
      .insert({
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (!assemble) {
      throw new ConflictException();
    }

    const { data: userAssemble } = await this.supabaseService.client
      .from('user_assembles')
      .insert({ userId: userInfo.id, assembleId: assemble.id })
      .select('*')
      .single();

    if (!userAssemble) {
      throw new ConflictException();
    }
    return assemble;
  }

  async checkWithinCreationLimit(userInfo: Tables<'users'>) {
    if (!userInfo) {
      return {
        isWithinCreationLimit: true,
        limit: Number(process.env.ASSEMBLE_LIMIT),
      };
    }

    const { data: userAssemble } = await this.supabaseService.client
      .from('user_assembles')
      .select('*')
      .eq('userId', userInfo.id);

    if (
      Array.isArray(userAssemble) &&
      userAssemble.length >= Number(process.env.ASSEMBLE_LIMIT)
    ) {
      return {
        isWithinCreationLimit: false,
        limit: Number(process.env.ASSEMBLE_LIMIT),
      };
    }
    return {
      isWithinCreationLimit: true,
      limit: Number(process.env.ASSEMBLE_LIMIT),
    };
  }

  async getMyAssembleList(
    userInfo: Tables<'users'>,
    { cursor, search, sort, limit }: GetAssembleInfinityListParamsDto,
  ) {
    let query = this.supabaseService.client
      .from('assembles')
      .select(
        `
          *,
          user_assembles!inner(userId)
        `,
      )
      .eq('user_assembles.userId', userInfo.id);

    if (sort === 'latest') {
      query = query.order('updatedAt', { ascending: true });
    }
    if (sort === 'oldest') {
      query = query.order('updatedAt', { ascending: false });
    }

    if (cursor) {
      query = query.gt('id', cursor);
    }

    if (search) {
      console.log({ search });
      query = query.ilike('title', `%${search}%`);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data: myAssembleList } = await query;

    // const nextCursor =
    //   myAssembleList.length > 0
    //     ? myAssembleList[myAssembleList.length - 1].id
    //     : null;

    return myAssembleList ?? [];
  }

  async getAssembleItem(assembleId: string) {
    const { data: assemble } = await this.supabaseService.client
      .from('assembles')
      .select('*')
      .eq('id', assembleId)
      .single();

    return assemble;
  }

  async updateAssemble(assembleId: string, { title }: UpdateAssembleDto) {
    const { data: assemble } = await this.supabaseService.client
      .from('assembles')
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
      .from('assembles')
      .delete()
      .eq('id', assembleId);

    return true;
  }
}
