
export enum Scenario {
  SSP126 = 'SSP1-2.6 (저탄소)',
  SSP585 = 'SSP5-8.5 (고탄소)'
}

export enum Resolution {
  YEARLY = '연별',
  MONTHLY = '월별',
  SEASONAL = '계절별'
}

export enum Period {
  PRESENT = '현재 (2020s)',
  EARLY = '전반기 (2040s)',
  MID = '중반기 (2060s)',
  LATE = '후반기 (2080s)'
}

export interface RiskData {
  id: string;
  name: string;
  value: string;
  unit: string;
  insight: string;
  refDate: string;
  updateCycle: string;
  provider: string;
  range: string;
  trend: number[]; // simple data for sparkline
}

export interface RegionInfo {
  id: string;
  name: string;
  risks: RiskData[];
}
