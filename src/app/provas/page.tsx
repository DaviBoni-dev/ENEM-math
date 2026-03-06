'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Zap, ShieldAlert, X } from 'lucide-react';

export default function ProvasPage() {
  const [anos, setAnos] = useState<{ano_enem: string}[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Como agora é 'use client', buscamos os dados via fetch ou useEffect
  useEffect(() => {
    fetch('/api/questoes/anos').then(res => res.json()).then(setAnos);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Provas Anteriores</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {anos.map((prova) => (
            <button 
              key={prova.ano_enem} 
              onClick={() => setSelectedYear(prova.ano_enem)}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 text-left transition-all shadow-sm group"
            >
              <h2 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">ENEM {prova.ano_enem}</h2>
              <p className="text-slate-500 text-sm">45 questões de Matemática</p>
            </button>
          ))}
        </div>

        {/* Modal de Seleção de Modo */}
        {selectedYear && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setSelectedYear(null)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2">ENEM {selectedYear}</h3>
              <p className="text-slate-500 mb-8 text-sm">Como você deseja realizar este simulado?</p>

              <div className="space-y-4">
                {/* Modo Livre */}
                <Link href={`/provas/${selectedYear}?modo=livre`} className="flex items-start gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-100 hover:bg-indigo-50 transition-all group">
                  <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><Zap className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Prática Livre</h4>
                    <p className="text-xs text-slate-500">Veja as respostas na hora e sem tempo limite.</p>
                  </div>
                </Link>

                {/* Modo Simulado */}
                <Link href={`/provas/${selectedYear}?modo=simulado`} className="flex items-start gap-4 p-4 rounded-2xl border-2 border-red-50 hover:border-red-100 hover:bg-red-50 transition-all group">
                  <div className="bg-red-100 p-3 rounded-xl text-red-600"><ShieldAlert className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Modo Simulado</h4>
                    <p className="text-xs text-slate-500">Tempo cronometrado, sem gabarito imediato e bloqueio de saída.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}