import { query } from '@/lib/db';
import QuestionCard from '@/components/QuestionCard';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Timer from '@/components/Timer';
import SimuladoBehavior from '@/components/SimuladoBehavior'; // Vamos criar este abaixo

export default async function ExamYearPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ ano: string }>,
  searchParams: Promise<{ modo?: string }>
}) {
  const { ano } = await params;
  const { modo } = await searchParams; // O Next.js permite ler searchParams no servidor!

  const result = await query(
    'SELECT * FROM questoes WHERE ano_enem = $1 AND disciplina = $2 ORDER BY id ASC',
    [ano, 'matematica']
  );
  const questoes = result.rows;

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      {/* Componente que lida com o bloqueio de saída apenas se for simulado */}
      <SimuladoBehavior modo={modo} />
      
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-indigo-600 font-semibold mb-8 hover:text-indigo-800 w-fit">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
        </Link>

        <header className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-10 flex justify-between items-center">
          <div>
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

        <Timer />

        <div className="space-y-8">
          {questoes.map((q) => (
            // Passamos o modo para o QuestionCard para ele saber se esconde o gabarito
            <QuestionCard key={q.id} questao={q} modo={modo} />
          ))}
        </div>

        {questoes.length > 0 && (
          <footer className="mt-12 text-center pb-20">
            <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg">
              Finalizar Simulado
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}