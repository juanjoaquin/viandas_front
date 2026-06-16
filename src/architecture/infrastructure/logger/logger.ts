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

export const Logger = {
  debug(message: string, data?: unknown) {
    if (!shouldLog("debug")) return;
    console.debug(formatMessage("debug", message), data ?? "");
  },

  info(message: string, data?: unknown) {
    if (!shouldLog("info")) return;
    console.info(formatMessage("info", message), data ?? "");
  },

  warn(message: string, data?: unknown) {
    if (!shouldLog("warn")) return;
    console.warn(formatMessage("warn", message), data ?? "");
  },

  error(message: string, data?: unknown) {
    if (!shouldLog("error")) return;
    console.error(formatMessage("error", message), data);
  },
};
