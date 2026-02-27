import { query } from '@/lib/db';

// Interface para tipar nossos dados (boa prática de engenharia!)
interface Questao {
  id: number;
  enunciado: string;
  comando: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  alternativa_e: string;
  ano_enem: number;
  url_imagem_principal: string | null;
}

export default async function HomePage() {
  // 1. Busca os dados diretamente do seu Postgres no Ubuntu
  const result = await query(
    'SELECT * FROM questoes  ORDER BY id ASC LIMIT 30'
  );
  const questoes: Questao[] = result.rows;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            Plataforma ENEM Matemática
          </h1>
          <p className="text-gray-600">
            Treine com questões reais e acompanhe seu progresso.
          </p>
        </header>

        <div className="grid gap-8">
          {questoes.map((q) => (
            <section 
              key={q.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Questão {q.id} — ENEM {q.ano_enem}
                  </span>
                </div>

                {/* Enunciado */}
                <div className="prose max-w-none text-gray-800 mb-6">
                  <p className="whitespace-pre-wrap">{q.enunciado}</p>
                </div>

                {/* Imagem da Questão (se houver) */}
                {q.url_imagem_principal && (
                  <div className="my-6 flex justify-center bg-gray-50 p-4 rounded-lg">
                    <img 
                      src={q.url_imagem_principal} 
                      alt={`Imagem da questão ${q.id}`}
                      className="max-h-80 object-contain"
                    />
                  </div>
                )}

                {/* Comando da Questão */}
                <p className="font-bold text-gray-900 mb-4">{q.comando}</p>

                {/* Alternativas */}
                <div className="grid gap-3">
                  {[
                    { label: 'A', text: q.alternativa_a },
                    { label: 'B', text: q.alternativa_b },
                    { label: 'C', text: q.alternativa_c },
                    { label: 'D', text: q.alternativa_d },
                    { label: 'E', text: q.alternativa_e },
                  ].map((alt) => (
                    <button
                      key={alt.label}
                      className="flex items-center w-full p-3 text-left border rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors group"
                    >
                      <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md mr-4 group-hover:bg-indigo-200 font-bold">
                        {alt.label}
                      </span>
                      <span className="text-gray-700">{alt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}