import type { HttpRequestOptions } from "./types";

type NextFetchInit = RequestInit & {
  next?: {
    tags?: string[];
    revalidate?: number | false;
  };
};

/**
 * Traduce opciones agnósticas de cache a la extensión de fetch del runtime (Next.js).
 * Este es el único lugar que conoce el framework.
 */
export function toFetchInit(options: HttpRequestOptions = {}): {
  allowNull: boolean;
  init: NextFetchInit;
} {
  const {
    tags,
    revalidate,
    allowNull = false,
    headers,
    ...rest
  } = options;

  const hasCacheOptions = tags !== undefined || revalidate !== undefined;

  return {
    allowNull,
    init: {
      ...rest,
      headers,
      ...(hasCacheOptions && {
        next: {
          ...(tags !== undefined && { tags }),
          ...(revalidate !== undefined && { revalidate }),
        },
      }),
    },
  };
}
