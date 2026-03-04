'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Bell, Settings, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between sticky top-0 z-50 w-full">
      {/* Esquerda: Logo */}
      <div className="flex-1">
        <Link href="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">∑</div>
          MathFlow
        </Link>
      </div>

      {/* Centro: Links de Navegação */}
      <div className="flex gap-8 text-sm font-medium text-slate-600">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
        <Link href="/provas" className="hover:text-indigo-600 transition-colors">Provas</Link>
        <Link href="/temas" className="hover:text-indigo-600 transition-colors">Aprender</Link>
      </div>

      {/* Direita: Notificações e Perfil */}
      <div className="flex-1 flex items-center justify-end gap-6">
        <div className="flex items-center gap-4 border-r pr-6 border-slate-200">
          <Bell className="w-5 h-5 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" />
          <Settings className="w-5 h-5 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" />
        </div>

        {session ? (
          <div className="group relative flex items-center gap-3 cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{session.user?.name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Estudante</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm overflow-hidden">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user?.name || 'Davi'}`} 
                alt="Profile" 
              />
            </div>
            
            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto z-[60]">
              <button 
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold"
              >
                <LogOut className="w-4 h-4" /> Sair da conta
              </button>
            </div>
          </div>
        ) : (
          <Link href="/login" className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}