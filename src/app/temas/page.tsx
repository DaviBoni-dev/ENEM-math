import { query } from '@/lib/db';
import Link from 'next/link';

export default async function ThemesPage() {
  const result = await query('SELECT * FROM temas ORDER BY nome ASC');
  const temas = result.rows;

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Escolha um Tema</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {temas.map((tema) => (
            <Link 
              key={tema.id} 
              href={`/temas/${tema.id}`}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group"
            >
              <h2 className="text-xl font-semibold text-slate-800 group-hover:text-indigo-600">
                {tema.nome}
              </h2>
              <p className="text-slate-500 text-sm mt-1">{tema.area_geral}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}