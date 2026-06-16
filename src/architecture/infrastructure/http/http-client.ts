import { Err, Success, type Result } from "@/src/libs/result";
import { toFetchInit } from "./fetchAdapter";
import { toHttpError, toNetworkError } from "./httpErrors";
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
    return this.request<T>("PUT", endpoint, body, options);
  }

  delete<T>(
    endpoint: string,
    options?: HttpRequestOptions,
  ): Promise<Result<T>> {
    return this.request<T>("DELETE", endpoint, undefined, {
      allowNull: true,
      ...options,
    });
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    options: HttpRequestOptions = {},
  ): Promise<Result<T>> {
    const { allowNull, init } = toFetchInit(options);
    const url = `${this.baseUrl}${normalizeEndpoint(endpoint)}`;

    try {
      const response = await fetch(url, {
        ...init,
        method,
        headers: await this.buildHeaders(init.headers, body),
        ...(body !== undefined && { body: JSON.stringify(body) }),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!response.ok) {
        return toHttpError(response);
      }

      return this.parseSuccessBody<T>(response, allowNull);
    } catch (error) {
      return toNetworkError(error);
    }
  }

  private async buildHeaders(
    extra?: HeadersInit,
    body?: unknown,
  ): Promise<Headers> {
    const headers = new Headers(this.defaultHeaders);

    if (body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if (extra) {
      new Headers(extra).forEach((value, key) => headers.set(key, value));
    }

    const token = await this.getAuthToken?.();
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
