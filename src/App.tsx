/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { 
  FileText, 
  ArrowLeft, 
  Printer, 
  Save, 
  CheckCircle,
  GraduationCap,
  AlertCircle
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import GradingTable from './components/GradingTable';
import ReportCard from './components/ReportCard';
import { Student, GradeValue, CompetenceGrades } from './types';
import { CNEB_CURRICULUM } from './constants';
import { cn } from './lib/utils';

const STORAGE_KEY = 'eduboleta_v6_data';

export default function App() {
  const [ieName, setIeName] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'grading' | 'report'>('home');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Initialization
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setIeName(data.ieName || '');
        setStudents(data.students || []);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync to persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ieName, students }));
  }, [ieName, students]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddStudent = (name: string, grade: string) => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      grade,
      grades: {}
    };
    setStudents(prev => [...prev, newStudent]);
    showToast(`Estudiante ${name} agregado`);
  };

  const handleDeleteStudent = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (confirm("¿Seguro que deseas eliminar a este estudiante? Sus notas se borrarán permanentemente.")) {
      setStudents(prev => prev.filter(s => s.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setView('home');
      }
      showToast("Estudiante eliminado", "success");
    }
  };

  const handleSelectStudent = (id: string) => {
    setSelectedId(id);
    setView('grading');
  };

  const handleGradeChange = (compIndex: number, period: keyof CompetenceGrades, value: GradeValue) => {
    if (!selectedId) return;
    
    setStudents(prev => prev.map(s => {
      if (s.id !== selectedId) return s;
      
      const updatedGrades = { ...s.grades };
      if (!updatedGrades[compIndex]) {
        updatedGrades[compIndex] = { b1: '-', b2: '-', b3: '-', b4: '-', final: '-' };
      }
      
      updatedGrades[compIndex] = {
        ...updatedGrades[compIndex],
        [period]: value
      };
      
      return { ...s, grades: updatedGrades };
    }));
  };

  const handleExportExcel = useCallback(() => {
    if (students.length === 0) {
      showToast("No hay estudiantes para exportar", "error");
      return;
    }

    const dataExcel: any[] = [];
    students.forEach(est => {
      let compIndex = 0;
      CNEB_CURRICULUM.forEach(area => {
        area.competences.forEach(comp => {
          const notas = est.grades[compIndex] || {};
          dataExcel.push({
            "Estudiante": est.name,
            "Grado y Sección": est.grade || "No asignado",
            "Área Curricular": area.area,
            "Competencia Evaluada": comp,
            "1er Bim": notas.b1 || "-",
            "2do Bim": notas.b2 || "-",
            "3er Bim": notas.b3 || "-",
            "4to Bim": notas.b4 || "-",
            "Calif. FINAL": notas.final || "-"
          });
          compIndex++;
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(dataExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registro General");
    
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    XLSX.writeFile(wb, `Registro_CNEB_${dateStr}.xlsx`);
    showToast("Excel exportado correctamente");
  }, [students]);

  const handleExportJson = () => {
    const data = { ieName, students, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduBoleta_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Backup descargado");
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data && data.students) {
          setStudents(data.students);
          setIeName(data.ieName || '');
          setView('home');
          setSelectedId(null);
          showToast("Datos importados con éxito");
        }
      } catch (err) {
        showToast("Error al importar el archivo", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const selectedStudent = students.find(s => s.id === selectedId);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        ieName={ieName}
        setIeName={setIeName}
        students={students}
        onAddStudent={handleAddStudent}
        onDeleteStudent={handleDeleteStudent}
        onSelectStudent={handleSelectStudent}
        selectedId={selectedId}
        onExportExcel={handleExportExcel}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-bg-light">
        <header className="topbar h-16 bg-white flex items-center justify-between px-8 shadow-sm z-5 no-print">
          <div className="flex items-center gap-2 text-emerald-600 font-medium">
            <Save size={18} />
            <span>Autoguardado Activo</span>
          </div>
          <div className="text-slate-500 text-sm font-light">
            {currentTime.toLocaleDateString('es-PE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="bg-slate-200 p-8 rounded-full mb-4">
                  <GraduationCap size={64} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">Bienvenido al Sistema de Evaluación</h2>
                <p className="text-slate-500 max-w-md">
                  Tus datos se guardan automáticamente en este navegador. 
                  Comienza agregando estudiantes o selecciona uno de la lista para registrar sus calificaciones.
                </p>
              </motion.div>
            )}

            {view === 'grading' && selectedStudent && (
              <motion.div
                key="grading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white rounded-xl shadow-md p-6 md:p-10"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Registro de Calificaciones</h2>
                    <p className="text-slate-500">
                      Estudiante: <strong className="text-minedu-red">{selectedStudent.name}</strong> 
                      <span className="mx-2 opacity-30">|</span> 
                      {selectedStudent.grade || 'Sin grado'}
                    </p>
                  </div>
                  <button
                    onClick={() => setView('report')}
                    className="flex items-center gap-2 bg-minedu-red hover:bg-minedu-dark text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-red-900/10"
                  >
                    <FileText size={20} /> Generar Boleta
                  </button>
                </div>
                
                <GradingTable 
                  student={selectedStudent} 
                  onGradeChange={handleGradeChange} 
                />
              </motion.div>
            )}

            {view === 'report' && selectedStudent && (
              <motion.div
                key="report"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="no-print flex gap-3 sticky top-0 bg-bg-light/80 backdrop-blur pb-4 z-10">
                  <button
                    onClick={() => setView('grading')}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-all text-sm"
                  >
                    <ArrowLeft size={16} /> Volver a Editar
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-minedu-red text-white px-6 py-2.5 rounded-lg font-medium hover:bg-minedu-dark transition-all text-sm shadow-lg shadow-red-900/20"
                  >
                    <Printer size={16} /> Guardar PDF / Imprimir
                  </button>
                </div>

                <ReportCard student={selectedStudent} ieName={ieName} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={cn(
              "fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50",
              toast.type === 'success' ? "bg-slate-900 text-white" : "bg-red-600 text-white"
            )}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={20} className="text-emerald-400" />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-medium">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
