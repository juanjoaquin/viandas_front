import { Err, type ErrorCode, type Result } from "@/src/libs/result";
import type { BackendResponse } from "./types";

const STATUS_TO_ERROR: Record<number, { message: string; code: ErrorCode }> = {
  400: { message: "Solicitud inválida", code: "VALIDATION" },
  401: { message: "No autorizado", code: "UNAUTHORIZED" },
  403: { message: "Acceso denegado", code: "FORBIDDEN" },
  404: { message: "Recurso no encontrado", code: "NOT_FOUND" },
  409: { message: "Conflicto con el recurso", code: "CONFLICT" },
  422: { message: "Datos inválidos", code: "VALIDATION" },
  408: { message: "Timeout de la solicitud", code: "TIMEOUT" },
};

const DEFAULT_HTTP_ERROR = {
  message: "Error del servidor",
  code: "UNKNOWN" as const,
};

export async function toHttpError(response: Response): Promise<Result<never>> {
  const fallback =
    STATUS_TO_ERROR[response.status] ?? DEFAULT_HTTP_ERROR;

  try {
    const body = (await response.json()) as Partial<BackendResponse<unknown>>;
    const message = body.message?.trim() || fallback.message;
    return Err(message, fallback.code);
  } catch {
    return Err(fallback.message, fallback.code);
  }
}

export function toNetworkError(error: unknown): Result<never> {
  if (error instanceof DOMException) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return Err("La solicitud tardó demasiado tiempo", "TIMEOUT");
    }
  }

  if (error instanceof TypeError) {
    return Err("Error de conexión con el servidor", "UNKNOWN");
  }

  const message =
    error instanceof Error ? error.message : "Error desconocido";
  return Err(message, "UNKNOWN");
}
