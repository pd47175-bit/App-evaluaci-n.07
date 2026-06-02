/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, AlertTriangle, UserCheck, UserPlus, Info, Check, Edit3, X, Mail } from 'lucide-react';
import { Student } from '../types';

interface StudentListProps {
  students: Student[];
  onAddStudent: (name: string, email: string) => void;
  onUpdateObservations: (id: string, obs: string) => void;
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
}

export default function StudentList({
  students,
  onAddStudent,
  onUpdateObservations,
  selectedStudentId,
  onSelectStudent,
}: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  
  // Inline observation editing state
  const [editingObsId, setEditingObsId] = useState<string | null>(null);
  const [tempObsValue, setTempObsValue] = useState('');

  // Filtering students with search input
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;
    onAddStudent(newStudentName, newStudentEmail);
    setNewStudentName('');
    setNewStudentEmail('');
    setShowAddForm(false);
  };

  const startEditObservations = (student: Student) => {
    setEditingObsId(student.id);
    setTempObsValue(student.observations);
  };

  const saveObservations = (id: string) => {
    onUpdateObservations(id, tempObsValue);
    setEditingObsId(null);
  };

  return (
    <div id="students-module-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs text-slate-700">
      
      {/* Student List Sidebar Area */}
      <div className="lg:col-span-12 xl:col-span-5 bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
        
        {/* Search & Actions block */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Mi Alumnado</h4>
              <p className="text-[10px] text-slate-400">Total: {students.length} matriculados</p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Inscribir Alumno
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo electrónico..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-150 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-100 transition text-xs"
            />
          </div>

          {/* Add Student Form */}
          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3 animate-slide-up">
              <h5 className="font-semibold text-slate-800 text-xs text-center border-b border-slate-200 pb-1.5">Nuevo Estudiante</h5>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Nombre completo" 
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  required
                />
                <input 
                  type="email" 
                  placeholder="ejemplo@docente.mx" 
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)} 
                  className="px-3 py-1 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-3.5 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                >
                  Confirmar
                </button>
              </div>
            </form>
          )}

          {/* List of students widget */}
          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1 scrollbar">
            {filteredStudents.length === 0 ? (
              <p className="text-center py-6 text-slate-400 italic">No se encontraron coincidencias.</p>
            ) : (
              filteredStudents.map(student => {
                const isSelected = student.id === selectedStudentId;
                
                // Color codes for alerts
                let statusBadge = "bg-blue-50 text-blue-600";
                if (student.riskStatus === 'Excelente') statusBadge = "bg-emerald-50 text-emerald-600";
                if (student.riskStatus === 'En Riesgo') statusBadge = "bg-rose-50 text-rose-600";

                return (
                  <div 
                    key={student.id} 
                    onClick={() => onSelectStudent(student.id)}
                    className={`p-3.5 border rounded-xl flex items-center justify-between gap-3 cursor-pointer transition ${isSelected ? 'border-blue-200 bg-blue-50/20 shadow-2xs' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={student.avatarUrl} 
                        alt={student.name} 
                        className="w-9 h-9 rounded-full object-cover border border-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{student.name}</p>
                        <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5" />
                          {student.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusBadge}`}>
                        {student.riskStatus}
                      </span>
                      {student.riskStatus === 'En Riesgo' && (
                        <span className="text-rose-500" title="Rendimiento en riesgo de reprobar">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        </span>
                      )}
                      {student.riskStatus === 'Excelente' && (
                        <span className="text-emerald-500">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Student Detailed Information Card Area */}
      <div className="lg:col-span-12 xl:col-span-7 space-y-4">
        {filteredStudents.find(s => s.id === selectedStudentId) ? (
          (() => {
            const student = filteredStudents.find(s => s.id === selectedStudentId)!;
            return (
              <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-6 shadow-xs">
                
                {/* Profile Title Banner element */}
                <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                  <img 
                    src={student.avatarUrl} 
                    alt={student.name} 
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-800">{student.name}</h4>
                    <p className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {student.email}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-md font-semibold text-slate-500">Matrícula: {student.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${student.riskStatus === 'En Riesgo' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>{student.riskStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Observations / Bitácora section */}
                <div className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-blue-500" />
                      Bitácora y Observaciones Docentes
                    </h5>
                    
                    {editingObsId !== student.id ? (
                      <button 
                        onClick={() => startEditObservations(student)}
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Editar Nota
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingObsId(null)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => saveObservations(student.id)}
                          className="text-emerald-600 hover:text-emerald-800 font-semibold"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {editingObsId === student.id ? (
                    <textarea 
                      value={tempObsValue}
                      onChange={(e) => setTempObsValue(e.target.value)}
                      className="w-full mt-2 p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 text-xs text-slate-700"
                      rows={3}
                    />
                  ) : (
                    <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">
                      &ldquo;{student.observations || 'Sin anotaciones registradas en este periodo escolar.'}&rdquo;
                    </p>
                  )}
                </div>

                {/* Quick tips guide card for teachers */}
                <div className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-xl">
                  <h6 className="font-semibold text-emerald-800 mb-1">Plan de Continuidad Académica</h6>
                  <p className="text-xs text-emerald-700/90 leading-relaxed">
                    Esta ventana detalla el estatus individual. Para actualizar calificaciones, utiliza directamente el módulo del <strong>Cuaderno de Calificaciones Flipped</strong>. Las alertas se recalculan en tiempo real para evitar que el alumno decaiga.
                  </p>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center text-slate-400 italic">
            Selecciona un alumno del listado para detalles y bitácora clínica.
          </div>
        )}
      </div>

    </div>
  );
}
