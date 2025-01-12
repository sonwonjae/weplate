import { Tables } from '@package/types';

export interface UserInfo extends Partial<Tables<'users'>> {
  nickname: string;
  email: string;
  providerId: string;
}

export interface RegistUserOptions {
  userInfo: UserInfo;
}
