import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider'
import { MilkAnalysis } from '../../../../core/services/infolabo.service'

@Component({
  selector: 'app-ai-gemini',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TextareaModule, DividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ai-gemini.html',
  styleUrl: './ai-gemini.scss'
})
export class AiGeminiComponent {
  readonly analysis = input<MilkAnalysis | null>(null)
  readonly generateAnalysis = output<MilkAnalysis>()

  readonly isLoading = signal(false)
  reportContent: string = ''

  onGenerateAnalysis(): void {
    const analysis = this.analysis()
    if (analysis) {
      this.isLoading.set(true)
      setTimeout(() => {
        this.reportContent = this.buildAnalysisReport(analysis)
        this.isLoading.set(false)
        this.generateAnalysis.emit(analysis)
      }, 1500)
    }
  }

  private buildAnalysisReport(analysis: MilkAnalysis): string {
    return `RAPPORT D'ANALYSE LAITIÈRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Producteur: ${analysis.producerName}
Exploitation: ${analysis.exploitation}
Date de Prélèvement: ${analysis.sampleDate}
Numéro Producteur: ${analysis.producerId}

RÉSULTATS ANALYTIQUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Taux de Matière Grasse: ${analysis.metrics.fatRate ?? 'N/A'}%
Taux de Protéine: ${analysis.metrics.proteinRate ?? 'N/A'}%
Cellules Somatiques: ${analysis.metrics.somaticCells ?? 'N/A'} /mL
Cryoscopie: ${analysis.metrics.cryoscopy ?? 'N/A'}°C

DIAGNOSTIC IA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Statut: ${analysis.status}
${analysis.status === 'ALERTE' ? 'ALERTE DÉTECTÉE' : 'CONFORME'}

Recommandations:
- Surveiller régulièrement les paramètres de qualité
- Optimiser les conditions d'hygiène de traite
- Adapter l'alimentation selon les résultats

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rapport généré par Gemini AI pour LDA39
`
  }
}
