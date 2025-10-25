export class PerformanceMonitor {
  constructor();
  init(): void;
  collectLoadMetrics(): void;
  observeUserTiming(): void;
  sendMetrics(): void;
  mark(name: string): void;
  measure(name: string, startMark: string, endMark: string): void;
}

export const performanceMonitor: PerformanceMonitor;