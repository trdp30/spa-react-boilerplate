import { AnswersOutput } from '@containers/Assessment/types';

export interface OnSuccessResponse {
  redirectTo?: string;
  testInstanceId?: number;
  failedToSaveAnswer?: AnswersOutput[];
  orderId?: number;
  transaction_external_id?: string;
  payment_gateway_type?: string;
  payment_url?: string;
  email?: string;
  country?: string | null;
  first_name?: string;
  id?: number;
  last_name?: string | null;
  middle_name?: string | null;
  detached_order_id?: number | null;
}

export type OnSuccess = object | string | Record<string, never> | OnSuccessResponse;

export interface SagaCallback {
  onSuccess: (res?: OnSuccess) => void;
  onError: (res?: Error | undefined) => void;
}
