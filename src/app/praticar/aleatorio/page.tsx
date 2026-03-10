'use client';

import { useEffect, useState } from 'react';
import SimulationManager from '@/components/SimulationManager';
import Link from 'next/link';
import { ArrowLeft, Shuffle } from 'lucide-react';

export default function PraticarAleatorioPage() {
  const [questoes, setQuestoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/questoes/aleatorio')
      .then(res => res.json())
      .then(data => {
        setQuestoes(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/praticar" className="flex items-center gap-2 text-indigo-600 font-semibold mb-8 hover:text-indigo-800 w-fit">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Menu Praticar
        </Link>

        <header className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <Shuffle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Desafio Geral</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900">Modo Aleatório</h1>
            <p className="text-slate-500 mt-1">10 questões sorteadas para testar seu conhecimento geral.</p>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-slate-500 mt-4 font-medium">Sorteando questões no banco...</p>
          </div>
        ) : (
          <SimulationManager questoes={questoes} modo="livre" />
        )}
      </div>
    </main>
  );
}