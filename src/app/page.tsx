'use client'
import { Flame, Play, BookOpen, Target, Award, Calendar } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import Link from 'next/link';

interface TopicoStats {
  tema: string;
  total: number;
  acertos: number;
  precisao: number;
}

interface SimuladoRecente {
  id: number;
  ano_enem: string;
  total_questoes: number;
  total_acertos: number;
  tempo_segundos: number;
  precisao: number;
  criado_em: string;
}

function getNextEnemDate() {
  const now = new Date();
  let targetYear = now.getFullYear();
  let enemDate = new Date(targetYear, 10, 8); // 8 de Novembro

  if (now > enemDate) {
    targetYear += 1;
    enemDate = new Date(targetYear, 10, 8);
  }

  const diffMs = enemDate.getTime() - now.getTime();
  const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const diffMonths = Math.floor(diffDays / 30);

  return {
    year: targetYear,
    days: diffDays,
    months: diffMonths,
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({ total: 0, acertos: 0, taxa: 0, hoje: 0, streak: 0 });
  const [topicos, setTopicos] = useState<TopicoStats[]>([]);
  const [simuladosRecentes, setSimuladosRecentes] = useState<SimuladoRecente[]>([]);

  useEffect(() => {
    if (session) {
      fetch('/api/user/stats')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error("Erro ao carregar stats", err));

      fetch('/api/user/stats-by-topic')
        .then(res => res.json())
        .then(data => setTopicos(Array.isArray(data) ? data : []))
        .catch(err => console.error("Erro ao carregar tópicos", err));

      fetch('/api/user/simulados-recentes')
        .then(res => res.json())
        .then(data => setSimuladosRecentes(Array.isArray(data) ? data : []))
        .catch(err => console.error("Erro ao carregar simulados recentes", err));
    }
  }, [session]);

  const isPro = stats.taxa >= 70;
  const firstName = session?.user?.name ? session.user.name.split(' ')[0] : 'Estudante';
  const latestYear = simuladosRecentes.length > 0 ? simuladosRecentes[0].ano_enem : null;
  const countdown = getNextEnemDate();

  const DAILY_GOAL = 20;

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
            
            <Link href={latestYear ? `/provas/${latestYear}` : "/provas"}>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:scale-105">
                <Play className="w-4 h-4 fill-current" /> {latestYear ? `Continuar ENEM ${latestYear}` : "Iniciar Simulado"}
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
                trend={`${stats.acertos} acertos no total`} 
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
            <StatCard 
              icon={<Flame className="text-orange-500"/>} 
              label="DIAS SEGUIDOS" 
              value={`${stats.streak || 0}`} 
              trend={
                (stats.streak || 0) === 0 
                  ? "Comece sua sequência hoje!" 
                  : (stats.streak || 0) === 1 
                  ? "Primeiro dia! Continue firme." 
                  : "Sequência em chamas! 🔥"
              } 
              isTrendPositive={(stats.streak || 0) > 0}
            />
          </div>

          {/* Seção de Provas (Praticar) */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="text-indigo-600 w-5 h-5" /> Simulados Recentes
              </h3>
              <Link href="/provas" className="text-indigo-600 font-semibold text-sm hover:underline">Ver todas as provas</Link>
            </div>

            {simuladosRecentes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {simuladosRecentes.slice(0, 2).map((sim) => {
                  const minutos = Math.max(1, Math.round(sim.tempo_segundos / 60));
                  const cor = sim.precisao >= 70 ? 'bg-emerald-600' : sim.precisao >= 50 ? 'bg-indigo-600' : 'bg-amber-500';
                  const dataFormatada = new Date(sim.criado_em).toLocaleDateString('pt-BR');
                  return (
                    <ActionCard 
                      key={sim.id}
                      title={`ENEM ${sim.ano_enem}`} 
                      subtitle={`${sim.total_acertos} acertos de ${sim.total_questoes} questões`} 
                      progress={sim.precisao} 
                      color={cor}
                      footerText={`Tempo: ${minutos} min • ${dataFormatada}`}
                      href={`/provas/${sim.ano_enem}`}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Nenhum simulado finalizado ainda</h4>
                  <p className="text-slate-400 text-sm mt-1">
                    Pratique provas anteriores do ENEM no modo simulado ou livre para acompanhar sua evolução aqui.
                  </p>
                </div>
                <Link href="/provas">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all whitespace-nowrap shadow-md">
                    Escolher Prova
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Seção de Temas (Aprender) */}
        <div>
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-xl font-bold flex items-center gap-2">
      <Target className="text-indigo-600 w-5 h-5" /> Foco de Estudo
    </h3>
  </div>
  
  <div className="space-y-4">
    {topicos.length > 0 ? topicos.map((topico) => (
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
              <span className="bg-white/20 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Desafio Rápido</span>
              <h4 className="text-xl font-bold mt-4 mb-2">Treino Aleatório</h4>
              <p className="text-indigo-100 text-xs mb-6">Resolva 10 questões variadas do banco para aquecer e manter o seu streak ativo.</p>
              <Link href="/praticar/aleatorio" className="block">
                <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all">
                  Resolver Agora
                </button>
              </Link>
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
                  <p className="text-sm font-bold">ENEM {countdown.year} - Dia 1</p>
                  <p className="text-[10px] text-slate-400">
                    {countdown.months > 1 ? `Faltam aproximadamente ${countdown.months} meses` : `Faltam ${countdown.days} dias`}
                  </p>
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

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  isTrendPositive?: boolean;
}

function StatCard({ icon, label, value, trend, isTrendPositive = false }: StatCardProps) {
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

interface ActionCardProps {
  title: string;
  subtitle: string;
  progress: number;
  color: string;
  footerText: string;
  href: string;
}

function ActionCard({ title, subtitle, progress, color, footerText, href }: ActionCardProps) {
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