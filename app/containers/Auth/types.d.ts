import type { Email, Phone } from '@components/Login/types';
import { socialLoginProviders } from '@contexts/AuthContext/socialAuthProvider';
import type { SagaCallback } from '@store/types';

export interface User extends CandidateObject {
  username?: Email;
  phone?: Phone;
}

export interface AuthState {
  initializing: boolean;
  initialized: boolean;
  authenticated: boolean;
  authenticating: boolean;
  idToken: string | null;
  queryParams?: QueryParams;
  verificationCodeRequested: boolean;
  user: User;
  verificationId: string;
  accessToken: string | null;
  expiryTime: string | null;
  currentUser?: null;
  customToken?: string | null;
  hash_token?: string | null;
  tenant_id?: number | null | string;
  candidateDetails?: CandidateDetailsProps | null;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isInitialized: boolean;
  triggerEmailOtp: () => void;
  initiateSocialLogin: () => void;
  triggerPhoneFirebaseOtp: () => void;
  triggerVerifyEmailOtp: () => void;
  triggerFirebaseVerifyOtp: () => void;
  queryParams?: QueryParams;
  verificationCodeRequested: boolean;
  user?: User;
}

export interface AuthenticatePayload {
  accessToken: string | null | undefined;
  candidate?: CandidateObject | null | undefined;
  tenant_id?: number;
  parsedToken: ParsedToken;
  hash_token?: string | null;
  customToken?: string | null;
  idToken?: string | null;
}

export interface EmailInput {
  username: Email;
  callback: SagaCallback;
}

export interface EmailInputSuccess {
  username: Email;
}

export interface PhoneInput {
  phone: Phone;
  callback: SagaCallback;
}

export interface VerifyOtpInput {
  username: Email | Phone;
  code: number | string | undefined;
  // tenantId: number;
  callback?: SagaCallback;
}

export interface FirebaseVerifyOtpPayload {
  code: string;
  callback?: SagaCallback;
}

export interface FirebaseOtpSuccessPayload {
  verificationId: string;
  phone: Phone;
}

export interface EmailInputAction extends EmailInput {
  type: string;
}

export interface PhoneInputAction extends PhoneInput {
  type: string;
}

export interface VerifyFirebaseOtpSuccessPayload {
  idToken: string;
}

export interface QueryParams {
  tid?: string;
  test_instance_id?: string;
  c?: string;
  from?: string;
  driveScheduleId?: string;
  order_id?: string;
  ps?: string;
  meetingId?: string;
  rebookSlot?: boolean;
  form_id?: string;
  redirect_url?: string;
}

export interface InitializePayload {
  params: QueryParams;
}

export interface AuthCustomTokenOutput {
  custom_token: string;
  expires_by?: string | null;
  id?: number | null;
  tenant_identity_id: string;
}

export interface CandidateObject {
  country?: string | null;
  email?: string | null;
  external_id?: number | null;
  first_name?: string | null;
  is_tnc_accepted?: boolean | null;
  last_name?: string | null;
  middle_name?: string | null;
  phone_number?: string | null;
  user_id?: string | null;
  tenant_id?: string | null;
  roles?: string[] | null;
}

export interface parsedTokenData {
  user_id?: string | null;
  tenant_id?: string | null;
  roles?: string[] | null;
  expiryTime?: string | null;
}

export interface CustomTokenData {
  access_token?: string | null;
  candidate?: CandidateObject | null;
  expires_in?: number | null;
  id_token: string;
  refresh_token?: string | null;
  tenant_id: number;
}

export interface CustomTokenType {
  success: boolean;
  error_message: string | null;
  data: CustomTokenData;
}

export interface SignUpResponsePayload {
  data: {
    canx_signup: CustomTokenType[];
  };
}

export interface AuthenticateFirebase {
  customToken: string;
}

export interface AuthenticateWorker {
  hash_token: string;
}

export interface GetCustomTokenPayload {
  data: {
    auth_get_custom_token: {
      custom_token: string;
      expires_by?: string;
      id?: number;
      tenant_identity_id: string;
    };
  };
}

export interface GetAccessTokenPayload {
  data: {
    auth_get_access_token: {
      data: {
        access_token: string;
        custom_token: string;
        expires_in: number;
        refresh_token: string;
      };
      error_message: string | null;
      success: boolean;
    };
  };
}

export interface GetStoredSession {
  accessToken?: string | null;
  idToken?: string | null;
  tenant_id?: string | number | null;
  customToken?: string | null;
  hash_token?: string | null;
}

export type SocialLoginProviderName = keyof typeof socialLoginProviders;

export interface InitializeSocialLoginPayload {
  socialLoginProviderName: SocialLoginProviderName;
  callback?: SagaCallback;
}

export interface SocialLoginSuccessPayload {
  name: string;
  phone: string;
  email: string;
  idToken: string;
  tenantId: number;
  userUid: string;
}

export interface ParsedToken {
  user_id: string;
  tenant_id: string;
  roles: string[];
  expiryTime: string;
}

export interface Tenant {
  name: string;
  id: number;
}

export interface AuthUserMe {
  email: string;
  id: number;
  name: string;
  phone_number: string | null;
  username: string;
  external_id: string | null;
  old_id: string | null;
  profile_pic_file_id: string | null;
  tenant_id: number;
  tenant: Tenant;
  countryCode: string;
}

export interface CurrentUserResponse {
  data: {
    auth_user_me: AuthUserMe;
  };
}

export interface CandidateDetailsProps {
  email: string;
  country: string | null;
  first_name: string;
  id: number;
  last_name: string | null;
  middle_name: string | null;
  is_active: boolean;
  detached_order_id?: number | null;
}

export interface CandidateDetailsInputProps {
  email: string;
  callback?: SagaCallback;
}
