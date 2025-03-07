
/**
 * Application Logger and Error Tracking Utility
 * Provides consistent logging and error reporting mechanisms.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  module?: string;
  data?: unknown;
}

// Function to check if we're in development environment
const isDev = (): boolean => {
  return process.env.NODE_ENV !== 'production';
};

// Set this to true to see debug logs in production
const FORCE_DEBUG = false;

/**
 * Log a message with optional data
 */
export const log = (
  level: LogLevel,
  message: string,
  options: LogOptions = {}
): void => {
  const { module, data } = options;
  const timestamp = new Date().toISOString();
  const prefix = module ? `[${module}]` : '';

  // Only show debug logs in development unless forced
  if (level === 'debug' && !isDev() && !FORCE_DEBUG) {
    return;
  }

  const logFn = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error
  }[level];

  if (data) {
    logFn(`${timestamp} ${prefix} ${message}`, data);
  } else {
    logFn(`${timestamp} ${prefix} ${message}`);
  }

  // In production, we could send errors to a monitoring service
  if (level === 'error' && !isDev()) {
    // Example integration point for error monitoring service
    // sendErrorToMonitoringService(message, data);
  }
};

/**
 * Helper functions for different log levels
 */
export const logger = {
  debug: (message: string, options?: LogOptions) => log('debug', message, options),
  info: (message: string, options?: LogOptions) => log('info', message, options),
  warn: (message: string, options?: LogOptions) => log('warn', message, options),
  error: (message: string, options?: LogOptions) => log('error', message, options),
};

/**
 * Error handler that logs errors and can be used with try/catch
 */
export const handleError = (error: unknown, module?: string): void => {
  if (error instanceof Error) {
    logger.error(error.message, {
      module,
      data: {
        stack: error.stack,
        name: error.name
      }
    });
  } else {
    logger.error('An unknown error occurred', {
      module,
      data: error
    });
  }
};

export default logger;
