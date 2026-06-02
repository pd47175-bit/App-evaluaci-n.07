/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { FileText, Download, Printer, Award, FileSpreadsheet, Check, CheckCircle2 } from 'lucide-react';
import { Student, Criterion, Grade, EducationalLevel, AssessmentPeriod } from '../types';

interface ReportGeneratorProps {
  students: Student[];
  criteria: Criterion[];
  grades: Grade[];
  educationalLevel: EducationalLevel;
  period: AssessmentPeriod;
}

export default function ReportGenerator({
  students,
  criteria,
  grades,
  educationalLevel,
  period,
}: ReportGeneratorProps) {
  
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [reportLog, setReportLog] = useState<string | null>(null);
  const [busyExport, setBusyExport] = useState<'none' | 'pdf' | 'excel'>('none');

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const getCriterionGrade = (studentId: string, criterionId: string): number => {
    const found = grades.find(g => g.studentId === studentId && g.criterionId === criterionId);
    return found ? found.score : 0;
  };

  const getWeightedFinalGrade = (studentId: string) => {
    let weightedSum = 0;
    let actualWeightSum = 0;

    criteria.forEach(c => {
      const g = getCriterionGrade(studentId, c.id);
      weightedSum += g * (c.weight / 100);
      actualWeightSum += c.weight;
    });

    if (actualWeightSum === 0) return 0;
    const finalVal = (weightedSum / actualWeightSum) * 10;
    return parseFloat(finalVal.toFixed(1));
  };

  const handleSimulateExport = (type: 'pdf' | 'excel') => {
    setBusyExport(type);
    
    setTimeout(() => {
      setBusyExport('none');
      if (type === 'pdf') {
        setReportLog(`¡Boleta Oficial PDF generada con fecha de sellado 02 de Junio de 2026! Se descargó exitosamente el archivo "Reporte_${selectedStudent?.name.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.pdf" con los logotipos oficiales de la institución.`);
      } else {
        setReportLog(`¡Matriz general académica exportada con éxito en estructura Excel CSV! El documento "EvaluaDocente_Estructura_${educationalLevel}_${period.replace(/\s+/g, '_')}.xlsx" ha sido generado con todas las fórmulas de promedio ponderado.`);
      }
      setTimeout(() => setReportLog(null), 7000);
    }, 1500);
  };

  const finalScore = selectedStudent ? getWeightedFinalGrade(selectedStudent.id) : 0;

  return (
    <div id="report-generator-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs text-slate-700">
      
      {/* Configuration & Select tools */}
      <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-5 space-y-5 shadow-xs">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Exportador & Generador Especializado</h4>
          <p className="text-[10px] text-slate-400">Emisión de boletas académicas con firma institucionalizada</p>
        </div>

        {/* Picker of student */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Seleccione Alumno para Previsualizar:</label>
          <select 
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-100"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Action button pack */}
        <div className="space-y-2.5 pt-2">
          <button 
            onClick={() => handleSimulateExport('pdf')}
            disabled={busyExport !== 'none'}
            className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs hover:shadow-md"
          >
            {busyExport === 'pdf' ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>
            ) : (
              <Download className="w-4 h-4" />
            )}
            {busyExport === 'pdf' ? 'Empaquetando PDF...' : 'Generar PDF Institucional'}
          </button>

          <button 
            onClick={() => handleSimulateExport('excel')}
            disabled={busyExport !== 'none'}
            className="w-full py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100/70 hover:bg-emerald-100 disabled:bg-slate-50 disabled:text-slate-400 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            {busyExport === 'excel' ? (
              <span className="w-4 h-4 rounded-full border-2 border-emerald-300/40 border-t-emerald animate-spin"></span>
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            {busyExport === 'excel' ? 'Procesando Libro...' : 'Exportar Hoja Excel Completa'}
          </button>
        </div>

        {/* Report Log Message Alert */}
        {reportLog && (
          <div className="p-3.5 bg-emerald-500 text-slate-100 font-medium rounded-xl flex items-start gap-2.5 animate-bounce text-[11px] leading-relaxed shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-100 shrink-0" />
            <span>{reportLog}</span>
          </div>
        )}

        <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
          <h5 className="font-semibold text-slate-800 text-[11px]">Normativa de Titulación Interna</h5>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Las boletas siguen el estándar de validez oficial mexicana (SEP / RVOE) con adaptabilidad modular. Al exportar, se conservan los promedios ponderados exactos.
          </p>
        </div>
      </div>

      {/* Official High-Fidelity Preview Box */}
      <div className="lg:col-span-12 xl:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        
        {/* Absolute Background Seal Watermark */}
        <div className="absolute right-6 top-6 opacity-3 pointer-events-none select-none">
          <Award className="w-48 h-48 text-slate-500 rotate-12" />
        </div>

        {selectedStudent ? (
          <div id="school-credential-sheet" className="p-6 border-2 border-slate-100 rounded-2xl space-y-6 bg-slate-50/20 relative z-10 font-sans">
            
            {/* Institution Badge & Logo section */}
            <div className="flex justify-between items-start border-b border-dashed border-slate-200 pb-5">
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Dirección de Acreditación Educativa</span>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                  <Award className="w-5 h-5 text-amber-500 shrink-0" />
                  COLEGIO EXPERIMENTAL DE ALTOS ESTUDIOS
                </h3>
                <p className="text-[10px] text-slate-500">Sello Institucional Integrado &bull; EvaluaDocente Pro</p>
              </div>
              <div className="text-right space-y-0.5">
                <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold tracking-wider uppercase">{educationalLevel}</span>
                <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">{period}</p>
                <p className="text-[8px] text-slate-400 font-mono">ID: {selectedStudent.id}</p>
              </div>
            </div>

            {/* Profile information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] text-slate-400 font-bold uppercase">Alumno(a) Evaluado(a):</label>
                <p className="text-xs font-bold text-slate-800">{selectedStudent.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{selectedStudent.email}</p>
              </div>
              <div>
                <label className="text-[9px] text-slate-400 font-bold uppercase">Fecha de Expedición:</label>
                <p className="text-xs font-medium text-slate-800">02 de Junio, 2026</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Sincronizado vía Apps Script</p>
              </div>
            </div>

            {/* Grade Details Table */}
            <div className="space-y-2.5">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Boleta Detallada de Evaluaciones</span>
              <div className="border border-slate-150 rounded-xl overflow-hidden bg-white">
                <table className="w-full max-w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-150 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-4">Criterio / Rubro</th>
                      <th className="py-2.5 px-4 text-center">Peso</th>
                      <th className="py-2.5 px-4 text-center">Calificación</th>
                      <th className="py-2.5 px-px text-center">Factor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/70 text-slate-700">
                    {criteria.map(c => {
                      const grade = getCriterionGrade(selectedStudent.id, c.id);
                      const weightedImpact = (grade * (c.weight / 100)).toFixed(2);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/10">
                          <td className="py-2.5 px-4">
                            <span className="font-semibold text-slate-800">{c.name}</span>
                            <p className="text-[8px] text-slate-400 leading-tight mt-0.5">{c.description}</p>
                          </td>
                          <td className="py-2.5 px-4 text-center text-slate-500 font-semibold">{c.weight}%</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[10px]">{grade === 0 ? 'NE' : grade.toFixed(1)}</span>
                          </td>
                          <td className="py-2.5 px-px text-center font-mono text-slate-400 font-semibold text-[10px]">{weightedImpact}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom summary and signatures */}
            <div className="pt-4 border-t border-dashed border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-[9px] text-slate-400 italic leading-relaxed font-semibold">
                  &ldquo;Anotaciones del evaluador: {selectedStudent.observations || 'Excelente desempeño y constancia académica durante el ciclo.'}&rdquo;
                </p>
              </div>
              <div className="flex items-center justify-end gap-3.5 bg-white border border-slate-150 p-4 rounded-2xl shadow-2xs">
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Calificación Final</span>
                  <p className="text-[9px] text-slate-400">Ponderación integrada</p>
                </div>
                <div className="px-5 py-2 rounded-xl bg-blue-50 border border-blue-150 text-center font-sans">
                  <span className="text-[17px] font-bold text-blue-600 font-sans tracking-tight">{finalScore.toFixed(1)}</span>
                  <span className="text-[9px] text-blue-400 block font-bold capitalize mt-0.5">
                    {finalScore >= 9.0 ? 'Aprobado Honor' : finalScore >= 6.5 ? 'Aprobado' : 'Por Recuperar'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sign and seal placeholders */}
            <div className="pt-8 flex justify-center text-center">
              <div className="w-40 border-t border-slate-300 pt-1">
                <p className="text-[8px] font-bold text-slate-500 uppercase">Firma del Evaluador</p>
                <p className="text-[7px] text-slate-400">Sistema Certificado EvaluaDocente Pro</p>
              </div>
            </div>

          </div>
        ) : (
          <p className="text-slate-400 italic text-center py-10">Cargando certificado oficial del estudiante...</p>
        )}
      </div>

    </div>
  );
}
