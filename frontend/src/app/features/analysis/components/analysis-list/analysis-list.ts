import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ListboxModule } from 'primeng/listbox'
import { TagModule } from 'primeng/tag'
import { MilkAnalysis } from '../../../../core/services/infolabo.service'

@Component({
  selector: 'app-analysis-list',
  standalone: true,
  imports: [CommonModule, ListboxModule, TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analysis-list.html',
})
export class AnalysisListComponent {
  readonly data = input<MilkAnalysis[]>([])
  readonly selectionChange = output<MilkAnalysis>()

  onSelectionChange(event: any): void {
    if (event.value) {
      this.selectionChange.emit(event.value)
    }
  }

  getSeverity(status: string): string {
    return status === 'ALERTE' ? 'danger' : 'success'
  }
}
