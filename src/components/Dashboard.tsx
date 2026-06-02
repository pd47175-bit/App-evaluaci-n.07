/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { Award, AlertTriangle, Users, BarChart3, TrendingUp, Compass, UserCheck } from 'lucide-react';
import { Student, EducationalLevel, Grade } from '../types';
import { getStudentCompetencies, HISTORICAL_STATS, getGradeDistribution } from '../utils';

interface DashboardProps {
  students: Student[];
  grades: Grade[];
  educationalLevel: EducationalLevel;
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
}

export default function Dashboard({ 
  students, 
  grades, 
  educationalLevel, 
  selectedStudentId, 
  onSelectStudent 
}: DashboardProps) {

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Helper: compute student final average score from 0 to 10
  const getStudentFinalGrade = (studentId: string) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;
    const sum = studentGrades.reduce((acc, g) => acc + g.score, 0);
    return parseFloat((sum / studentGrades.length).toFixed(1));
  };

  // Compute stats of current group
  const finalGrades = students.map(s => getStudentFinalGrade(s.id));
  const groupAverage = finalGrades.length > 0 
    ? parseFloat((finalGrades.reduce((acc, g) => acc + g, 0) / finalGrades.length).toFixed(1))
    : 0;

  const totalStudents = students.length;
  const atRiskStudents = students.filter(s => getStudentFinalGrade(s.id) < 6.5).length;
  const honorRollStudents = students.filter(s => getStudentFinalGrade(s.id) >= 9.0).length;

  // Competency data for SELECTED student based on average
  const studentAvg = getStudentFinalGrade(selectedStudent?.id || '');
  const competencyData = getStudentCompetencies(selectedStudent?.id || '', educationalLevel, studentAvg);

  // Historic Evolution Trend (simulated based on historical stats)
  const historicalData = HISTORICAL_STATS[educationalLevel];

  // Grade Distribution Bar Data
  const gradeDistributionData = getGradeDistribution(finalGrades);

  return (
    <div id="dashboard-widget-container" className="space-y-6">
      
      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Promedio Grupal */}
        <div className="p-5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between text-slate-800 transition hover:shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-500/80">Promedio General</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-sans tracking-tight text-slate-800">{groupAverage.toFixed(1)}</span>
              <span className="text-xs text-blue-600/90 font-medium">/ 10</span>
            </div>
            <p className="text-[11px] text-blue-600">Rendimiento global del curso</p>
          </div>
          <div className="p-3 bg-white text-blue-500 rounded-xl shadow-xs border border-blue-100/10">
            <TrendingUp className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* KPI 2: Total Alumnos */}
        <div className="p-5 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between text-slate-800 transition hover:shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600/80">Alumnos Inscritos</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-800">{totalStudents}</span>
              <span className="text-xs text-emerald-600 font-medium">activos</span>
            </div>
            <p className="text-[11px] text-emerald-600">En este grupo académico</p>
          </div>
          <div className="p-3 bg-white text-emerald-500 rounded-xl shadow-xs border border-emerald-100/10">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Excelencia */}
        <div className="p-5 bg-amber-50/70 border border-amber-100 rounded-2xl flex items-center justify-between text-slate-800 transition hover:shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600/80">Cuadro de Honor</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-800">{honorRollStudents}</span>
              <span className="text-xs text-amber-600 font-medium">sobresalientes</span>
            </div>
            <p className="text-[11px] text-amber-700">Calificaciones &ge; 9.0</p>
          </div>
          <div className="p-3 bg-white text-amber-500 rounded-xl shadow-xs border border-amber-150">
            <Award className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        {/* KPI 4: En Riesgo */}
        <div className="p-5 bg-rose-50/70 border border-rose-100 rounded-2xl flex items-center justify-between text-slate-800 transition hover:shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500/80">Alumnos en Riesgo</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-3xl font-bold tracking-tight ${atRiskStudents > 0 ? 'text-rose-600' : 'text-slate-700'}`}>{atRiskStudents}</span>
              <span className="text-xs text-rose-600 font-medium">alertas</span>
            </div>
            <p className="text-[11px] text-rose-600">Promedio menor a 6.5</p>
          </div>
          <div className={`p-3 bg-white text-rose-500 rounded-xl shadow-xs border border-rose-100 ${atRiskStudents > 0 ? 'animate-bounce' : ''}`}>
            <AlertTriangle className={`w-6 h-6 ${atRiskStudents > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
        </div>
      </div>

      {/* Main Charts Section: Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart A: Rendimiento Histórico */}
        <div className="lg:col-span-1 p-5 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              <h4 className="text-sm font-semibold text-slate-800">Evolución del Promedio</h4>
            </div>
            <p className="text-xs text-slate-400 mb-4">Progreso longitudinal a través de periodos</p>
          </div>
          <div className="h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[5, 10]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                  labelClassName="font-medium text-slate-700" 
                />
                <Area type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAvg)" name="Promedio" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Rango óptimo para el nivel</span>
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">&ge; 8.0</span>
          </div>
        </div>

        {/* Chart B: Distribución Curva de Calificaciones */}
        <div className="lg:col-span-1 p-5 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <h4 className="text-sm font-semibold text-slate-800">Distribución de Notas</h4>
            </div>
            <p className="text-xs text-slate-400 mb-4">Frecuencia de alumnos por rango de promedio</p>
          </div>
          <div className="h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '11px' }} 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Número de Alumnos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Mayoría concentrada en:</span>
            <span className="font-semibold text-slate-700">8.0 - 10.0</span>
          </div>
        </div>

        {/* Chart C: Radar de Competencias */}
        <div className="lg:col-span-1 p-5 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-4 h-4 text-slate-500" />
              <h4 className="text-sm font-semibold text-slate-800">Radar de Habilidades</h4>
            </div>
            <p className="text-xs text-slate-400 mb-2">Desarrollo integral por competencias pedagógicas</p>
            
            {/* Interactive Selector of student for the Radar mapping */}
            <div className="mb-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Alumno Evaluado:</label>
              <select 
                value={selectedStudentId} 
                onChange={(e) => onSelectStudent(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 border border-slate-150 rounded-lg text-slate-700 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-100"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({getStudentFinalGrade(s.id).toFixed(1)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-44 mt-2 flex items-center justify-center">
            {selectedStudent ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={competencyData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: '#475569' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 7 }} />
                  <Radar name={selectedStudent.name} dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">Selecciona un alumno para graficar</p>
            )}
          </div>
          
          {selectedStudent && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2.5">
              <img 
                src={selectedStudent.avatarUrl} 
                alt={selectedStudent.name} 
                className="w-6 h-6 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-700 truncate">{selectedStudent.name}</p>
                <p className="text-[10px] text-slate-400 truncate italic">&ldquo;{selectedStudent.observations}&rdquo;</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
