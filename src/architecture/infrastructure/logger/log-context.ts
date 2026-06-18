import { AsyncLocalStorage } from "node:async_hooks";

export type LogContext = Record<string, unknown>;

const storage = new AsyncLocalStorage<LogContext>();

export function setLogContext(context: LogContext): void {
  const current = storage.getStore() ?? {};
  storage.enterWith({ ...current, ...context });
}

export function getLogContext(): LogContext {
  return storage.getStore() ?? {};
}
