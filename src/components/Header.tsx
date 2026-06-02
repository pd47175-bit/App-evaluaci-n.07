/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  FileSpreadsheet, 
  Settings, 
  RefreshCw, 
  GraduationCap, 
  Database, 
  CloudCheck, 
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { EducationalLevel, AssessmentPeriod } from '../types';

interface HeaderProps {
  educationalLevel: EducationalLevel;
  onSetEducationalLevel: (level: EducationalLevel) => void;
  period: AssessmentPeriod;
  onSetPeriod: (period: AssessmentPeriod) => void;
  sheetsUrl: string;
  onOpenConfig: () => void;
  onSyncNow: () => void;
  isSyncing: boolean;
}

export default function Header({
  educationalLevel,
  onSetEducationalLevel,
  period,
  onSetPeriod,
  sheetsUrl,
  onOpenConfig,
  onSyncNow,
  isSyncing,
}: HeaderProps) {
  
  // Available periods depending on educational level selected
  const availablePeriods: Record<EducationalLevel, AssessmentPeriod[]> = {
    'Básico': ['Bimestre 1', 'Bimestre 2', 'Bimestre 3', 'Bimestre 4', 'Bimestre 5'],
    'Medio': ['Trimestre 1', 'Trimestre 2', 'Trimestre 3'],
    'Superior': ['Semestre 1', 'Semestre 2']
  };

  const menuPeriods = availablePeriods[educationalLevel];

  // Safely auto-adjust period if level switches
  const handleLevelChange = (newLevel: EducationalLevel) => {
    onSetEducationalLevel(newLevel);
    // Grab first period of new level
    onSetPeriod(availablePeriods[newLevel][0]);
  };

  return (
    <header id="app-top-navigation-bar" className="w-full bg-white/95 border-b border-slate-100 sticky top-0 z-40 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand logo & platform descriptor */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-800 font-sans">EvaluaDocente <span className="text-blue-500 font-bold">Pro</span></h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Gestión Escolar Inteligente</p>
          </div>
        </div>

        {/* Configurations, selector filters & quick actions */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Level Switcher buttons */}
          <div className="flex border border-slate-150 rounded-xl bg-slate-50 p-0.5 overflow-hidden">
            {(['Básico', 'Medio', 'Superior'] as EducationalLevel[]).map(level => {
              const active = level === educationalLevel;
              return (
                <button
                  key={level}
                  onClick={() => handleLevelChange(level)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition duration-150 ${active ? 'bg-white text-slate-800 shadow-3xs border border-slate-150/10' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {level}
                </button>
              );
            })}
          </div>

          {/* Period Selection Dropdown */}
          <div className="relative">
            <select
              value={period}
              onChange={(e) => onSetPeriod(e.target.value as AssessmentPeriod)}
              className="appearance-none px-3.5 pr-8 py-1.5 border border-slate-150 bg-white hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-100 transition duration-150"
            >
              {menuPeriods.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span className="absolute right-3.5 top-2.5 pointer-events-none text-slate-400">
              <ChevronDown className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Google Sheets Live Status & Actions combo */}
          <div className="flex items-center gap-1.5 border border-slate-150 rounded-xl bg-slate-50/50 p-1">
            <button 
              onClick={onOpenConfig}
              className={`p-1 rounded-lg transition ${sheetsUrl ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              title="Configurar Google Sheets"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
            
            {sheetsUrl ? (
              <button 
                onClick={onSyncNow}
                disabled={isSyncing}
                className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-all flex items-center gap-1"
                title="Sincronizar ahora con Apps Script"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sync...' : 'Excel Sync'}
              </button>
            ) : (
              <button 
                onClick={onOpenConfig}
                className="px-2 py-0.5 text-[9px] text-slate-400 font-bold uppercase rounded hover:text-slate-600"
              >
                Conectar Sheets
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
