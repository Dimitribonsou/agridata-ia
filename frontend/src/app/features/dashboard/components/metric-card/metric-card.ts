import { Component, input } from '@angular/core';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [Card],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.scss', 
})
export class MetricCardComponent {
  title = input.required<string>();
  value = input.required<string | number>();
  icon = input.required<string>();
  colorClass = input.required<string>();
}