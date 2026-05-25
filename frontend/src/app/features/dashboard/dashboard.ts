import { Component, inject, signal } from '@angular/core';
import { MetricsDisplay } from "./components/metrics-display/metrics-display";
import { DataTable } from "./components/data-table/data-table";
import { InfoLaboStore, MilkAnalysis } from '../../core/services/infolabo.service';
@Component({
  selector: 'app-dashboard',
  imports: [MetricsDisplay, DataTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly AnalyseData:MilkAnalysis[] = inject(InfoLaboStore).analyses()
  analyses:MilkAnalysis[]=this.AnalyseData
}
