import { getLogContext } from "./log-context";

type LogLevel = "debug" | "info" | "warn" | "error";

const isProd = process.env.NODE_ENV === "production";

const shouldLog = (level: LogLevel) => {
  if (!isProd) return true;
  return level === "error" || level === "warn";
};

const formatMessage = (level: LogLevel, message: string) => {
  const time = new Date().toISOString();
  return `[${time}] [${level.toUpperCase()}] ${message}`;
};

function mergeLogData(data?: unknown): unknown {
  const context = getLogContext();
  const hasContext = Object.keys(context).length > 0;

  if (data === undefined) {
    return hasContext ? context : undefined;
  }

  if (data instanceof Error) {
    return {
      ...context,
      error: data.message,
      name: data.name,
      stack: data.stack,
    };
  }

  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    return { ...context, ...(data as Record<string, unknown>) };
  }

  return hasContext ? { ...context, detail: data } : data;
}

function writeLog(
  level: LogLevel,
  writer: (...args: unknown[]) => void,
  message: string,
  data?: unknown,
) {
  if (!shouldLog(level)) return;

  const merged = mergeLogData(data);
  if (merged === undefined) {
    writer(formatMessage(level, message));
    return;
  }

  writer(formatMessage(level, message), merged);
}

export const Logger = {
  debug(message: string, data?: unknown) {
    writeLog("debug", console.debug, message, data);
  },

  info(message: string, data?: unknown) {
    writeLog("info", console.info, message, data);
  },

  warn(message: string, data?: unknown) {
    writeLog("warn", console.warn, message, data);
  },

  error(message: string, data?: unknown) {
    writeLog("error", console.error, message, data);
  },
};

export { setLogContext, getLogContext } from "./log-context";
export type { LogContext } from "./log-context";
