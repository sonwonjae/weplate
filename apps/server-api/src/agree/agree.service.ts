import { Injectable } from '@nestjs/common';
import { Tables } from '@package/types';
import { SupabaseService } from 'src/supabase/supabase.service';

import { AgreeServicePolicyDto } from './dto/create-agree.dto';

@Injectable()
export class AgreeService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async agreeServicePolicy(
    {
      isAdultAgreed,
      isTermsOfUseAgreed,
      isPrivacyPolicyAgreed,
    }: AgreeServicePolicyDto,
    userInfo: Tables<'users'>,
  ) {
    await this.supabaseService.client.from('user__agreement_service').insert({
      userId: userInfo.id,
      isAdultAgreed,
      isTermsOfUseAgreed,
      isPrivacyPolicyAgreed,
    });
    return true;
  }

  async checkAgreeServicePolicy(userInfo: Tables<'users'>) {
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
