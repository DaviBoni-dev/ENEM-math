'use client'
import { Search, Bell, Flame, Star, Clock, Play, BookOpen, Target, Award, Calendar } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({ total: 0, acertos: 0, taxa: 0, hoje: 0 });

  useEffect(() => {
    if (session) {
      fetch('/api/user/stats')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error("Erro ao carregar stats", err));
    }
  }, [session]);

  const [topicos, setTopicos] = useState([]);

    useEffect(() => {
      if (session) {
        fetch('/api/user/stats-by-topic')
          .then(res => res.json())
          .then(data => setTopicos(data));
      }
    }, [session]);

  const isPro = stats.taxa >= 70;
  const firstName = session?.user?.name ? session.user.name.split(' ')[0] : 'Estudante';

  const DAILY_GOAL = 20; // Sua meta como engenheiro focado

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans w-full overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-2">
                {status === "loading" ? (
                  <span className="animate-pulse bg-slate-200 h-10 w-48 block rounded-lg"></span>
                ) : (
                  `Bem-vindo de volta, ${firstName}! 👋`
                )}
              </h2>
              <p className="text-slate-500">
                {isPro ? "Desempenho de craque! Estás no caminho certo." : "Continua a praticar para veres os teus números subirem."}
              </p>
            </div>
            
            <Link href="/provas/2023">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:scale-105">
                <Play className="w-4 h-4 fill-current" /> Continuar Simulado
              </button>
            </Link>
          </div>

          {/* Grid de Estatísticas Reais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={isPro ? "ring-4 ring-amber-400 rounded-3xl transition-all" : ""}>
              <StatCard 
                icon={<Target className={isPro ? "text-amber-500" : "text-emerald-500"}/>} 
                label={isPro ? "PRECISÃO NÍVEL PRO" : "PRECISÃO GERAL"} 
                value={`${stats.taxa}%`} 
                trend={`${stats.acertos} acertos`} 
                isTrendPositive={isPro} 
              />
            </div>
            <StatCard 
              icon={<Award className="text-indigo-500"/>} 
              label="META DO DIA" 
              value={`${stats.hoje}/${DAILY_GOAL}`} 
              trend={stats.hoje >= DAILY_GOAL ? "Meta batida! 🔥" : `Faltam ${DAILY_GOAL - stats.hoje} questões`} 
              isTrendPositive={stats.hoje >= DAILY_GOAL}
            />
            <StatCard icon={<Flame className="text-orange-500"/>} label="DIAS SEGUIDOS" value="1" trend="Começa a tua sequência!" />
          </div>

          {/* Seção de Provas (Praticar) */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="text-indigo-600 w-5 h-5" /> Simulados Recentes
              </h3>
              <Link href="/provas" className="text-indigo-600 font-semibold text-sm hover:underline">Ver todas as provas</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ActionCard 
                title="ENEM 2023" 
                subtitle="Matemática e suas Tecnologias" 
                progress={75} 
                color="bg-indigo-600"
                footerText="Próxima meta: Logaritmos"
                href="/provas/2023"
              />
              <ActionCard 
                title="ENEM 2022" 
                subtitle="Matemática e suas Tecnologias" 
                progress={20} 
                color="bg-sky-500"
                footerText="Aguardando início"
                href="/provas/2022"
              />
            </div>
          </div>

          {/* Seção de Temas (Aprender) */}
        <div>
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-xl font-bold flex items-center gap-2">
      <Target className="text-indigo-600 w-5 h-5" /> Foco de Estudo
    </h3>
  </div>
  
  <div className="space-y-4">
    {topicos.length > 0 ? topicos.map((topico: any) => (
      <div key={topico.tema} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
         <div className="flex gap-4 items-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
              topico.precisao < 50 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {topico.precisao}%
            </div>
            <div>
              <h4 className="font-bold">{topico.tema}</h4>
              <p className="text-xs text-slate-400">
                {topico.acertos} acertos de {topico.total} tentativas
              </p>
            </div>
         </div>
         <div className="text-right">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase ${
              topico.precisao < 50 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              {topico.precisao < 50 ? 'Reforçar' : 'Domínio'}
            </span>
         </div>
      </div>
    )) : (
      <p className="text-slate-400 text-sm italic">Resolva mais questões para gerar sua análise por tema.</p>
    )}
  </div>
  </div>
  </div>

        {/* --- SIDEBAR (1/4) --- */}
        <div className="space-y-8">
          {/* Desafio do Dia */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <span className="bg-white/20 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Desafio Diário</span>
              <h4 className="text-xl font-bold mt-4 mb-2">Questão do Dia</h4>
              <p className="text-indigo-100 text-xs mb-6">Resolva uma questão de Geometria Espacial para manter seu streak.</p>
              <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all">
                Resolver Agora
              </button>
            </div>
            <Award className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10" />
          </div>

          {/* Próximos Eventos */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" /> Datas Importantes
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-50 text-red-600 p-2 rounded-lg text-center min-w-[45px]">
                  <span className="block text-xs font-bold uppercase">Nov</span>
                  <span className="text-lg font-black">08</span>
                </div>
                <div>
                  <p className="text-sm font-bold">ENEM 2026 - Dia 1</p>
                  <p className="text-[10px] text-slate-400">Faltam 8 meses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTES ---

function StatCard({ icon, label, value, trend, isTrendPositive = false }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className={`text-xs font-medium ${isTrendPositive ? 'text-emerald-500' : 'text-slate-400'}`}>
        {isTrendPositive && '↑ '} {trend}
      </div>
    </div>
  );
}

function ActionCard({ title, subtitle, progress, color, footerText, href }: any) {
  return (
    <Link href={href}>
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all cursor-pointer">
        <div className="flex gap-4 mb-6">
          <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white font-bold shadow-lg`}>
            {title.split(' ')[1]}
          </div>
          <div>
            <h4 className="font-bold group-hover:text-indigo-600 transition-colors">{title}</h4>
            <p className="text-slate-400 text-xs">{subtitle}</p>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-[10px] font-bold mb-1">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`${color} h-full rounded-full`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase">{footerText}</p>
      </div>
    </Link>
  );
}