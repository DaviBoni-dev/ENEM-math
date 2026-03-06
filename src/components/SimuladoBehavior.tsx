'use client';

import { useEffect } from 'react';

export default function SimuladoBehavior({ modo }: { modo?: string }) {
  useEffect(() => {
    if (modo === 'simulado') {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "Você perderá o progresso do simulado se sair agora."; 
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Remove o evento quando o componente for destruído
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [modo]);

  return null; // Não desenha nada na tela
}