'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      return setError('As senhas não coincidem.');
    }

    const res = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify({ nome: formData.nome, email: formData.email, senha: formData.senha }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.error || 'Erro ao criar conta.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900">Criar Conta</h1>
          <p className="text-slate-500 text-sm mt-2">Junte-se à jornada rumo à aprovação.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <Input icon={<User />} label="Nome" placeholder="Seu nome" 
            onChange={(v) => setFormData({...formData, nome: v})} />
          
          <Input icon={<Mail />} label="E-mail" type="email" placeholder="exemplo@ufes.br" 
            onChange={(v) => setFormData({...formData, email: v})} />

          <Input icon={<Lock />} label="Senha" type="password" placeholder="••••••••" 
            onChange={(v) => setFormData({...formData, senha: v})} />

          <Input icon={<Lock />} label="Confirmar Senha" type="password" placeholder="••••••••" 
            onChange={(v) => setFormData({...formData, confirmarSenha: v})} />

          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all">
            Começar a Estudar <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Já tem uma conta? <Link href="/login" className="text-indigo-600 font-bold hover:underline">Entre aqui</Link>
        </p>
      </div>
    </main>
  );
}

function Input({ icon, label, type = "text", placeholder, onChange }: any) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5">{icon}</div>
        <input 
          type={type}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
          required
        />
      </div>
    </div>
  );
}