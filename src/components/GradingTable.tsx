/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CNEB_CURRICULUM, GRADE_PERIODS } from '../constants';
import { Student, GradeValue, CompetenceGrades } from '../types';
import { cn } from '../lib/utils';

interface GradingTableProps {
  student: Student;
  onGradeChange: (compIndex: number, period: keyof CompetenceGrades, value: GradeValue) => void;
}

export default function GradingTable({ student, onGradeChange }: GradingTableProps) {
  let globalCompIndex = 0;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="w-1/5">Área Curricular</th>
            <th className="w-2/5">Competencia CNEB</th>
            <th className="w-12">B1</th>
            <th className="w-12">B2</th>
            <th className="w-12">B3</th>
            <th className="w-12">B4</th>
            <th className="w-12 bg-slate-200">FINAL</th>
          </tr>
        </thead>
        <tbody>
          {CNEB_CURRICULUM.map((areaData, areaIndex) => (
            <React.Fragment key={areaIndex}>
              {areaData.competences.map((comp, compInAreaIndex) => {
                const compIndex = globalCompIndex++;
                const grades = student.grades[compIndex] || { b1: '-', b2: '-', b3: '-', b4: '-', final: '-' };

                return (
                  <tr key={compInAreaIndex} className="hover:bg-slate-50">
                    {compInAreaIndex === 0 && (
                      <td rowSpan={areaData.competences.length} className="font-bold align-top">
                        {areaData.area}
                      </td>
                    )}
                    <td>{comp}</td>
                    {GRADE_PERIODS.map((period) => (
                      <td key={period} className="p-1">
                        <select
                          className={cn(
                            "grade-select",
                            grades[period] === 'AD' && "text-blue-700 bg-blue-50",
                            grades[period] === 'C' && "text-red-700 bg-red-50",
                            period === 'final' && "bg-slate-100"
                          )}
                          value={grades[period]}
                          onChange={(e) => onGradeChange(compIndex, period as keyof CompetenceGrades, e.target.value as GradeValue)}
                        >
                          <option value="-">-</option>
                          <option value="AD">AD</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
