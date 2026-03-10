'use client';

import { BookOpen, Target, Shuffle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PraticarPage() {
  const cards = [
    {
      title: "Por Prova",
      desc: "Simule a experiência real do ENEM por ano (Livre ou Simulado).",
      icon: <BookOpen className="w-6 h-6" />,
      href: "/provas", // Mantemos sua rota de anos aqui
      color: "bg-indigo-600"
    },
    {
      title: "Por Conteúdo",
      desc: "Foque nos seus pontos fracos separando questões por tema.",
      icon: <Target className="w-6 h-6" />,
      href: "/temas", 
      color: "bg-emerald-600"
    },
    {
      title: "Aleatório",
      desc: "Teste seu conhecimento geral com questões de diversos temas.",
      icon: <Shuffle className="w-6 h-6" />,
      href: "/praticar/aleatorio",
      color: "bg-orange-600"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900">O que vamos treinar hoje?</h1>
          <p className="text-slate-500 mt-2 text-lg">Escolha o modo que melhor se adapta ao seu plano de estudos.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <Link key={card.title} href={card.href} className="group">
              <div className="bg-white h-full p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col justify-between">
                <div>
                  <div className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                    {card.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">{card.title}</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                  ACESSAR MODO <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}