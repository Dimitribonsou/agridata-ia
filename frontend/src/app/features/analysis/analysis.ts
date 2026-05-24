import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { AnalysisListComponent } from './components/analysis-list/analysis-list'
import { PreviewPaneComponent } from './components/preview-pane/preview-pane'
import { InfoLaboStore, MilkAnalysis } from '../../core/services/infolabo.service'

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, ButtonModule, AnalysisListComponent, PreviewPaneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analysis.html',
  styleUrl: './analysis.scss'
})
export class Analysis {
  private readonly store = inject(InfoLaboStore)
  private readonly router = inject(Router)

  readonly selectedAnalyses = this.store.selectedAnalyses
  private readonly selectedProducerId = signal<string | null>(null)
  readonly selectedAnalysis = computed(() => {
    const analyses = this.selectedAnalyses()
    const producerId = this.selectedProducerId()
    return analyses.find(a => a.id === producerId) ?? (analyses.length > 0 ? analyses[0] : null)
  })

  readonly hasSelection = computed(() => this.selectedAnalyses().length > 0)

  onAnalysisSelected(analysis: MilkAnalysis): void {
    this.selectedProducerId.set(analysis.id)
  }

  onBackToDashboard(): void {
    this.router.navigate(['/dashboard'])
  }
}
