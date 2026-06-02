/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Criterion, Student, Grade, EducationalLevel, StudentCompetency, HistoricalGroupStats } from './types';

// Default Evaluation Criteria based on educational level
export const DEFAULT_CRITERIA: Record<EducationalLevel, Criterion[]> = {
  'Básico': [
    { id: 'b_asistencia', name: 'Asistencia y Puntualidad', weight: 20, description: 'Participación diaria y llegada a tiempo.', ratingType: 'numeric' },
    { id: 'b_conducta', name: 'Hábitos y Conducta', weight: 30, description: 'Respeto a las normas y trabajo en equipo.', ratingType: 'scale' },
    { id: 'b_actividades', name: 'Actividades de Clase', weight: 30, description: 'Esfuerzo realizado en dinámicas grupales.', ratingType: 'numeric' },
    { id: 'b_tareas', name: 'Tareas y Cuaderno', weight: 20, description: 'Entrega en tiempo de cuadernillos y dibujos.', ratingType: 'checklist' }
  ],
  'Medio': [
    { id: 'm_examenes', name: 'Pruebas y Exámenes', weight: 40, description: 'Exámenes teóricos y de opción múltiple.', ratingType: 'numeric' },
    { id: 'm_proyectos', name: 'Proyecto de Aula', weight: 30, description: 'Trabajo práctico colaborativo por trimestre.', ratingType: 'scale' },
    { id: 'm_tareas', name: 'Tareas y Trabajos', weight: 20, description: 'Portafolio de evidencias y solución de guías.', ratingType: 'numeric' },
    { id: 'm_participacion', name: 'Participación Activa', weight: 10, description: 'Sustentación de ideas en debates.', ratingType: 'scale' }
  ],
  'Superior': [
    { id: 's_investigacion', name: 'Proyecto de Investigación', weight: 40, description: 'Tesina, marco teórico, y diseño metodológico.', ratingType: 'numeric' },
    { id: 's_examenes', name: 'Exámenes Teórico-Prácticos', weight: 30, description: 'Parciales de alta exigencia analítica.', ratingType: 'numeric' },
    { id: 's_seminarios', name: 'Defensa Oral y Seminarios', weight: 20, description: 'Exposición ante sinodales y participación.', ratingType: 'scale' },
    { id: 's_lecturas', name: 'Ensayos y Lecturas', weight: 10, description: 'Reportes de lectura especializados y crítica.', ratingType: 'checklist' }
  ]
};

