import React from 'react';
import { CheckCircle2, Bookmark } from 'lucide-react';

interface RequirementItem {
  num: number;
  title: string;
}

interface PMVRequirementBadgeProps {
  requirements: RequirementItem[];
}

export const PMVRequirementBadge: React.FC<PMVRequirementBadgeProps> = ({ requirements }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-3.5 rounded-2xl shadow-md border border-blue-800/80 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        
        {/* Header Title */}
        <div className="flex items-center space-x-2 text-xs font-bold text-flow-secondary uppercase tracking-wider">
          <div className="w-6 h-6 bg-flow-secondary text-white rounded-lg flex items-center justify-center font-extrabold text-xs shadow-sm">
            ✓
          </div>
          <span>Requerimiento PMV Cubierto</span>
        </div>

        {/* Badges List */}
        <div className="flex flex-wrap gap-2">
          {requirements.map((req) => (
            <div
              key={req.num}
              className="inline-flex items-center bg-blue-900/90 text-blue-100 border border-blue-600/80 px-3 py-1 rounded-xl text-xs font-semibold shadow-sm hover:border-flow-secondary transition-all"
            >
              <Bookmark className="w-3.5 h-3.5 text-flow-secondary mr-1.5 flex-shrink-0" />
              <span className="font-extrabold text-white mr-1.5 font-mono">Req. #{req.num}:</span>
              <span className="text-blue-100">{req.title}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
