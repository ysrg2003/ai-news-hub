/**
 * Performance Monitoring System
 * Tracks and reports web vitals and performance metrics
 */

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  if (!("PerformanceObserver" in window)) {
    console.warn("PerformanceObserver not supported");
    return;
  }

  // Monitor Largest Contentful Paint (LCP)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      reportMetric("LCP", lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
  } catch (error) {
    console.error("LCP observer error:", error);
  }

  // Monitor Cumulative Layout Shift (CLS)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          reportMetric("CLS", clsValue);
        }
      }
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });
  } catch (error) {
    console.error("CLS observer error:", error);
  }

  // Monitor First Input Delay (FID)
  try {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        reportMetric("FID", (entry as any).processingDuration);
      });
    });
    fidObserver.observe({ entryTypes: ["first-input"] });
  } catch (error) {
    console.error("FID observer error:", error);
  }
}

/**
 * Get page load time
 */
export function getPageLoadTime(): number {
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  if (!navigation) return 0;
  return navigation.loadEventEnd - navigation.fetchStart;
}

/**
 * Get First Contentful Paint (FCP)
 */
export function getFirstContentfulPaint(): number {
  const fcp = performance.getEntriesByName("first-contentful-paint")[0];
  return fcp ? fcp.startTime : 0;
}

/**
 * Get Time to Interactive (TTI)
 */
export function getTimeToInteractive(): number {
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  if (!navigation) return 0;
  return navigation.domInteractive - navigation.fetchStart;
}

/**
 * Report performance metric
 */
function reportMetric(name: string, value: number) {
  // Send to analytics service
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "page_view", {
      metric_name: name,
      metric_value: value,
    });
  }

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`);
  }
}

/**
 * Get all performance metrics
 */
export function getAllMetrics(): PerformanceMetrics {
  return {
    pageLoadTime: getPageLoadTime(),
    firstContentfulPaint: getFirstContentfulPaint(),
    largestContentfulPaint: 0, // Will be updated by observer
    cumulativeLayoutShift: 0, // Will be updated by observer
    firstInputDelay: 0, // Will be updated by observer
    timeToInteractive: getTimeToInteractive(),
  };
}

/**
 * Measure function execution time
 */
export function measureExecutionTime(
  functionName: string,
  fn: () => void
): number {
  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;

  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${functionName}: ${duration.toFixed(2)}ms`);
  }

  return duration;
}

/**
 * Measure async function execution time
 */
export async function measureAsyncExecutionTime(
  functionName: string,
  fn: () => Promise<void>
): Promise<number> {
  const start = performance.now();
  await fn();
  const end = performance.now();
  const duration = end - start;

  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${functionName}: ${duration.toFixed(2)}ms`);
  }

  return duration;
}
