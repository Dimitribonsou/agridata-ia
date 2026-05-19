import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metricFormatter',
})
export class MetricFormatterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
