import { query } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import SimuladoBehavior from '@/components/SimuladoBehavior';
import SimulationManager from '@/components/SimulationManager'; // 1. Importe o Manager que criamos

export default async function ExamYearPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ ano: string }>,
  searchParams: Promise<{ modo?: string }>
}) {
  const { ano } = await params;
  const { modo = 'livre' } = await searchParams;

  // Busca as questões do banco no Ubuntu
  const result = await query(
    'SELECT * FROM questoes WHERE ano_enem = $1 AND disciplina = $2 ORDER BY id ASC',
    [ano, 'matematica']
  );
  const questoes = result.rows;

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      {/* Lógica de bloqueio de saída */}
      <SimuladoBehavior modo={modo || 'livre'} />
      
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/provas" 
          className="flex items-center gap-2 text-indigo-600 font-semibold mb-8 hover:text-indigo-800 w-fit transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Provas
        </Link>

        {/* Cabeçalho dinâmico */}
        <header className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Simulado Oficial</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900">ENEM {ano}</h1>
            <p className="text-slate-500 mt-1">
              {modo === 'simulado' ? '🔴 Modo Simulado Ativo' : '🟢 Prática Livre'}
            </p>
          </div>
          <div className="text-right">
            <span className="block text-3xl font-bold text-slate-900">{questoes.length}</span>
            <span className="text-xs font-bold text-slate-400 uppercase">Questões</span>
          </div>
        </header>

        {/* 2. O SimulationManager substitui o Timer, o Loop e o Botão de Finalizar */}
        {questoes.length > 0 ? (
          <SimulationManager questoes={questoes} modo={modo || 'livre'} />
        ) : (
          <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-medium">Ainda não importamos as questões de {ano}.</p>
            <p className="text-sm text-slate-400 mt-2">Rode o script de ingestão no seu computador.</p>
          </div>
        )}
      </div>
    </main>
  );
}