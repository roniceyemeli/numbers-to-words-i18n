export interface LanguageData {
  ones: string[];
  teens: string[];
  tens: string[];
  hundreds?: string[];
  scales: string[];
  hundred?: string;
  zero: string;
  negative: string;
  point: string;
}

export interface LanguageConverter {
  convertInteger(num: number): string;
  convertWithScales(num: number): string;
  getScaleWord?(quotient: number, scale: string): string;
  getScaleWords?(quotient: number, scaleIndex: number): string;
}

export interface LanguageModule {
  code: string;
  data: LanguageData;
  converter: LanguageConverter;
}
