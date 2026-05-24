import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { DividerModule } from 'primeng/divider'
import { Router } from '@angular/router'
import { MilkAnalysis } from '../../../../core/services/infolabo.service'

@Component({
  selector: 'app-preview-pane',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, DividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './preview-pane.html',
})
export class PreviewPaneComponent {
  readonly analysis = input<MilkAnalysis | null>(null)
  private readonly router = inject(Router)

  onValidate(): void {
    this.router.navigate(['/shipping'])
  }
}
