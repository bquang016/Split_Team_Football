import React from 'react';
import { FORMATION_PRESETS_7V7 } from '../../utils/constants';

interface FormationPresetProps {
  onSelectFormation: (formationIndex: number) => void;
  activeFormation?: number;
}

export const FormationPreset: React.FC<FormationPresetProps> = ({
  onSelectFormation,
  activeFormation,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-mono font-bold uppercase text-slate-500 mr-1">
        Sơ đồ mẫu:
      </span>
      {FORMATION_PRESETS_7V7.map((f, idx) => (
        <button
          key={f.name}
          type="button"
          onClick={() => onSelectFormation(idx)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeFormation === idx
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs'
          }`}
        >
          {f.name}
        </button>
      ))}
    </div>
  );
};
