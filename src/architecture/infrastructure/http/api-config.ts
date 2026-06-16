import { HttpClient } from "./http-client";

export const API_CONFIG = {
  baseUrl: process.env.API_BASE_URL ?? "http://localhost:8080",
} as const;

let sharedClient: HttpClient | null = null;

export function createHttpClient(
  getAuthToken?: () => string | null | Promise<string | null>,
): HttpClient {
  return new HttpClient({
    baseUrl: API_CONFIG.baseUrl,
    getAuthToken,
  });
}

/** Cliente singleton para uso en repositories. Configurar token con `setAuthTokenGetter`. */
export function getHttpClient(): HttpClient {
  if (!sharedClient) {
    sharedClient = createHttpClient(authTokenGetter ?? undefined);
  }
  return sharedClient;
}

let authTokenGetter: (() => string | null | Promise<string | null>) | null =
  null;

export function setAuthTokenGetter(
  getter: () => string | null | Promise<string | null>,
): void {
  authTokenGetter = getter;
  sharedClient = null;
}
