import { query } from '@/lib/db';
import QuestionCard from '@/components/QuestionCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// 1. Note que agora tipamos o params como uma Promise
export default async function FilteredQuestionsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  
  // 2. Aqui está o segredo: precisamos dar await no params antes de usar
  const { id } = await params;

  let temaNome = "Tema não encontrado";
  let questoes = [];

  try {
    const themeInfo = await query('SELECT nome FROM temas WHERE id = $1', [id]);
    const questionsResult = await query(
      'SELECT * FROM questoes WHERE tema_id = $1 ORDER BY ano_enem DESC',
      [id]
    );

    temaNome = themeInfo.rows[0]?.nome || "Tema não encontrado";
    questoes = questionsResult.rows;
  } catch (error) {
    console.error('Erro ao carregar questões por tema:', error);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/temas" className="text-indigo-600 hover:underline mb-4 inline-block">
          ← Voltar para temas
        </Link>
        
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">{temaNome}</h1>
          <p className="text-slate-500">{questoes.length} questões encontradas</p>
        </header>

        <div className="space-y-6">
          {questoes.length > 0 ? (
            questoes.map((q) => <QuestionCard key={q.id} questao={q} />)
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">Nenhuma questão tagueada para este tema ainda.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}