// Realistic Latin American students list
export const INITIAL_STUDENTS: Student[] = [
  { id: 'std_01', name: 'Sofía Valentina Morales', email: 'sofia.morales@colegio.edu.mx', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', riskStatus: 'Excelente', observations: 'Excelente desempeño y liderazgo en proyectos grupales.' },
  { id: 'std_02', name: 'Mateo Alejandro Ruiz', email: 'mateo.ruiz@colegio.edu.mx', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', riskStatus: 'Normal', observations: 'Cumple con regularidad. Requiere afinar constancia en tareas.' },
  { id: 'std_03', name: 'Santiago Torres Solano', email: 'santiago.torres@colegio.edu.mx', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', riskStatus: 'En Riesgo', observations: 'Bajo rendimiento por faltas reiteradas. Canalizar con tutoría.' },
  { id: 'std_04', name: 'Valentina Romero Ortega', email: 'valentina.romero@colegio.edu.mx', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', riskStatus: 'Excelente', observations: 'Capacidad autónoma excepcional. Propone métodos alternativos.' },
  { id: 'std_05', name: 'Sebastián Mendoza Cárdenas', email: 'sebastian.mendoza@colegio.edu.mx', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', riskStatus: 'Normal', observations: 'Participativo en debates, aunque entrega con retrasos.' },
  { id: 'std_06', name: 'Camila Isabela Castro', email: 'camila.castro@colegio.edu.mx', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', riskStatus: 'Excelente', observations: 'Mantiene calificaciones perfectas. Apoya como mentora de grupo.' },
  { id: 'std_07', name: 'Diego Nicolás Martínez', email: 'diego.martinez@colegio.edu.mx', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80', riskStatus: 'En Riesgo', observations: 'Muy distraído en evaluaciones teóricas. Requiere plan de apoyo.' },
  { id: 'std_08', name: 'Isabella Estefanía Gómez', email: 'isabella.gomez@colegio.edu.mx', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', riskStatus: 'Normal', observations: 'Desempeño homogéneo. Ha mejorado su participación oral.' }
];

// Seed Grades standardizing scores to raw values 0-10
export const getInitialGrades = (levelToSeed: EducationalLevel, criterionList: Criterion[]): Grade[] => {
  const seedMap: Record<string, Record<string, number>> = {
    // Excelente Sofia (Morales)
    'std_01': { 'asistencia': 10, 'conducta': 9.5, 'actividades': 9.8, 'tareas': 10, 'examenes': 9.5, 'proyectos': 10, 'investigacion': 9.8, 'seminarios': 10, 'lecturas': 9.5 },
    // Normal Mateo
    'std_02': { 'asistencia': 8.5, 'conducta': 8, 'actividades': 7.5, 'tareas': 8, 'examenes': 7.2, 'proyectos': 8.5, 'investigacion': 8, 'seminarios': 7.8, 'lecturas': 8 },
    // En Riesgo Santiago
    'std_03': { 'asistencia': 5.5, 'conducta': 6.2, 'actividades': 5.0, 'tareas': 4.5, 'examenes': 5.2, 'proyectos': 5.8, 'investigacion': 5.0, 'seminarios': 5.5, 'lecturas': 4.0 },
    // Excelente Valentina
    'std_04': { 'asistencia': 10, 'conducta': 10, 'actividades': 9.7, 'tareas': 9.5, 'examenes': 9.8, 'proyectos': 9.7, 'investigacion': 10, 'seminarios': 9.5, 'lecturas': 10 },
    // Normal Sebastian
    'std_05': { 'asistencia': 8.0, 'conducta': 8.5, 'actividades': 8.0, 'tareas': 7.0, 'examenes': 7.8, 'proyectos': 8.2, 'investigacion': 7.5, 'seminarios': 8.5, 'lecturas': 7.0 },
    // Excelente Camila
    'std_06': { 'asistencia': 10, 'conducta': 9.8, 'actividades': 10, 'tareas': 9.8, 'examenes': 9.9, 'proyectos': 9.8, 'investigacion': 9.7, 'seminarios': 10, 'lecturas': 10 },
    // En Riesgo Diego
    'std_07': { 'asistencia': 6.0, 'conducta': 6.5, 'actividades': 5.5, 'tareas': 5.0, 'examenes': 4.8, 'proyectos': 5.2, 'investigacion': 4.5, 'seminarios': 5.0, 'lecturas': 5.0 },
    // Normal Isabella
    'std_08': { 'asistencia': 9.0, 'conducta': 8.8, 'actividades': 8.5, 'tareas': 8.7, 'examenes': 8.2, 'proyectos': 8.5, 'investigacion': 8.7, 'seminarios': 8.8, 'lecturas': 8.2 }
  };

  const grades: Grade[] = [];
  INITIAL_STUDENTS.forEach(student => {
    criterionList.forEach(crit => {
      // Find matches using sub-keys
      const searchKeys = Object.keys(seedMap[student.id]);
      let assignedScore = 8.5; // fallback default
      for (const sk of searchKeys) {
        if (crit.id.toLowerCase().includes(sk)) {
          assignedScore = seedMap[student.id][sk];
          break;
        }
      }
      grades.push({
        studentId: student.id,
        criterionId: crit.id,
        score: assignedScore
      });
    });
  });
  return grades;
};

// Competency dimensions depending on Educative Level
export const COMPETENCIES_BY_LEVEL: Record<EducationalLevel, string[]> = {
  'Básico': ['Socialización', 'Motricidad Fina/Gruesa', 'Creatividad', 'Lenguaje/Expresión', 'Atención en Clase'],
  'Medio': ['Razonamiento Crítico', 'Trabajo en Equipo', 'Investigación General', 'Sustentación Oral', 'Disciplina y Puntualidad'],
  'Superior': ['Rigor Metodológico', 'Liderazgo Académico', 'Aplicabilidad Práctica', 'Defensa de Ensayos', 'Capacidad de Análisis']
};

export const getStudentCompetencies = (studentId: string, level: EducationalLevel, averageScore: number): StudentCompetency[] => {
  const subjects = COMPETENCIES_BY_LEVEL[level];
  
  // Seed offsets per student specific profile
  const seedOffsets: Record<string, number[]> = {
    'std_01': [0.2, 0.5, -0.2, 0.4, 0.1], // Sofía: high leadership, slightly lower creativity
    'std_02': [-0.1, 0.2, 0.3, -0.4, 0.1], // Mateo: creative, shy in oral defense
    'std_03': [-0.6, -0.3, 0.1, -0.2, -0.7], // Santiago: low discipline, normal creativity
    'std_04': [0.3, -0.1, 0.5, 0.4, 0.3], // Valentina: high autonomy/critical thinking
    'std_05': [0.4, 0.3, -0.3, 0.5, -0.5], // Sebastián: verbal star, lower discipline
    'std_06': [0.2, 0.3, 0.2, 0.1, 0.4], // Camila: round star performer
    'std_07': [-0.4, 0.2, 0.1, -0.3, -0.6], // Diego: active practical, very low theory attention
    'std_08': [0.1, 0.2, 0.1, 0.3, 0.0] // Isabella: uniform improvement
  };

  const offsets = seedOffsets[studentId] || [0, 0, 0, 0, 0];
  
  return subjects.map((subject, idx) => {
    const rawScore = averageScore + (offsets[idx] * 4); // Scale the offset impact
    return {
      subject,
      score: Math.min(10, Math.max(0, parseFloat(rawScore.toFixed(1))))
    };
  });
};

// Historical analytics for group average trends
export const HISTORICAL_STATS: Record<EducationalLevel, HistoricalGroupStats[]> = {
  'Básico': [
    { period: 'Bimestre 1', average: 8.1 },
    { period: 'Bimestre 2', average: 8.3 },
    { period: 'Bimestre 3', average: 8.5 },
    { period: 'Bimestre 4', average: 8.4 },
    { period: 'Bimestre 5', average: 8.7 }
  ],
  'Medio': [
    { period: 'Trimestre 1', average: 7.4 },
    { period: 'Trimestre 2', average: 7.8 },
    { period: 'Trimestre 3', average: 8.1 }
  ],
  'Superior': [
    { period: 'Semestre 1', average: 7.1 },
    { period: 'Semestre 2', average: 7.6 }
  ]
};

// Grade distribution chart helper
export const getGradeDistribution = (grades: number[]) => {
  // Buckets: <5.0, 5.0-5.9, 6.0-6.9, 7.0-7.9, 8.0-8.9, 9.0-10
  const bins = [
    { name: '< 5.0', count: 0, fill: '#fda4af' },
    { name: '5.0 - 5.9', count: 0, fill: '#fecdd3' },
    { name: '6.0 - 6.9', count: 0, fill: '#fef3c7' },
    { name: '7.0 - 7.9', count: 0, fill: '#dbeafe' },
    { name: '8.0 - 8.9', count: 0, fill: '#bfdbfe' },
    { name: '9.0 - 10.0', count: 0, fill: '#bbf7d0' },
  ];

  grades.forEach(g => {
    if (g < 5.0) bins[0].count++;
    else if (g < 6.0) bins[1].count++;
    else if (g < 7.0) bins[2].count++;
    else if (g < 8.0) bins[3].count++;
    else if (g < 9.0) bins[4].count++;
    else bins[5].count++;
  });

  return bins;
};

// Generates correct Google Apps Script code to copy pasting into Google Sheet Settings
export const APPS_SCRIPT_TEMPLATE = `/*
  =========================================
  CÓDIGO DE GOOGLE APPS SCRIPT - EVALUADOCENTE PRO
  =========================================
  Instrucciones de instalación:
  1. En tu Google Sheet, ve a: Extensiones -> Apps Script
  2. Borra cualquier código existente y pega este bloque completo.
  3. Haz clic en "Implementar" -> "Nueva implementación".
  4. Tipo de implementación: "Aplicación web".
  5. Descripción: "EvaluaDocente Pro Gateway".
  6. Ejecutar como: "Tú" (tu correo).
  7. Quién tiene acceso: "Cualquiera" (necesario para la API).
  8. Autoriza los accesos, clona la URL generada y pégala en EvaluaDocente Pro.
*/

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = getSheetData(sheet);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: data
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var payload = JSON.parse(rawData);
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Limpiar tabla actual y reconstruir o insertar entradas
    sheet.clear();
    
    // Encabezados
    sheet.appendRow(["ID Alumno", "Nombre", "Email", "Nivel Educativo", "Materia / Periodo", "Nota Final", "Estatus"]);
    
    // Filas de datos
    payload.students.forEach(function(student) {
      sheet.appendRow([
        student.id,
        student.name,
        student.email,
        payload.level,
        payload.period,
        student.finalGrade,
        student.riskStatus
      ]);
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "¡Calificaciones exportadas con éxito a tu Google Sheet!"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheetData(sheet) {
  var range = sheet.getDataRange();
  var values = range.getValues();
  if (values.length <= 1) return [];
  
  var headers = values[0];
  var results = [];
  
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var item = {};
    for (var j = 0; j < headers.length; j++) {
      item[headers[j]] = row[j];
    }
    results.push(item);
  }
  return results;
}
`;
