export type LogLevel = 'info' | 'warning' | 'error';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  details: string;
}

export const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  info: 'blue',
  warning: 'orange',
  error: 'red',
};