import { Err, Success, type Result } from "@/src/libs/result";
import type { Paginated } from "@/src/architecture/core/domain/pagination";
import { Logger, setLogContext } from "@/src/architecture/infrastructure/logger/logger";
import { toFetchInit } from "./fetch-adapter";
import { toHttpError, toNetworkError } from "./http-errors";
import type {
  BackendResponse,
  HttpClientConfig,
  HttpRequestOptions,
  IHttpClient,
} from "./types";

const DEFAULT_TIMEOUT_MS = 10_000;

export class HttpClient implements IHttpClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly getAuthToken?: HttpClientConfig["getAuthToken"];
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig | string) {
    if (typeof config === "string") {
      this.baseUrl = normalizeBaseUrl(config);
      this.timeoutMs = DEFAULT_TIMEOUT_MS;
      this.defaultHeaders = {};
      return;
    }

    this.baseUrl = normalizeBaseUrl(config.baseUrl);
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.getAuthToken = config.getAuthToken;
    this.defaultHeaders = config.defaultHeaders ?? {};
  }

  get<T>(endpoint: string, options?: HttpRequestOptions): Promise<Result<T>> {
    return this.request<T>("GET", endpoint, undefined, options);
  }

  getPaginated<T>(
    endpoint: string,
    options?: HttpRequestOptions,
  ): Promise<Result<Paginated<T>>> {
    return this.requestPaginated<T>("GET", endpoint, undefined, options);
  }

  post<T>(
    endpoint: string,
    body: unknown,
    options?: HttpRequestOptions,
  ): Promise<Result<T>> {
    return this.request<T>("POST", endpoint, body, options);
  }

  put<T>(
    endpoint: string,
    body: unknown,
    options?: HttpRequestOptions,
  ): Promise<Result<T>> {
    return this.request<T>("PUT", endpoint, body, {
      allowNull: true,
      ...options,
    });
  }

  delete<T>(
    endpoint: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Promise<Result<T>> {
    return this.request<T>("DELETE", endpoint, body, {
      allowNull: true,
      ...options,
    });
  }

  private async requestPaginated<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    options: HttpRequestOptions = {},
  ): Promise<Result<Paginated<T>>> {
    const { allowNull, init } = toFetchInit(options);
    const url = `${this.baseUrl}${normalizeEndpoint(endpoint)}`;
    const token = (await this.getAuthToken?.()) ?? null;
    const hasAccessToken = Boolean(token);

    const requestContext = {
      method,
      endpoint,
      url,
      hasAccessToken,
      ...(options.tags && { tags: options.tags }),
    };

    setLogContext(requestContext);

    try {
      const response = await fetch(url, {
        ...init,
        method,
        headers: this.buildHeaders(init.headers, body, token),
        ...(body !== undefined && { body: JSON.stringify(body) }),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!response.ok) {
        const result = await toHttpError(response);
        if (!result.success) {
          Logger.error("[HTTP] Request failed", {
            ...requestContext,
            status: response.status,
            error: result.error,
            code: result.code,
          });
        }
        return result;
      }

      const json = (await response.json()) as BackendResponse<T[]>;

      if (!allowNull && (json.data === null || json.data === undefined)) {
        return Err("Respuesta del servidor sin datos", "UNKNOWN");
      }

      if (!json.meta) {
        return Err("Respuesta del servidor sin meta de paginación", "UNKNOWN");
      }

      return Success({
        items: (json.data ?? []) as T[],
        meta: json.meta,
      });
    } catch (error) {
      const result = toNetworkError(error);
      if (!result.success) {
        Logger.error("[HTTP] Network error", {
          ...requestContext,
          error: result.error,
          code: result.code,
        });
      }
      return result;
    }
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    options: HttpRequestOptions = {},
  ): Promise<Result<T>> {
    const { allowNull, init } = toFetchInit(options);
    const url = `${this.baseUrl}${normalizeEndpoint(endpoint)}`;
    const token = (await this.getAuthToken?.()) ?? null;
    const hasAccessToken = Boolean(token);

    const requestContext = {
      method,
      endpoint,
      url,
      hasAccessToken,
      ...(options.tags && { tags: options.tags }),
    };

    setLogContext(requestContext);

    try {
      const response = await fetch(url, {
        ...init,
        method,
        headers: this.buildHeaders(init.headers, body, token),
        ...(body !== undefined && { body: JSON.stringify(body) }),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!response.ok) {
        const result = await toHttpError(response);
        if (!result.success) {
          Logger.error("[HTTP] Request failed", {
            ...requestContext,
            status: response.status,
            error: result.error,
            code: result.code,
          });
        }
        return result;
      }

      const result = await this.parseSuccessBody<T>(response, allowNull);

      if (!result.success) {
        Logger.error("[HTTP] Invalid response body", {
          ...requestContext,
          status: response.status,
          error: result.error,
          code: result.code,
        });
      }

      return result;
    } catch (error) {
      const result = toNetworkError(error);
      if (!result.success) {
        Logger.error("[HTTP] Network error", {
          ...requestContext,
          error: result.error,
          code: result.code,
        });
      }
      return result;
    }
  }

  private buildHeaders(
    extra?: HeadersInit,
    body?: unknown,
    token?: string | null,
  ): Headers {
    const headers = new Headers(this.defaultHeaders);

    if (body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if (extra) {
      new Headers(extra).forEach((value, key) => headers.set(key, value));
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

  private async parseSuccessBody<T>(
    response: Response,
    allowNull: boolean,
  ): Promise<Result<T>> {
    const json = (await response.json()) as BackendResponse<T>;

    if (!allowNull && (json.data === null || json.data === undefined)) {
      return Err("Respuesta del servidor sin datos", "UNKNOWN");
    }

    return Success(json.data as T);
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function normalizeEndpoint(endpoint: string): string {
  return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
}
