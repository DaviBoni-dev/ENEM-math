'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend: string;
  isTrendPositive?: boolean;
}

export default function StatCard({ icon, label, value, trend, isTrendPositive }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-black text-slate-900">{value}</h3>
        <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${
          isTrendPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
        }`}>
          {trend}
        </span>
      </div>
    </div>
  );
}