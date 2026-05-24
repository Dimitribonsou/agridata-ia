import { Injectable, computed, signal } from '@angular/core';

export interface MilkMetrics {
  fatRate?: number | null;
  proteinRate?: number | null;
  somaticCells?: number | null;
  cryoscopy?: number | null;
}

export interface MilkAnalysis {
  id: string;
  producerName: string;
  email: string;
  sampleDate: string;
  status: 'PENDING' | 'CRITICAL' | 'NORMAL';
  metrics: MilkMetrics;
}

@Injectable({
  providedIn: 'root'
})
export class InfoLaboStore {
  private _analyses = signal<MilkAnalysis[]>([
    {
      id: '1',
      producerName: 'Élevage du Grand Jean',
      email: 'jean.valjean@example.com',
      sampleDate: '2026-05-20',
      status: 'CRITICAL',
      metrics: {
        fatRate: 38.5,
        proteinRate: 32.1,
        somaticCells: 310000,
        cryoscopy: -0.520
      }
    },
    {
      id: '2',
      producerName: 'Ferme des Plaines',
      email: 'contact@fermedesplaines.com',
      sampleDate: '2026-05-21',
      status: 'NORMAL',
      metrics: {
        fatRate: 41.2,
        proteinRate: null,
        somaticCells: 120000,
        cryoscopy: -0.535
      }
    },
    {
      id: '3',
      producerName: 'GAEC du Bois Joli',
      email: 'gaec.boisjoli@example.com',
      sampleDate: '2026-05-22',
      status: 'PENDING',
      metrics: {
        fatRate: undefined,
        proteinRate: 34.0,
        somaticCells: undefined,
        cryoscopy: null
      }
    }
  ]);

  private _selectedAnalysisIds = signal<string[]>([]);

  analyses = this._analyses.asReadonly();
  selectedAnalysisIds = this._selectedAnalysisIds.asReadonly();

  selectedAnalyses = computed(() => {
    const currentAnalyses = this._analyses();
    const currentIds = this._selectedAnalysisIds();
    return currentAnalyses.filter(analysis => currentIds.includes(analysis.id));
  });

  toggleSelection(id: string): void {
    this._selectedAnalysisIds.update(ids =>
      ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id]
    );
  }

  clearSelection(): void {
    this._selectedAnalysisIds.set([]);
  }
}