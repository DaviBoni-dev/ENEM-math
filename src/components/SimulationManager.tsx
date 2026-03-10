'use client';

import { useState } from 'react';
import QuestionCard from './QuestionCard';
import Timer from './Timer';
import { CheckCircle, XCircle, Clock, BarChart3, ArrowRight } from 'lucide-react';

export default function SimulationManager({ questoes, modo }: { questoes: any[], modo: string }) {
  const [respostas, setRespostas] = useState<{ [key: number]: string }>({});
  const [finalizado, setFinalizado] = useState(false);
  const [verAnalise, setVerAnalise] = useState(false);

  const finalizar = () => setFinalizado(true);

  // Cálculos de Engenharia
  const totalRespondidas = Object.keys(respostas).length;
  const acertos = questoes.filter(q => respostas[q.id] === q.resposta_correta).length;
  const precisao = totalRespondidas > 0 ? Math.round((acertos / totalRespondidas) * 100) : 0;

  // Visual de Resumo (O que aparece primeiro)
  if (finalizado && !verAnalise) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="inline-flex p-4 bg-indigo-50 rounded-2xl text-indigo-600">
          <BarChart3 className="w-12 h-12" />
        </div>
        
        <div>
          <h2 className="text-3xl font-black text-slate-900">Simulado Finalizado!</h2>
          <p className="text-slate-500 mt-2">Veja como foi o seu desempenho técnico.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl">
            <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <span className="block text-2xl font-black">{acertos}/{questoes.length}</span>
            <span className="text-xs font-bold text-slate-400 uppercase">Acertos</span>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl">
            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <span className="block text-2xl font-black">2.4 min</span>
            <span className="text-xs font-bold text-slate-400 uppercase">Tempo Médio</span>
          </div>
          <div className="p-6 bg-indigo-600 rounded-2xl text-white">
            <span className="block text-3xl font-black">{precisao}%</span>
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Precisão Real</span>
          </div>
        </div>

        <button 
          onClick={() => setVerAnalise(true)}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
        >
          Analisar Questão por Questão <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Visual de Prova ou de Análise
  return (
    <div className="space-y-8">
      {!finalizado && <Timer />}
      
      {questoes.map((q) => (
        <QuestionCard 
          key={q.id} 
          questao={q} 
          modo={modo} 
          valorInicial={respostas[q.id]} 
          onSelect={(label) => setRespostas({ ...respostas, [q.id]: label })}
          revelarExterno={verAnalise}
        />
      ))}

      {!finalizado && (
        <button 
          onClick={finalizar}
          className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl shadow-xl hover:scale-[1.02] transition-all"
        >
          FINALIZAR SIMULADO
        </button>
      )}
    </div>
  );
}