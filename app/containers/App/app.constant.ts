/*
 * All constant related to Project config here
 */

export const paymentConstant = {
  STRIPE: 'STRIPE',
  PADDLE: 'PADDLE',
  PERCENT100: 'PERCENT100',
};

export const paymentOrderStatus = {
  DRAFT: 'DRAFT',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  CREATED: 'CREATED',
};

export const paymentOrderItemStatus = {
  CANCELLED: 'CANCELLED',
  CREATED: 'CREATED',
};

export const driveScheduleStatus = {
  SCHEDULED: 'SCHEDULED',
  ONGOING: 'ON_GOING',
  CANCEL: 'CANCEL',
  CONCLUDED: 'CONCLUDED',
};

export const paymentTransactionStatus = {
  INITIATED: 'INITIATED',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  COMPLETED: 'COMPLETED',
  REFUND_INITIATED: 'REFUND_INITIATED',
  REFUND_PENDING: 'REFUND_PENDING',
  REFUND_FAILED: 'REFUND_FAILED',
  REFUND_COMPLETED: 'REFUND_COMPLETED',
};
