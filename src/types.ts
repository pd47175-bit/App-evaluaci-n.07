/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EducationalLevel = 'Básico' | 'Medio' | 'Superior';

export type AssessmentPeriod = 
  | 'Bimestre 1' | 'Bimestre 2' | 'Bimestre 3' | 'Bimestre 4' | 'Bimestre 5'
  | 'Trimestre 1' | 'Trimestre 2' | 'Trimestre 3'
  | 'Semestre 1' | 'Semestre 2';

export interface Criterion {
  id: string;
  name: string;
  weight: number; // percentage (e.g., 30 for 30%)
  description: string;
  ratingType: 'numeric' | 'scale' | 'checklist'; 
}

export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  riskStatus: 'Excelente' | 'Normal' | 'En Riesgo';
  observations: string;
}

export interface Grade {
  studentId: string;
  criterionId: string;
  score: number; // standardized to scale 0 - 10
}

export interface StudentCompetency {
  subject: string;
  score: number;
}

export interface HistoricalGroupStats {
  period: string;
  average: number;
}

export interface AppConfig {
  googleSheetsUrl: string;
  educationalLevel: EducationalLevel;
  period: AssessmentPeriod;
}
