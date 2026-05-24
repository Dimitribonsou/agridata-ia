import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TableModule } from 'primeng/table'
import { TagModule } from 'primeng/tag'
import { MilkAnalysis, InfoLaboStore } from '../../../../core/services/infolabo.service'

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
  analyseService= inject(InfoLaboStore);

  readonly selectedItems = signal<MilkAnalysis[]>([])

  onSelectionChange(event: any): void {
    const selected = event.value || []
    this.analyseService.toggleSelection(selected.map((item: MilkAnalysis) => item.id))
    this.selectedItems.set(selected)
    this.selectedRowsChange.emit(selected)
  }
}
