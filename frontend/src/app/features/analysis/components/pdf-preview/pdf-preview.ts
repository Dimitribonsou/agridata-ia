import { Component, ChangeDetectionStrategy, input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MilkAnalysis } from '../../../../core/services/infolabo.service'

@Component({
  selector: 'app-pdf-preview',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pdf-preview.html',
  styleUrl: './pdf-preview.scss'
})
export class PdfPreviewComponent {
  readonly analysis = input<MilkAnalysis | null>(null)
}
