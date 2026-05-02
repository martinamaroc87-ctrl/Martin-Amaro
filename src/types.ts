/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GradeValue = 'AD' | 'A' | 'B' | 'C' | '-';

export interface CompetenceGrades {
  b1: GradeValue;
  b2: GradeValue;
  b3: GradeValue;
  b4: GradeValue;
  final: GradeValue;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  // Map of competence index to grades
  grades: Record<number, CompetenceGrades>;
}

export interface CurricularArea {
  area: string;
  competences: string[];
}
