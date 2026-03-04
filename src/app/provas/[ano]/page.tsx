import { query } from '@/lib/db';
import QuestionCard from '@/components/QuestionCard';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Timer from '@/components/Timer'; // Importa o novo componente

export default async function ExamYearPage({ 
  params 
}: { 
  params: Promise<{ ano: string }> 
}) {
  // 1. "Desembrulhamos" o ano da URL (ex: /provas/2023)
  const { ano } = await params;

  // 2. Buscamos as questões deste ano específico no seu banco
  const result = await query(
    'SELECT * FROM questoes WHERE ano_enem = $1 AND disciplina = $2 ORDER BY id ASC',
    [ano, 'matematica']
  );
  const questoes = result.rows;

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Navegação de volta */}
        <Link 
          href="/" 
          className="flex items-center gap-2 text-indigo-600 font-semibold mb-8 hover:text-indigo-800 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
        </Link>

        {/* Cabeçalho da Prova */}
        <header className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Simulado Oficial</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900">ENEM {ano}</h1>
            <p className="text-slate-500 mt-1">Matemática e suas Tecnologias</p>
          </div>
          <div className="text-right">
            <span className="block text-3xl font-bold text-slate-900">{questoes.length}</span>
            <span className="text-xs font-bold text-slate-400 uppercase">Questões</span>
          </div>
        </header>

        <Timer />

        {/* Lista de Questões */}
        <div className="space-y-8">
          {questoes.length > 0 ? (
            questoes.map((q) => (
              <QuestionCard key={q.id} questao={q} />
            ))
          ) : (
            <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium">
                Ainda não importamos as questões de {ano} para o banco.
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Rode o seu script Python de ingestão no Ubuntu para atualizar!
              </p>
            </div>
          )}
        </div>

        {/* Rodapé de Finalização */}
        {questoes.length > 0 && (
          <footer className="mt-12 text-center pb-20">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all hover:scale-105">
              Finalizar Simulado
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}