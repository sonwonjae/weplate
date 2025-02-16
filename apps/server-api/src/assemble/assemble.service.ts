import type { Response as ExpressResponse } from 'express';

import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { Enums, Tables } from '@package/types';
import { SupabaseService } from 'src/supabase/supabase.service';

import { CreateAssembleDto } from './dto/create-assemble.dto';
import { GetAssembleInfinityListParamsDto } from './dto/get-assemble-infinity-list.dto';
import { UpdateAssembleDto } from './dto/update-assemble.dto';

@Injectable()
export class AssembleService {
  constructor(private readonly supabaseService: SupabaseService) {}

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
      .from('user__assembles')
      .insert({
        userId: userInfo.id,
        assembleId: assemble.id,
        permission: 'owner',
        createdAt: new Date().toISOString(),
      })
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
        limit: Number(process.env.ASSEMBLE_CREATION_LIMIT),
      };
    }

    const { data: userAssemble } = await this.supabaseService.client
      .from('user__assembles')
      .select('*')
      .eq('userId', userInfo.id);

    if (
      Array.isArray(userAssemble) &&
      userAssemble.length >= Number(process.env.ASSEMBLE_CREATION_LIMIT)
    ) {
      return {
        isWithinCreationLimit: false,
        limit: Number(process.env.ASSEMBLE_CREATION_LIMIT),
      };
    }
    return {
      isWithinCreationLimit: true,
      limit: Number(process.env.ASSEMBLE_CREATION_LIMIT),
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
          user__assembles!inner(*)
        `,
      )
      .eq('user__assembles.userId', userInfo.id);

    if (cursor) {
      const { data: cursorAssemble } = await this.supabaseService.client
        .from('assembles')
        .select('*')
        .eq('id', cursor)
        .single();

      if (cursorAssemble) {
        const operator = (() => {
          switch (sort) {
            case 'oldest':
              return 'gt';
            case 'latest':
              return 'lt';
          }
        })();
        query = query.filter('updatedAt', operator, cursorAssemble.updatedAt);
      }
    }

    if (sort === 'latest') {
      query = query.order('updatedAt', { ascending: false });
    }
    if (sort === 'oldest') {
      query = query.order('updatedAt', { ascending: true });
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data: myAssembleList } = await query;

    const mappedMyAssembleList = await Promise.all(
      (myAssembleList ?? []).map(
        async ({ id, title, createdAt, updatedAt, user__assembles }) => {
          return {
            id,
            title,
            createdAt,
            updatedAt,
            userAssembleList: await this.getAssembleUserList(id, userInfo),
            permission: user__assembles[0].permission,
          };
        },
      ),
    );

    return {
      list: mappedMyAssembleList,
      cursor: mappedMyAssembleList[mappedMyAssembleList.length - 1]?.id ?? null,
    };
  }

  async getAssembleItem(assembleId: string) {
    const { data: assemble } = await this.supabaseService.client
      .from('assembles')
      .select(
        `
          *,
          user__assembles(*)
        `,
      )
      .eq('id', assembleId)
      .single();

    const onwerId = assemble?.user__assembles.filter(({ permission }) => {
      return permission === 'owner';
    })[0].userId;

    if (!onwerId) {
      throw new HttpException('this assemble has not owner', 400);
    }

    const { data: ownerInfo } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('id', onwerId)
      .single();

    if (!ownerInfo) {
      throw new HttpException('this assemble has not owner', 400);
    }

    const { data: userAssemble = [] } = await this.supabaseService.client
      .from('user__assembles')
      .select(
        `
        *,
        users(*)
      `,
      )
      .eq('assembleId', assembleId);

    const memberList = userAssemble
      ?.filter(({ permission }) => {
        return permission === 'member';
      })
      ?.map(({ users }) => {
        return users;
      });

    return {
      createdAt: assemble?.createdAt,
      id: assemble?.id,
      title: assemble?.title,
      updatedAt: assemble?.updatedAt,
      ownerInfo,
      memberList,
    };
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

  async getAssembleUserList(assembleId: string, userInfo?: Tables<'users'>) {
    const { data: userAssemblesWithFoodsSurvey = [] } =
      await this.supabaseService.client
        .from('user__assembles')
        .select(
          `
            *,
            user__assemble__foods(*),
            users(*)
          `,
        )
        .eq('assembleId', assembleId)
        .order('createdAt', { ascending: true });

    const sortedUserAssemblesWithFoodsSurvey =
      userAssemblesWithFoodsSurvey
        /** NOTE: 본인인 경우 방장 다음으로 위치 */
        ?.sort((a, b) => {
          if (a.id === userInfo?.id && b.id !== userInfo?.id) {
            return -1;
          }
          return 0;
        })
        /** NOTE: 방장인 경우 무조건 1번째 위치 */
        .sort((a, b) => {
          if (a.permission === 'owner' && b.permission !== 'owner') {
            return -1;
          }
          return 0;
        }) ?? [];

    return (
      sortedUserAssemblesWithFoodsSurvey.map(
        ({ id, permission, user__assemble__foods, users }) => {
          return {
            id,
            permission,
            userId: users?.id,
            nickname: users?.nickname,
            isRegisted: !!user__assemble__foods.length,
          };
        },
      ) ?? []
    );
  }

  async checkJoinable(assembleId: string, userInfo?: Tables<'users'>) {
    if (userInfo) {
      const { data: userAssemble } = await this.supabaseService.client
        .from('user__assembles')
        .select('*')
        .eq('userId', userInfo.id)
        .eq('assembleId', assembleId)
        .single();

      if (userAssemble) {
        return {
          joinable: false,
          message: 'already member',
        } as const;
      }
    }

    const { data: userAssembleList } = await this.supabaseService.client
      .from('user__assembles')
      .select('*')
      .eq('assembleId', assembleId);

    if (
      (userAssembleList ?? []).length >=
      Number(process.env.ASSEMBLE_MAX_USER_COUNT)
    ) {
      return {
        joinable: false,
        message: 'full assemble',
      } as const;
    }

    return {
      joinable: true,
      message: 'joinable assemble',
    } as const;
  }

  async requestJoinFromInvitee(
    res: ExpressResponse,
    assembleId: string,
    userInfo: Tables<'users'>,
  ) {
    const { data: newUserAssemble } = await this.supabaseService.client
      .from('user__assembles')
      .insert({
        userId: userInfo.id,
        assembleId: assembleId,
        permission: 'member',
        createdAt: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (!newUserAssemble) {
      throw new ConflictException();
    }
    return res.redirect(`/assemble/${assembleId}`);
  }

  async checkRegistedFoodMember(userInfo: Tables<'users'>, assembleId: string) {
    const { data: latestRecommendList } = await this.supabaseService.client
      .from('recommends')
      .select(
        `
          *,
          recommend__users!inner(
            *
          )
        `,
      )
      .eq('assembleId', assembleId)
      .order('createdAt', { ascending: false });

    const latestRecommend = latestRecommendList?.[0];

    const latestRecommendUsers =
      latestRecommend?.recommend__users.map(({ userId }) => {
        return userId;
      }) ?? [];

    const { data: assembleUsers } = await this.supabaseService.client
      .from('user__assembles')
      .select(
        `
        *,
        user__assemble__foods(*)
      `,
      )
      .eq('assembleId', assembleId);

    const newRegistedFoodMemberList =
      assembleUsers
        ?.filter(({ user__assemble__foods }) => {
          return !!user__assemble__foods.length;
        })
        .filter(({ userId }) => {
          return !latestRecommendUsers.includes(userId);
        })
        .map(({ userId }) => {
          return userId;
        }) ?? [];

    return newRegistedFoodMemberList;
  }

  async countdownRecommendChance(assembleId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: recommendList } = await this.supabaseService.client
      .from('recommends')
      .select('*')
      .eq('assembleId', assembleId)
      .gte('createdAt', today.toISOString())
      .lt('createdAt', tomorrow.toISOString());

    const max = Number(process.env.TODAY_MAX_RECOMMEND_FOOD_COUNT) ?? 0;
    const remainCount = max - (recommendList?.length ?? 0);

    return remainCount >= 0 ? remainCount : 0;
  }

  async delegateOwnerToOldestMember(
    assembleId: string,
    userId: string,
    permission: Enums<'permission'>,
  ) {
    if (permission !== 'owner') {
      return {
        delegatable: false,
        code: -1,
        message: 'has not permission',
      } as const;
    }

    const { data: userAssembleList } = await this.supabaseService.client
      .from('user__assembles')
      .select('*')
      .eq('permission', 'member')
      .order('createdAt', { ascending: true });

    const oldestMember = userAssembleList?.[0];
    if (!oldestMember) {
      return {
        delegatable: false,
        code: -2,
        message: 'has not member',
      } as const;
    }

    await this.supabaseService.client
      .from('user__assembles')
      .update({ permission: 'member' })
      .eq('userId', userId)
      .eq('assembleId', assembleId);

    await this.supabaseService.client
      .from('user__assembles')
      .update({ permission: 'owner' })
      .eq('userId', oldestMember.userId)
      .eq('assembleId', assembleId);

    return {
      delegatable: true,
      code: 1,
      message: 'success delegate',
    } as const;
  }

  async exitAllAssemble(userId: string) {
    const { data: userAssembleList } = await this.supabaseService.client
      .from('user__assembles')
      .select('*')
      .eq('userId', userId);

    const assembleIdList =
      userAssembleList?.map(({ assembleId, permission }) => {
        return { assembleId, permission };
      }) ?? [];

    for await (const { assembleId, permission } of assembleIdList) {
      const { code, delegatable } = await this.delegateOwnerToOldestMember(
        assembleId,
        userId,
        permission,
      );
      if (!delegatable && code === -1) {
        await this.removeAssemble(assembleId);
      }

      if (delegatable) {
        await this.supabaseService.client
          .from('user__assembles')
          .delete()
          .eq('userId', userId);
      }
    }
  }
}
