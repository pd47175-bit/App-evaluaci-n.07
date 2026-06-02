/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  SlidersHorizontal, 
  Info, 
  AlertCircle, 
  CheckCircle, 
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import { Student, Criterion, Grade } from '../types';

interface GradebookProps {
  students: Student[];
  criteria: Criterion[];
  grades: Grade[];
  onUpdateGrade: (studentId: string, criterionId: string, score: number) => void;
  onAddCriterion: (name: string, weight: number, ratingType: 'numeric' | 'scale' | 'checklist') => void;
  onDeleteCriterion: (id: string) => void;
  onUpdateCriterionWeight: (id: string, weight: number) => void;
}

export default function Gradebook({
  students,
  criteria,
  grades,
  onUpdateGrade,
  onAddCriterion,
  onDeleteCriterion,
  onUpdateCriterionWeight,
}: GradebookProps) {
  
  const [showConfig, setShowConfig] = useState(false);
  const [newCritName, setNewCritName] = useState('');
  const [newCritType, setNewCritType] = useState<'numeric' | 'scale' | 'checklist'>('numeric');
  const [newCritWeight, setNewCritWeight] = useState(25);

  // Total criteria sum of weights
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  // Get score for a specific student and criterion
  const getGradeValue = (studentId: string, criterionId: string): number => {
    const found = grades.find(g => g.studentId === studentId && g.criterionId === criterionId);
    return found ? found.score : 0;
  };

  // Compute final weighted grade for a student based on criteria weights
  const getWeightedFinalGrade = (studentId: string) => {
    let weightedSum = 0;
    let actualWeightSum = 0;

    criteria.forEach(c => {
      const g = getGradeValue(studentId, c.id);
      weightedSum += g * (c.weight / 100);
      actualWeightSum += c.weight;
    });

    if (actualWeightSum === 0) return 0;
    
    // Scale up to 10 if criteria sums are not 100
    const finalVal = (weightedSum / actualWeightSum) * 10;
    return parseFloat(finalVal.toFixed(1));
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;
    onAddCriterion(newCritName, newCritWeight, newCritType);
    setNewCritName('');
  };

  return (
    <div id="flipped-gradebook-wrapper" className="space-y-6">
      
      {/* Dynamic Weight Configuration drawer */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="w-full px-6 py-4 flex items-center justify-between text-slate-800 font-semibold text-sm hover:bg-slate-50/50 transition duration-150"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-500" />
            <span>Ponderación inteligente de criterios</span>
            <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${totalWeight === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              Total: {totalWeight}%
            </span>
          </div>
          <span className="text-xs text-blue-500 font-medium select-none">
            {showConfig ? 'Ocultar ajustes ▲' : 'Configurar pesos y añadir rubros ▼'}
          </span>
        </button>

        {showConfig && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/30 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in text-xs text-slate-600">
            {/* Left side: criteria weighting adjustments */}
            <div className="lg:col-span-7 space-y-4">
              <h5 className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Ajuste de Criterios Actuales
              </h5>
              
              {criteria.length === 0 ? (
                <p className="text-slate-400 italic">No hay criterios definidos. Agrega uno a la derecha.</p>
              ) : (
                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2 scrollbar">
                  {criteria.map(c => (
                    <div key={c.id} className="p-3 bg-white border border-slate-150 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 truncate text-xs">{c.name}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded uppercase font-bold tracking-wider">{c.ratingType}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{c.description}</p>
                      </div>
                      
                      {/* Weight Selector slider */}
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={c.weight}
                            onChange={(e) => onUpdateCriterionWeight(c.id, parseInt(e.target.value))}
                            className="w-24 accent-blue-400 h-1 cursor-ew-resize bg-slate-200 rounded-lg appearance-none"
                          />
                          <span className="text-[10px] font-bold text-slate-700 mt-1">{c.weight}%</span>
                        </div>
                        <button 
                          onClick={() => onDeleteCriterion(c.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-700 transition rounded-lg"
                          title="Eliminar criterio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Validation alert */}
              {totalWeight !== 100 && (
                <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl flex items-start gap-2 text-amber-800 text-[11px] leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Nota de consistencia técnica:</span> Los pesos suman <span className="underline font-bold">{totalWeight}%</span>. Si bien autocalculamos de forma ponderada proporcional, te aconsejamos distribuirlos de forma que sumen exactamente un <span className="font-bold">100%</span> para mayor exactitud institucional.
                  </div>
                </div>
              )}
              {totalWeight === 100 && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2 text-emerald-800 text-[11px] leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Estructura perfecta:</span> La sumatoria de ponderaciones alcanza con precisión el <span className="font-bold">100%</span>. El cálculo de la nota responderá directamente al porcentaje exacto.
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Add new criterion */}
            <form onSubmit={handleAddNew} className="lg:col-span-5 p-4 bg-white border border-slate-150 rounded-2xl flex flex-col justify-between shadow-2xs gap-3.5">
              <h5 className="font-semibold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                Añadir Criterio Ad-Hoc
              </h5>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre del Rubro</label>
                <input 
                  type="text" 
                  placeholder="Ej. Tareas virtuales o Portafolio" 
                  value={newCritName}
                  onChange={(e) => setNewCritName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-100 text-xs text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tipo Evaluación</label>
                  <select 
                    value={newCritType} 
                    onChange={(e) => setNewCritType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-slate-700 text-xs-custom focus:outline-none"
                  >
                    <option value="numeric">Numérico (0-10)</option>
                    <option value="scale">Escala (Caras/Logros)</option>
                    <option value="checklist">Lista de Cumplimiento</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Peso (%)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={newCritWeight} 
                    onChange={(e) => setNewCritWeight(Math.min(100, Math.max(1, parseInt(e.target.value) || 0)))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs-custom text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar Criterio
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Main Gradebook Spreadsheet Grid */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div id="gradebook-table-scroll-container" className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-4 px-6 font-semibold select-none">Fotografía y Nombre del Estudiante</th>
                {criteria.map(c => (
                  <th key={c.id} className="py-4 px-4 font-semibold text-center select-none" style={{ minWidth: '140px' }}>
                    <div className="flex flex-col items-center">
                      <span className="text-slate-800 truncate max-w-[120px]" title={c.name}>{c.name}</span>
                      <span className="text-blue-500 text-[9px] font-bold lowercase">({c.weight}%)</span>
                    </div>
                  </th>
                ))}
                <th className="py-4 px-6 text-center font-bold text-slate-800 select-none" style={{ minWidth: '110px' }}>
                  Nota Definitiva
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70 text-slate-700">
              {students.map(student => {
                const finalGradeVal = getWeightedFinalGrade(student.id);
                // Compute custom background styles for status ranges
                let finalGradeStyle = "bg-neutral-50 text-neutral-800 border-neutral-150";
                if (finalGradeVal >= 9.0) {
                  finalGradeStyle = "bg-emerald-50 text-emerald-700 border-emerald-150 font-bold";
                } else if (finalGradeVal < 6.5) {
                  finalGradeStyle = "bg-rose-50 text-rose-700 border-rose-150 font-bold";
                }

                return (
                  <tr key={student.id} className="hover:bg-slate-50/40 transition">
                    {/* Alumno name column */}
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={student.avatarUrl} 
                          alt={student.name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-semibold text-slate-800">{student.name}</p>
                          <p className="text-[10px] text-slate-400">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Criteria score editing cells */}
                    {criteria.map(c => {
                      const score = getGradeValue(student.id, c.id);

                      return (
                        <td key={c.id} className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            {c.ratingType === 'numeric' && (
                              <input 
                                type="number" 
                                step="0.1"
                                min="0"
                                max="10"
                                value={score === 0 ? '' : score}
                                onChange={(e) => {
                                  let val = parseFloat(e.target.value);
                                  if (isNaN(val)) val = 0;
                                  onUpdateGrade(student.id, c.id, Math.min(10, Math.max(0, val)));
                                }}
                                className="w-14 px-1 py-1 text-center bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-200 transition"
                                placeholder="--"
                              />
                            )}

                            {/* Flipped scale (Caras de conducta para básica / Nivel logro) */}
                            {c.ratingType === 'scale' && (
                              <div className="flex items-center gap-1 justify-center">
                                {[2, 5, 8, 10].map((levelScore, i) => {
                                  const emojiList = ['😢', '😐', '🙂', '🤩'];
                                  const textList = ['Por mejorar', 'Regular', 'Bueno', 'Excelente'];
                                  const isActive = Math.abs(score - levelScore) <= 1.5;
                                  return (
                                    <button
                                      key={levelScore}
                                      onClick={() => onUpdateGrade(student.id, c.id, levelScore)}
                                      className={`text-base p-1 rounded-md transition ${isActive ? 'bg-blue-100 scale-110 shadow-3xs' : 'opacity-40 hover:opacity-100'}`}
                                      title={`${textList[i]} (Calificación: ${levelScore})`}
                                    >
                                      {emojiList[i]}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Checklist compliance */}
                            {c.ratingType === 'checklist' && (
                              <button 
                                onClick={() => onUpdateGrade(student.id, c.id, score === 10 ? 0 : 10)}
                                className={`px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider uppercase transition ${score >= 9 ? 'bg-emerald-100/70 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}
                              >
                                {score >= 9 ? 'Entregado' : 'Faltante'}
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* Final grade display */}
                    <td className="py-3 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${finalGradeStyle}`}>
                        {finalGradeVal.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
