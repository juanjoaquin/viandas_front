export type ErrorCode =
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION"
  | "CONFLICT"
  | "TIMEOUT"
  | "UNKNOWN";

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: ErrorCode };

export const Success = <T>(data: T): Result<T> => ({
  success: true,
  data,
});

export const Err = (
  error: string,
  code: ErrorCode = "UNKNOWN",
): Result<never> => ({
  success: false,
  error,
  code,
});

export function isSuccess<T>(result: Result<T>): result is { success: true; data: T } {
  return result.success;
}

export function isError<T>(
  result: Result<T>,
): result is { success: false; error: string; code: ErrorCode } {
  return !result.success;
}
