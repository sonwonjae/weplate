import { Cache } from '@nestjs/cache-manager';
import { HttpException, Injectable } from '@nestjs/common';
import { Tables } from '@package/types';
import { SupabaseService } from 'src/supabase/supabase.service';

import { AgreeServicePolicyDto } from './dto/create-agree.dto';

@Injectable()
export class AgreeService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly cacheManager: Cache,
  ) {}

  async agreeServicePolicy(
    {
      isAdultAgreed,
      isTermsOfUseAgreed,
      isPrivacyPolicyAgreed,
    }: AgreeServicePolicyDto,
    userInfo: Tables<'users'>,
  ) {
    try {
      await this.supabaseService.client.from('user__agreement_service').upsert(
        {
          userId: userInfo.id,
          isAdultAgreed,
          isTermsOfUseAgreed,
          isPrivacyPolicyAgreed,
        },
        {
          onConflict: 'userId',
        },
      );
      await this.cacheManager.set(
        `agree:service:policy:${userInfo.id}`,
        true,
        Infinity,
      );
      return true;
    } catch {
      throw new HttpException(`user{${userInfo.id}} agree fail`, 400);
    }
  }

  async checkAgreeServicePolicy(userInfo: Tables<'users'>) {
    const cachedIsValid = await this.cacheManager.get<boolean>(
      `agree:service:policy:${userInfo.id}`,
    );

    if (cachedIsValid) {
      return { isValid: cachedIsValid };
    }

    const { data: userAgreementService } = await this.supabaseService.client
      .from('user__agreement_service')
      .select('*')
      .eq('userId', userInfo.id)
      .single();

    if (
      !userAgreementService ||
      !userAgreementService.isAdultAgreed ||
      !userAgreementService.isTermsOfUseAgreed ||
      !userAgreementService.isPrivacyPolicyAgreed
    ) {
      return { isValid: false };
    }

    return { isValid: true };
  }
}
