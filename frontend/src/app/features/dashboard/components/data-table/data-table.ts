import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TableModule } from 'primeng/table'
import { TagModule } from 'primeng/tag'
import { MilkAnalysis } from '../../../../core/services/infolabo.service'

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss'
})
export class DataTable {
  readonly title = input<string>('Données')
  readonly data = input<MilkAnalysis[]>([])
  readonly selectedRowsChange = output<MilkAnalysis[]>()

  readonly selectedItems = signal<MilkAnalysis[]>([])

  onSelectionChange(event: any): void {
    const selected = event.value || []
    this.selectedItems.set(selected)
    this.selectedRowsChange.emit(selected)
  }
}
