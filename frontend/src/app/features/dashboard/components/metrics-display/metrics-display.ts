import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { InfoLaboStore } from '../../../../core/services/infolabo.service';
import { MetricCardComponent } from '../metric-card/metric-card';

@Component({
  selector: 'app-metrics-display',
  standalone: true,
  imports: [DecimalPipe, MetricCardComponent],
  templateUrl: './metrics-display.html'
})
export class MetricsDisplay {
  private store = inject(InfoLaboStore);


}