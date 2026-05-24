import { Component } from '@angular/core';
import { MetricsDisplay } from "./components/metrics-display/metrics-display";

@Component({
  selector: 'app-dashboard',
  imports: [MetricsDisplay],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
