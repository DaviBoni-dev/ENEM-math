'use client';

import { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathText from './MathText';

interface QuestaoProps {
  questao: {
    id: number;
    enunciado: string;
    comando: string;
    alternativa_a: string;
    alternativa_b: string;
    alternativa_c: string;
    alternativa_d: string;
    alternativa_e: string;
    resposta_correta: string;
    urls_imagens: string[] | null;
    ano_enem :string;
    tema: string;
  };
  valorInicial?: string | null;
  onSelect?: (label: string) => void;
  revelarExterno?: boolean;
  modo?: string;
}

export default function QuestionCard({ questao, modo, onSelect, revelarExterno, valorInicial }: QuestaoProps) {
  const [respostaLocal, setRespostaLocal] = useState<string | null>(null);
  const [revelarLocal, setRevelarLocal] = useState(false);

  const respostaSelecionada = valorInicial !== undefined ? valorInicial : respostaLocal;
  const revelar = revelarExterno || revelarLocal;

  const alternativas = [
    { label: 'A', text: questao.alternativa_a },
    { label: 'B', text: questao.alternativa_b },
    { label: 'C', text: questao.alternativa_c },
    { label: 'D', text: questao.alternativa_d },
    { label: 'E', text: questao.alternativa_e },
  ];

  const handleClique = async (label: string) => {
    if (!revelar) {
      setRespostaLocal(label);
      if(onSelect) onSelect(label);
      
      if(modo != 'simulado')
       setRevelarLocal(true);

      // 2. Calculamos o acerto na hora
      const acertou = label === questao.resposta_correta;

      // 3. Chamamos a API para gravar no banco
      try {
        await fetch('/api/respostas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questaoId: questao.id,
            opcaoEscolhida: label,
            acertou: acertou
          }),
        });
        
        // Opcional: Console log para você debugar no terminal do navegador
        console.log("Resposta salva no banco com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar no banco:", error);
      }
    }
  };
 

  return (
    <section className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-8">
      <div className="p-6">
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          ENEM {questao.ano_enem}
        </span>

        <div className="mt-4 text-gray-800 whitespace-pre-wrap">
  <MathText text={questao.enunciado} />
</div>

        {/* RENDERIZAÇÃO DE MÚLTIPLAS IMAGENS */}
        {questao.urls_imagens && questao.urls_imagens.length > 0 && (
          <div className="my-6 space-y-4"> 
            {questao.urls_imagens.map((url, index) => (
              <div key={index} className="flex justify-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                <img 
                  src={url} 
                  alt={`Imagem ${index + 1} da questão`} 
                  className="max-h-80 object-contain shadow-sm" 
                />
              </div>
            ))}
          </div>
        )}

        <p className="font-bold text-gray-900 mt-4 mb-6">
  <MathText text={questao.comando} />
</p>

        <div className="grid gap-3">
          {alternativas.map((alt) => {
  const isCorrect = alt.label === questao.resposta_correta;
  const isSelected = alt.label === respostaSelecionada;
  
  let bgColor = "bg-white border-gray-200 hover:bg-indigo-50";

  if (revelar) {
    // Lógica original: mostra verde ou vermelho após o término
    if (isCorrect) bgColor = "bg-green-100 border-green-500 ring-2 ring-green-200";
    else if (isSelected) bgColor = "bg-red-100 border-red-500 ring-2 ring-red-200";
  } else if (isSelected) {
    // NOVA LÓGICA: Apenas destaca a opção marcada no Modo Simulado
    bgColor = "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200";
  }

  return (
    <button
      key={alt.label}
      onClick={() => handleClique(alt.label)}
      // No simulado, permitimos que o usuário mude a resposta enquanto não finalizar? 
      // Se sim, remova o "disabled={revelar}" ou ajuste a lógica.
      className={`flex items-center w-full p-4 text-left border rounded-xl transition-all ${bgColor}`}
    >
      <span className={`w-8 h-8 flex items-center justify-center rounded-lg mr-4 font-bold ${
        (revelar && isCorrect) || (!revelar && isSelected) ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
      } ${revelar && isCorrect ? 'bg-green-500' : ''}`}>
        {alt.label}
      </span>
     <span className="flex-1">
  <MathText text={alt.text} />
</span>
    </button>
  );
})}
        </div>

        {revelar && (
          <div className={`mt-6 p-4 rounded-lg font-bold text-center ${
            respostaSelecionada === questao.resposta_correta ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {respostaSelecionada === questao.resposta_correta 
              ? "✅ Resposta correta!" 
              : `❌ Incorreto. A resposta certa era a letra ${questao.resposta_correta}.`}
            <button 
              onClick={() => { setRevelarLocal(false); setRespostaLocal(null); onSelect?.(''); }}
              className="block mx-auto mt-2 text-sm underline opacity-70"
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </section>
  );
}