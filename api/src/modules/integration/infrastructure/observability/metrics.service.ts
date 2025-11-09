import { Injectable, Logger } from '@nestjs/common';

interface MetricValue {
  count: number;
  sum: number;
  min: number;
  max: number;
  buckets: Map<number, number>;
}

interface CounterMetric {
  value: number;
  labels: Record<string, string>;
}

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private readonly histograms = new Map<string, Map<string, MetricValue>>();
  private readonly counters = new Map<string, Map<string, CounterMetric>>();

  recordHttpDuration(endpoint: string, durationMs: number): void {
    const metricName = 'integration_http_request_duration_ms';
    const labelKey = `endpoint=${endpoint}`;

    this.recordHistogram(metricName, labelKey, durationMs);
  }

  incrementHttpRequest(endpoint: string, statusCode: number): void {
    const metricName = 'integration_http_requests_total';
    const labelKey = `endpoint=${endpoint},status_code=${statusCode}`;

    this.incrementCounter(metricName, {
      endpoint,
      status_code: String(statusCode),
    });
  }

  incrementSchemaValidationFailure(field: string): void {
    const metricName = 'integration_schema_validation_failures_total';
    this.incrementCounter(metricName, { field });
  }

  incrementMapperUnknownValue(field: string, value: string): void {
    const metricName = 'integration_mapper_unknown_values_total';
    this.incrementCounter(metricName, { field, value });
  }

  private recordHistogram(name: string, labelKey: string, value: number): void {
    if (!this.histograms.has(name)) {
      this.histograms.set(name, new Map());
    }

    const labelMap = this.histograms.get(name)!;

    if (!labelMap.has(labelKey)) {
      labelMap.set(labelKey, {
        count: 0,
        sum: 0,
        min: Infinity,
        max: -Infinity,
        buckets: new Map([
          [10, 0],
          [50, 0],
          [100, 0],
          [500, 0],
          [1000, 0],
          [5000, 0],
          [10000, 0],
          [Infinity, 0],
        ]),
      });
    }

    const metric = labelMap.get(labelKey)!;
    metric.count++;
    metric.sum += value;
    metric.min = Math.min(metric.min, value);
    metric.max = Math.max(metric.max, value);

    for (const [bucket, count] of metric.buckets) {
      if (value <= bucket) {
        metric.buckets.set(bucket, count + 1);
      }
    }
  }

  private incrementCounter(name: string, labels: Record<string, string>): void {
    const labelKey = Object.entries(labels)
      .map(([k, v]) => `${k}=${v}`)
      .sort()
      .join(',');

    if (!this.counters.has(name)) {
      this.counters.set(name, new Map());
    }

    const labelMap = this.counters.get(name)!;

    if (!labelMap.has(labelKey)) {
      labelMap.set(labelKey, { value: 0, labels });
    }

    const counter = labelMap.get(labelKey)!;
    counter.value++;
  }

  getMetrics(): string {
    const lines: string[] = [];

    for (const [name, labelMap] of this.histograms) {
      lines.push(`# TYPE ${name} histogram`);

      for (const [labelKey, metric] of labelMap) {
        const labels = labelKey ? `{${labelKey}}` : '';

        lines.push(`${name}_count${labels} ${metric.count}`);
        lines.push(`${name}_sum${labels} ${metric.sum}`);

        for (const [bucket, count] of metric.buckets) {
          const le = bucket === Infinity ? '+Inf' : bucket;
          lines.push(
            `${name}_bucket{${labelKey ? labelKey + ',' : ''}le="${le}"} ${count}`,
          );
        }
      }
    }

    for (const [name, labelMap] of this.counters) {
      lines.push(`# TYPE ${name} counter`);

      for (const [labelKey, counter] of labelMap) {
        const labels = labelKey ? `{${labelKey}}` : '';
        lines.push(`${name}${labels} ${counter.value}`);
      }
    }

    return lines.join('\n');
  }

  getSummary(): Record<string, any> {
    const summary: Record<string, any> = {};

    for (const [name, labelMap] of this.histograms) {
      summary[name] = {};
      for (const [labelKey, metric] of labelMap) {
        summary[name][labelKey] = {
          count: metric.count,
          avg: metric.count > 0 ? metric.sum / metric.count : 0,
          min: metric.min === Infinity ? 0 : metric.min,
          max: metric.max === -Infinity ? 0 : metric.max,
        };
      }
    }

    for (const [name, labelMap] of this.counters) {
      summary[name] = {};
      for (const [labelKey, counter] of labelMap) {
        summary[name][labelKey] = counter.value;
      }
    }

    return summary;
  }
}
