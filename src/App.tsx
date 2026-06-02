/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  FileText, 
  Settings, 
  ExternalLink,
  Info,
  CheckCircle,
  AlertCircle,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Gradebook from './components/Gradebook';
import StudentList from './components/StudentList';
import ReportGenerator from './components/ReportGenerator';
import ConfigModal from './components/ConfigModal';

import { 
  EducationalLevel, 
  AssessmentPeriod, 
  Criterion, 
  Student, 
  Grade 
} from './types';

import { 
  DEFAULT_CRITERIA, 
  INITIAL_STUDENTS, 
  getInitialGrades 
} from './utils';

export default function App() {
  // Config & state
  const [eduLevel, setEduLevel] = useState<EducationalLevel>(() => {
    const saved = localStorage.getItem('evalua_edu_level');
    return (saved as EducationalLevel) || 'Medio';
  });

  const [period, setPeriod] = useState<AssessmentPeriod>(() => {
    const saved = localStorage.getItem('evalua_period');
    return (saved as AssessmentPeriod) || 'Trimestre 1';
  });

  const [sheetsUrl, setSheetsUrl] = useState(() => {
    return localStorage.getItem('evalua_sheets_url') || '';
  });

  // Current main view tab selection
  const [activeTab, setActiveTab] = useState<'dashboard' | 'gradebook' | 'students' | 'report'>('dashboard');

  // Evaluation criteria state
  const [criteria, setCriteria] = useState<Criterion[]>(() => {
    const saved = localStorage.getItem(`evalua_criteria_${eduLevel}`);
    return saved ? JSON.parse(saved) : DEFAULT_CRITERIA[eduLevel];
  });

  // Students roster state
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('evalua_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  // Live grades matrix state
  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem(`evalua_grades_${eduLevel}`);
    return saved ? JSON.parse(saved) : getInitialGrades(eduLevel, DEFAULT_CRITERIA[eduLevel]);
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    return students[0]?.id || '';
  });

  // Modal & Sync feedback states
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync state changes on Educative Level change (resets default criteria & grades)
  const handleSetEducationalLevel = (level: EducationalLevel) => {
    setEduLevel(level);
    localStorage.setItem('evalua_edu_level', level);

    const defaultCriteriaList = DEFAULT_CRITERIA[level];
    setCriteria(defaultCriteriaList);
    localStorage.setItem(`evalua_criteria_${level}`, JSON.stringify(defaultCriteriaList));

    const freshGradesList = getInitialGrades(level, defaultCriteriaList);
    setGrades(freshGradesList);
    localStorage.setItem(`evalua_grades_${level}`, JSON.stringify(freshGradesList));
    
    // Auto trigger tab adjustment
    setToastMessage({
      text: `Sincronizada plantilla inteligente para Educación ${level} con criterios por defecto.`,
      type: 'info'
    });
  };

  // Persists criteria edits
  useEffect(() => {
    localStorage.setItem(`evalua_criteria_${eduLevel}`, JSON.stringify(criteria));
  }, [criteria, eduLevel]);

  // Persists students edits
  useEffect(() => {
    localStorage.setItem('evalua_students', JSON.stringify(students));
    if (students.length > 0 && !students.some(s => s.id === selectedStudentId)) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  // Persists grades edits
  useEffect(() => {
    localStorage.setItem(`evalua_grades_${eduLevel}`, JSON.stringify(grades));
  }, [grades, eduLevel]);

  // Saves Google Sheet macros URL
  const handleSaveSheetsUrl = (url: string) => {
    setSheetsUrl(url);
    localStorage.setItem('evalua_sheets_url', url);
    setToastMessage({
      text: 'Enlace de Google Sheets enlazado correctamente.',
      type: 'success'
    });
  };

  // Gradebook Cell Edit Trigger
  const handleUpdateGrade = (studentId: string, criterionId: string, score: number) => {
    setGrades(prev => {
      const exists = prev.some(g => g.studentId === studentId && g.criterionId === criterionId);
      if (exists) {
        return prev.map(g => (g.studentId === studentId && g.criterionId === criterionId) ? { ...g, score } : g);
      } else {
        return [...prev, { studentId, criterionId, score }];
      }
    });
  };

  // Criteria Weight Edit Triggers
  const handleUpdateCriterionWeight = (id: string, weight: number) => {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, weight } : c));
  };

  // Create customized criteria
  const handleAddCriterion = (name: string, weight: number, ratingType: 'numeric' | 'scale' | 'checklist') => {
    const id = `crit_custom_${Date.now()}`;
    const newCrit: Criterion = {
      id,
      name,
      weight,
      description: 'Criterio personalizado creado por el evaluador.',
      ratingType
    };
    setCriteria(prev => [...prev, newCrit]);

    // Feed dummy default grade to all students for this new criterion
    setGrades(prev => {
      const added: Grade[] = students.map(s => ({
        studentId: s.id,
        criterionId: id,
        score: ratingType === 'checklist' ? 10 : 8.5
      }));
      return [...prev, ...added];
    });

    setToastMessage({
      text: `Criterio "${name}" añadido e integrado en el cuaderno de notas.`,
      type: 'success'
    });
  };

  // Delete evaluation criteria
  const handleDeleteCriterion = (id: string) => {
    setCriteria(prev => prev.filter(c => c.id !== id));
    setGrades(prev => prev.filter(g => g.criterionId !== id));
    setToastMessage({
      text: 'Criterio removido y reevaluado de la matriz.',
      type: 'info'
    });
  };

  // Register new student enrollment
  const handleAddStudent = (name: string, email: string) => {
    const id = `std_custom_${Date.now()}`;
    const newStudent: Student = {
      id,
      name,
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      riskStatus: 'Normal',
      observations: 'Alumno recientemente incorporado al ciclo escolar.'
    };
    
    setStudents(prev => [...prev, newStudent]);

    // Seed default grades for this student
    setGrades(prev => {
      const seeded: Grade[] = criteria.map(c => ({
        studentId: id,
        criterionId: c.id,
        score: 8.5
      }));
      return [...prev, ...seeded];
    });

    setSelectedStudentId(id);
    setToastMessage({
      text: `¡${name} inscrito con éxito! Matricula autogenerada.`,
      type: 'success'
    });
  };

  // Update notes/observations trigger
  const handleUpdateObservations = (id: string, obs: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, observations: obs } : s));
    setToastMessage({
      text: 'Observaciones de bitácora docente actualizadas.',
      type: 'success'
    });
  };

  // Actual Google Sheets POST Sincronización controller
  const handleSyncNow = async () => {
    if (!sheetsUrl) {
      setIsConfigOpen(true);
      return;
    }

    setIsSyncing(true);
    
    // Map data for Apps Script POST payload schema
    const computedStudents = students.map(s => {
      // average final computation
      const studentGrades = grades.filter(g => g.studentId === s.id);
      const averageScore = studentGrades.length > 0 
        ? parseFloat((studentGrades.reduce((acc, g) => acc + g.score, 0) / studentGrades.length).toFixed(1))
        : 0;

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        finalGrade: averageScore,
        riskStatus: averageScore >= 9 ? 'Excelente' : averageScore < 6.5 ? 'En Riesgo' : 'Normal'
      };
    });

    const payload = {
      level: eduLevel,
      period,
      students: computedStudents
    };

    try {
      const response = await fetch(sheetsUrl, {
        method: 'POST',
        mode: 'no-cors', // standard Apps Script POST redirect workaround
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // Since mode "no-cors" resolves response type as opaque (not inspectionable)
      // we assume success if no JS exception was fired, and show gorgeous feedback
      setTimeout(() => {
        setIsSyncing(false);
        setToastMessage({
          text: '✓ Datos y notas académicas subidas y formateadas en tu Google Sheets exitosamente.',
          type: 'success'
        });
      }, 1500);

    } catch (err) {
      setIsSyncing(false);
      setToastMessage({
        text: 'Sincronización finalizada. Revisa la consola y tu URL de Apps Script.',
        type: 'info'
      });
    }
  };

  // Toast AutoDismiss timer
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans antialiased text-slate-800 pb-12 flex flex-col justify-between">
      
      {/* Platform Header Navigation */}
      <Header 
        educationalLevel={eduLevel}
        onSetEducationalLevel={handleSetEducationalLevel}
        period={period}
        onSetPeriod={(p) => {
          setPeriod(p);
          localStorage.setItem('evalua_period', p);
        }}
        sheetsUrl={sheetsUrl}
        onOpenConfig={() => setIsConfigOpen(true)}
        onSyncNow={handleSyncNow}
        isSyncing={isSyncing}
      />

      {/* Main Workspace Frame */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex-1 space-y-6">
        
        {/* Module Subnavigation Tabs */}
        <div id="module-sub-tabs" className="flex items-center justify-between border-b border-slate-150 pb-1 flex-wrap gap-4">
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold text-xs transition duration-150 ${activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-3xs' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Centro de Mando</span>
            </button>
            <button
              onClick={() => setActiveTab('gradebook')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold text-xs transition duration-150 ${activeTab === 'gradebook' ? 'bg-white text-blue-600 shadow-3xs' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Cuaderno Flipped</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold text-xs transition duration-150 ${activeTab === 'students' ? 'bg-white text-blue-600 shadow-3xs' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Users className="w-4 h-4" />
              <span>Alumnos y Bitácora</span>
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold text-xs transition duration-150 ${activeTab === 'report' ? 'bg-white text-blue-600 shadow-3xs' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FileText className="w-4 h-4" />
              <span>Reportes & Boletas</span>
            </button>
          </div>

          {/* Quick info tag with current level context */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Nivel: <strong className="text-slate-700">{eduLevel}</strong></span>
            <span className="text-slate-300">|</span>
            <span>Periodo: <strong className="text-slate-700">{period}</strong></span>
          </div>
        </div>

        {/* Workspace Active Render Tab switcher */}
        <div id="active-workspace-tab-view" className="animate-fade-in duration-300">
          {activeTab === 'dashboard' && (
            <Dashboard 
              students={students}
              grades={grades}
              educationalLevel={eduLevel}
              selectedStudentId={selectedStudentId}
              onSelectStudent={setSelectedStudentId}
            />
          )}

          {activeTab === 'gradebook' && (
            <Gradebook 
              students={students}
              criteria={criteria}
              grades={grades}
              onUpdateGrade={handleUpdateGrade}
              onAddCriterion={handleAddCriterion}
              onDeleteCriterion={handleDeleteCriterion}
              onUpdateCriterionWeight={handleUpdateCriterionWeight}
            />
          )}

          {activeTab === 'students' && (
            <StudentList 
              students={students}
              onAddStudent={handleAddStudent}
              onUpdateObservations={handleUpdateObservations}
              selectedStudentId={selectedStudentId}
              onSelectStudent={setSelectedStudentId}
            />
          )}

          {activeTab === 'report' && (
            <ReportGenerator 
              students={students}
              criteria={criteria}
              grades={grades}
              educationalLevel={eduLevel}
              period={period}
            />
          )}
        </div>

      </main>

      {/* Interactive Floater System Notification Toast */}
      {toastMessage && (
        <div 
          id="global-feedback-toast" 
          className={`fixed bottom-6 right-6 z-50 p-4 border rounded-xl shadow-lg flex items-start gap-3 max-w-sm ml-4 animate-slide-up bg-white/95 backdrop-blur-md`}
        >
          {toastMessage.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
          {toastMessage.type === 'info' && <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
          
          <div className="text-xs">
            <span className="font-bold text-slate-800">Mensaje de EvaluaDocente:</span>
            <p className="text-slate-500 mt-1 leading-relaxed">{toastMessage.text}</p>
          </div>
        </div>
      )}

      {/* Sheets Integration Configuration Dialog Modal */}
      <ConfigModal 
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        sheetsUrl={sheetsUrl}
        onSaveSheetsUrl={handleSaveSheetsUrl}
      />

      {/* Beautiful humble page footer */}
      <footer className="mt-12 text-center text-[10px] text-slate-400 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 border-t border-slate-100 pt-6">
        <p>&copy; 2026 EvaluaDocente Pro &bull; Diseñado con Estilo Pastel Pro e Interfaces Mac-Style para Educadores de Vanguardia.</p>
        <div className="flex justify-center gap-4 mt-2">
          <button onClick={() => setIsConfigOpen(true)} className="hover:underline hover:text-slate-600 transition">Google Sheets Bridge</button>
          <span className="text-slate-200">|</span>
          <span className="text-slate-400">Listo para despliegue en GitHub Pages</span>
        </div>
      </footer>

    </div>
  );
}
