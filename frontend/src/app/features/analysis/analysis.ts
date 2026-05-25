import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { DividerModule } from 'primeng/divider'
import { AiGeminiComponent } from './components/ai-gemini/ai-gemini'
import { PdfPreviewComponent } from './components/pdf-preview/pdf-preview'
import { InfoLaboStore, MilkAnalysis } from '../../core/services/infolabo.service'

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, ButtonModule, DividerModule, AiGeminiComponent, PdfPreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analysis.html',
  styleUrl: './analysis.scss'
})
export class Analysis {
  private readonly store = inject(InfoLaboStore)
  private readonly router = inject(Router)

  readonly selectedAnalyses = this.store.selectedAnalyses
  private readonly currentIndex = signal(0)

  readonly currentAnalysis = computed(() => {
    const analyses = this.selectedAnalyses()
    const index = this.currentIndex()
    return analyses[index] ?? null
  })

  readonly hasSelection = computed(() => this.selectedAnalyses().length > 0)
  readonly isFirstAnalysis = computed(() => this.currentIndex() === 0)
  readonly isLastAnalysis = computed(() => this.currentIndex() === this.selectedAnalyses().length - 1)
  readonly progressText = computed(() => {
    const index = this.currentIndex()
    const total = this.selectedAnalyses().length
    return `${index + 1}/${total}`
  })

  onPreviousAnalysis(): void {
    if (!this.isFirstAnalysis()) {
      this.currentIndex.update(i => i - 1)
    }
  }

  onNextAnalysis(): void {
    if (!this.isLastAnalysis()) {
      this.currentIndex.update(i => i + 1)
    }
  }

  onDownloadPdf(): void {
    const analysis = this.currentAnalysis()
    if (analysis) {
      window.print()
    }
  }

  onConfigureShipping(): void {
    this.router.navigate(['/shipping'])
  }

  onBackToDashboard(): void {
    this.router.navigate(['/dashboard'])
  }
}
