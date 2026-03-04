import { query } from '@/lib/db';
import Link from 'next/link';

export default async function ProvasPage() {
  // Busca os anos que possuem questões no banco
  const result = await query('SELECT DISTINCT ano_enem FROM questoes ORDER BY ano_enem DESC');
  const anos = result.rows;

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Provas Anteriores</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {anos.map((prova) => (
            <Link key={prova.ano_enem} href={`/provas/${prova.ano_enem}`}>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 transition-all shadow-sm">
                <h2 className="text-xl font-bold">ENEM {prova.ano_enem}</h2>
                <p className="text-slate-500 text-sm">45 questões de Matemática</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}