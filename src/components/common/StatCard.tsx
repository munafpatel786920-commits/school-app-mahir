import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple';
  onClick?: () => void;
}

const colorMap = {
  indigo: {
    bg: 'bg-indigo-50/80',
    text: 'text-indigo-600',
    border: 'border-indigo-100',
    hover: 'hover:border-indigo-300'
  },
  emerald: {
    bg: 'bg-emerald-50/80',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    hover: 'hover:border-emerald-300'
  },
  amber: {
    bg: 'bg-amber-50/80',
    text: 'text-amber-600',
    border: 'border-amber-100',
    hover: 'hover:border-amber-300'
  },
  rose: {
    bg: 'bg-rose-50/80',
    text: 'text-rose-600',
    border: 'border-rose-100',
    hover: 'hover:border-rose-300'
  },
  sky: {
    bg: 'bg-sky-50/80',
    text: 'text-sky-600',
    border: 'border-sky-100',
    hover: 'hover:border-sky-300'
  },
  purple: {
    bg: 'bg-purple-50/80',
    text: 'text-purple-600',
    border: 'border-purple-100',
    hover: 'hover:border-purple-300'
  }
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  icon: Icon,
  color,
  onClick
}) => {
  const scheme = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl p-5 border ${scheme.border} ${
        onClick ? `cursor-pointer transition-all duration-200 hover:shadow-md ${scheme.hover}` : ''
      } shadow-xs flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl ${scheme.bg} ${scheme.text} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        {subValue && <div className="text-xs font-medium text-slate-500 mt-1">{subValue}</div>}
      </div>
    </div>
  );
};
