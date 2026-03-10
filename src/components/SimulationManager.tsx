'use client';

import { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import Timer from './Timer';
import { CheckCircle, Clock, BarChart3, ArrowRight } from 'lucide-react';

export default function SimulationManager({ questoes, modo }: { questoes: any[], modo: string }) {
  const [respostas, setRespostas] = useState<{ [key: number]: string }>({});
  const [finalizado, setFinalizado] = useState(false);
  const [verAnalise, setVerAnalise] = useState(false);
  
  // --- NOVA LÓGICA DO CRONÓMETRO ---
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isActive && !finalizado) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, finalizado]);

  const finalizar = async () => {
    setIsActive(false); // Para o tempo
    setFinalizado(true);

    // Agora 'seconds' está definido aqui!
    try {
      await fetch('/api/simulados/finalizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ano: questoes[0].ano_enem,
          total: questoes.length,
          acertos: acertos,
          tempo: seconds, 
          respostas: respostas
        }),
      });
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  // Cálculos
  const totalRespondidas = Object.keys(respostas).length;
  const acertos = questoes.filter(q => respostas[q.id] === q.resposta_correta).length;
  const precisao = totalRespondidas > 0 ? Math.round((acertos / totalRespondidas) * 100) : 0;
  const tempoMedio = totalRespondidas > 0 ? (seconds / 60 / totalRespondidas).toFixed(1) : 0;

  if (finalizado && !verAnalise) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center space-y-8">
        <div className="inline-flex p-4 bg-indigo-50 rounded-2xl text-indigo-600">
          <BarChart3 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Simulado Finalizado!</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card de Acertos */}
        <div className="p-6 bg-slate-50 rounded-2xl text-center flex flex-col justify-center min-h-[120px]">
          <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-3" />
          <span className="block text-3xl font-black text-slate-900 leading-none">
            {acertos}/{questoes.length}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            Acertos
          </span>
        </div>

        {/* Card de Tempo */}
        <div className="p-6 bg-slate-50 rounded-2xl text-center flex flex-col justify-center min-h-[120px]">
          <Clock className="w-5 h-5 text-blue-500 mx-auto mb-3" />
          <span className="block text-3xl font-black text-slate-900 leading-none">
            {tempoMedio} min
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            Por Questão
          </span>
        </div>

        {/* Card de Precisão (Destaque) */}
        <div className="p-6 bg-indigo-600 rounded-2xl text-white text-center flex flex-col justify-center min-h-[120px] shadow-lg shadow-indigo-100">
          <span className="block text-4xl font-black leading-none">
            {precisao}%
          </span>
          <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mt-3">
            Precisão
          </span>
        </div>
      </div>

        <button 
          onClick={() => setVerAnalise(true)}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          Analisar Questões <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!finalizado && (
        <Timer 
          seconds={seconds} 
          isActive={isActive} 
          setIsActive={setIsActive} 
          resetTimer={() => setSeconds(0)} 
        />
      )}
      
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
          className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl shadow-xl transition-all"
        >
          FINALIZAR SIMULADO
        </button>
      )}
    </div>
  );
}