/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QRCodeSVG } from 'qrcode.react';
import { CNEB_CURRICULUM, GRADE_PERIODS } from '../constants';
import { Student } from '../types';

interface ReportCardProps {
  student: Student;
  ieName: string;
}

export default function ReportCard({ student, ieName }: ReportCardProps) {
  const currentDate = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const qrValue = `Boleta CNEB\nEst: ${student.name}\nIE: ${ieName}\nGrado: ${student.grade}\nEmisión: ${currentDate}`;

  let globalCompIndex = 0;

  return (
    <div className="doc-oficial font-sans">
      <div className="text-center mb-8 border-b-2 border-slate-900 pb-5 relative">
        <div className="absolute top-0 right-0 text-center flex flex-col items-center">
          <QRCodeSVG value={qrValue} size={80} level="M" />
          <p className="text-[0.6rem] text-slate-500 mt-1 uppercase">Doc. Auténtico</p>
        </div>
        
        <p className="font-bold text-sm">REPÚBLICA DEL PERÚ</p>
        <p className="text-sm">MINISTERIO DE EDUCACIÓN</p>
        <h1 className="text-xl uppercase my-3 max-w-[70%] mx-auto font-medium">
          INFORME DE PROGRESO DE LAS COMPETENCIAS DEL ESTUDIANTE
        </h1>
        <p className="text-xs text-slate-500 uppercase">Educación Básica Regular - Nivel de Educación Secundaria</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 border border-slate-200 rounded-md">
        <div className="space-y-1">
          <p className="text-sm"><strong>DRE / UGEL:</strong> <span className="border-b border-dashed border-slate-400 px-2 text-slate-600">(Completar)</span></p>
          <p className="text-sm"><strong>Institución Educativa:</strong> <span className="text-slate-600">{ieName || 'Sin Registro'}</span></p>
        </div>
        <div className="space-y-1">
          <p className="text-sm"><strong>Estudiante:</strong> <span className="text-slate-600">{student.name}</span></p>
          <p className="text-sm"><strong>Grado y Sección:</strong> <span className="text-slate-600">{student.grade || 'No especificado'}</span></p>
          <p className="text-sm"><strong>Fecha de Emisión:</strong> <span className="text-slate-600">{currentDate}</span></p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th className="w-1/4 uppercase">Área Curricular</th>
            <th className="w-1/2 uppercase">Competencias a Evaluar</th>
            <th className="w-10">B1</th>
            <th className="w-10">B2</th>
            <th className="w-10">B3</th>
            <th className="w-10">B4</th>
            <th className="w-10 bg-slate-200 font-bold">FINAL</th>
          </tr>
        </thead>
        <tbody>
          {CNEB_CURRICULUM.map((areaData, areaIndex) => (
            <tr key={areaIndex} className="border-b border-slate-300">
              <td className="font-bold align-top py-2 px-2 border-r border-slate-300">
                {areaData.area}
              </td>
              <td className="p-0 border-r border-slate-300">
                <table className="m-0 w-full border-none">
                  <tbody>
                    {areaData.competences.map((comp, compInAreaIndex) => {
                      const compIndex = globalCompIndex++;
                      const grades = student.grades[compIndex] || { b1: '-', b2: '-', b3: '-', b4: '-', final: '-' };
                      
                      return (
                        <tr key={compInAreaIndex} className={compInAreaIndex < areaData.competences.length - 1 ? "border-b border-slate-200" : ""}>
                          <td className="border-none py-1.5 px-2">{comp}</td>
                          {GRADE_PERIODS.map((period, i) => (
                            <td 
                              key={period} 
                              className={`w-10 text-center font-bold border-l border-slate-200 ${i === 4 ? "bg-slate-50" : ""}`}
                            >
                              {grades[period] === '-' ? '' : grades[period]}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 p-3 border border-slate-200 bg-slate-50 rounded text-[0.65rem] flex gap-4 flex-wrap uppercase text-slate-600">
        <strong>ESCALA:</strong>
        <span><strong>AD:</strong> Logro Destacado</span>
        <span><strong>A:</strong> Logro Esperado</span>
        <span><strong>B:</strong> En Proceso</span>
        <span><strong>C:</strong> En Inicio</span>
      </div>

      <div className="flex justify-between mt-16 px-12 text-center text-slate-800 no-print-break">
        <div>
          <div className="border-t border-slate-900 w-[200px] mb-2 mx-auto"></div>
          <p className="text-xs">Firma del Tutor(a)</p>
        </div>
        <div>
          <div className="border-t border-slate-900 w-[200px] mb-2 mx-auto"></div>
          <p className="text-xs font-bold">Firma del Director(a)</p>
          <p className="text-[0.6rem] mt-1 text-slate-500 uppercase">Sello de la I.E.</p>
        </div>
      </div>
    </div>
  );
}
