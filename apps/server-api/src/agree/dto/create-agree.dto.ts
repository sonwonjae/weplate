import { IsBoolean } from 'class-validator';

export class AgreeServicePolicyDto {
  @IsBoolean()
  isAdultAgreed: boolean;
  @IsBoolean()
  isTermsOfUseAgreed: boolean;
  @IsBoolean()
  isPrivacyPolicyAgreed: boolean;
}
