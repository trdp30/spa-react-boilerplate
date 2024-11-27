export type ErrorDetails = Record<string, string | number | boolean | object | null | undefined>;

export class AppError extends Error {
  constructor(
    public message: string,
    public details?: ErrorDetails,
    public type: 'ValidationError' | 'APIError' | 'UnknownError' = 'UnknownError',
    public statusCode?: number
  ) {
    super(message);
    this.name = type;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export function createError(
  message: string,
  details?: ErrorDetails,
  type: 'ValidationError' | 'APIError' | 'UnknownError' = 'UnknownError',
  statusCode?: number
): AppError {
  return new AppError(message, details, type, statusCode);
}

export const catchException = {
  validationError: (message: string, details?: ErrorDetails) => createError(message, details, 'ValidationError'),

  apiError: (message: string, details?: ErrorDetails, statusCode: number = 500) =>
    createError(message, details, 'APIError', statusCode),

  unknownError: (message: string, details?: ErrorDetails) => createError(message, details, 'UnknownError'),
};

export function processSagaError(error: unknown, contextMessage: string): AppError {
  const details =
    typeof error === 'object' && error !== null ? { originalError: error } : { originalError: `${error}` };

  return error instanceof AppError ? error : catchException.unknownError(contextMessage, details);
}
