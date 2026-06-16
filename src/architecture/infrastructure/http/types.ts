import type { Result } from "@/src/libs/result";

export interface BackendResponse<T> {
  message: string;
  code: number;
  data: T;
  meta?: unknown;
}

/** Opciones de cache agnósticas al framework. El HttpClient las traduce internamente. */
export type CacheOptions = {
  tags?: string[];
  revalidate?: number | false;
};

export type HttpRequestOptions = Omit<RequestInit, "method" | "body"> &
  CacheOptions & {
    /** Permite respuestas con `data: null` (ej. DELETE, register) */
    allowNull?: boolean;
  };

export type HttpClientConfig = {
  baseUrl: string;
  timeoutMs?: number;
  getAuthToken?: () => string | null | Promise<string | null>;
  defaultHeaders?: Record<string, string>;
};

export interface IHttpClient {
  get<T>(endpoint: string, options?: HttpRequestOptions): Promise<Result<T>>;
  post<T>(
    endpoint: string,
    body: unknown,
    options?: HttpRequestOptions,
  ): Promise<Result<T>>;
  put<T>(
    endpoint: string,
    body: unknown,
    options?: HttpRequestOptions,
  ): Promise<Result<T>>;
  delete<T>(endpoint: string, options?: HttpRequestOptions): Promise<Result<T>>;
}
