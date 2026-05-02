/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  Database, 
  Upload, 
  User, 
  GraduationCap,
  Save
} from 'lucide-react';
import { Student } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  ieName: string;
  setIeName: (name: string) => void;
  students: Student[];
  onAddStudent: (name: string, grade: string) => void;
  onDeleteStudent: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
  onSelectStudent: (id: string) => void;
  selectedId: string | null;
  onExportExcel: () => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Sidebar({
  ieName,
  setIeName,
  students,
  onAddStudent,
  onDeleteStudent,
  onSelectStudent,
  selectedId,
  onExportExcel,
  onExportJson,
  onImportJson
}: SidebarProps) {
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddStudent(newName, newGrade);
    setNewName('');
    setNewGrade('');
  };

  return (
    <aside className="sidebar w-80 bg-sidebar-bg text-white flex flex-col shadow-xl z-10 no-print">
      <div className="p-5 bg-slate-950 text-center border-b border-sidebar-hover">
        <h2 className="text-lg font-medium tracking-wider">EduBoleta PRO</h2>
        <span className="text-slate-400 text-[0.7rem] uppercase">Evaluación Bimestral</span>
      </div>

      <div className="p-5 border-b border-sidebar-hover">
        <h3 className="text-[0.75rem] uppercase text-slate-400 mb-4 tracking-tighter flex items-center gap-2">
          <Database size={14} /> 1. Datos de la I.E.
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            className="w-full p-2.5 border border-sidebar-hover rounded-md bg-slate-900 text-white outline-none focus:border-minedu-red transition-all text-sm"
            placeholder="Nombre de la Institución"
            value={ieName}
            onChange={(e) => setIeName(e.target.value)}
          />
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col overflow-hidden">
        <h3 className="text-[0.75rem] uppercase text-slate-400 mb-4 tracking-tighter flex items-center gap-2">
          <GraduationCap size={14} /> 2. Registro de Estudiantes
        </h3>
        
        <div className="space-y-2 mb-4">
          <input
            type="text"
            className="w-full p-2.5 border border-sidebar-hover rounded-md bg-slate-900 text-white text-sm focus:border-minedu-red outline-none"
            placeholder="Apellidos y Nombres"
            value={newName}
            onChange={(e) => setNewName(e.target.value.toUpperCase())}
          />
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2.5 border border-sidebar-hover rounded-md bg-slate-900 text-white text-sm focus:border-minedu-red outline-none"
              placeholder="Grado y Sección"
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button
              onClick={handleAdd}
              className="bg-minedu-red hover:bg-minedu-dark text-white p-2.5 rounded-md transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 py-4 border-y border-sidebar-hover border-dashed">
          {students.map((student) => (
            <div
              key={student.id}
              onClick={() => onSelectStudent(student.id)}
              className={cn(
                "p-3 rounded-md cursor-pointer flex justify-between items-center group transition-all text-sm",
                selectedId === student.id ? "bg-minedu-red font-medium" : "hover:bg-sidebar-hover text-slate-300"
              )}
            >
              <div className="flex flex-col gap-0.5 truncate">
                <span className="truncate flex items-center gap-2">
                  <User size={14} className={selectedId === student.id ? "text-white" : "text-slate-400"} />
                  {student.name}
                </span>
                <span className={cn(
                  "text-[0.7rem] ml-5",
                  selectedId === student.id ? "text-white/80" : "text-slate-500"
                )}>
                  {student.grade || 'Sin grado'}
                </span>
              </div>
              <button
                onClick={(e) => onDeleteStudent(student.id, e)}
                className="text-slate-400 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {students.length === 0 && (
            <div className="text-center text-slate-500 text-xs py-10 italic">
              Sin estudiantes registrados
            </div>
          )}
        </div>
      </div>

      <div className="p-5 space-y-2 bg-slate-950/30">
        <p className="text-[0.65rem] text-slate-500 text-center mb-2 uppercase font-bold">Descargas y Respaldo</p>
        
        <button
          onClick={onExportExcel}
          className="w-full flex items-center justify-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-md transition-all font-medium"
        >
          <FileSpreadsheet size={16} /> Exportar Excel
        </button>
        
        <button
          onClick={onExportJson}
          className="w-full flex items-center justify-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md transition-all font-medium"
        >
          <Save size={16} /> Backup Sistema
        </button>
        
        <button
          onClick={() => document.getElementById('import-input')?.click()}
          className="w-full flex items-center justify-center gap-2 text-sm border border-slate-600 text-slate-400 hover:bg-sidebar-hover hover:text-white py-2.5 rounded-md transition-all"
        >
          <Upload size={16} /> Cargar Backup
        </button>
        <input
          id="import-input"
          type="file"
          accept=".json"
          className="hidden"
          onChange={onImportJson}
        />
      </div>
    </aside>
  );
}
