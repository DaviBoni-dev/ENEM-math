'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link'; // Importante para a navegação interna
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault(); // 1. Impede o recarregamento da página
  setError('');       // 2. Limpa erros anteriores
  setLoading(true);   // 3. Inicia estado de loading

  const res = await signIn('credentials', {
    email,
    senha,
    redirect: false, // 4. Mantém o controle no cliente para tratar erros
  });

  setLoading(false); // 5. Finaliza o loading

  if (res?.ok) {
    // 6. Login feito com sucesso! O cookie já foi salvo pelo NextAuth
    router.push('/'); 
  } else {
    // 7. Se falhou (res.error conterá o motivo, ex: "CredentialsSignin")
    setError('E-mail ou senha incorretos.');
  }
};

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">∑</div>
          <h1 className="text-3xl font-black text-slate-900">MathFlow</h1>
          <p className="text-slate-500 mt-2 text-sm">Entre para continuar os seus estudos.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Campo de E-mail */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="exemplo@ufes.br"
                required
              />
            </div>
          </div>

          {/* Campo de Senha */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="password" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center animate-pulse">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'} <ArrowRight className="w-5 h-5" />
          </button>

          <div className="mt-6 space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-4 text-xs text-slate-400 font-bold uppercase absolute">ou</span>
            </div>

            <button 
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-sm active:scale-95"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" className="w-5 h-5" />
              <span>Entrar com Google</span>
            </button>
          </div>
        </form>

        {/* --- O NOVO LOCAL PARA CADASTRO --- */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Ainda não tem uma conta?{' '}
            <Link href="/signup" className="text-indigo-600 font-bold hover:underline transition-all">
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}