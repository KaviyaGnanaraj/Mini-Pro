export interface StudentRecord {
  [key: string]: string | number;
}

export interface ColumnStats {
  field: string;
  average: number;
  min: number;
  max: number;
  passingRate?: number;
}

export interface AIAnalysisResult {
  summary: string;
  keyTrends: string[];
  recommendations: string[];
  pythonScript: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface ChartDataPoint {
  name: string;
  [key: string]: number | string;
}