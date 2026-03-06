'use client';

import { useState } from 'react';

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
    url_imagem_principal: string | null;
    ano_enem :string;
    tema: string;
  };
  modo?: string;
}

export default function QuestionCard({ questao, modo }: QuestaoProps) {
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null);
  const [revelar, setRevelar] = useState(false);

  const alternativas = [
    { label: 'A', text: questao.alternativa_a },
    { label: 'B', text: questao.alternativa_b },
    { label: 'C', text: questao.alternativa_c },
    { label: 'D', text: questao.alternativa_d },
    { label: 'E', text: questao.alternativa_e },
  ];

  const handleClique = async (label: string) => {
    if (!revelar) {
      setRespostaSelecionada(label);
      
      if(modo != 'simulado')
      setRevelar(true);

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

        <div className="mt-4 text-gray-800 whitespace-pre-wrap">{questao.enunciado}</div>

        {questao.url_imagem_principal && (
          <div className="my-6 flex justify-center bg-gray-50 p-4 rounded-lg">
            <img src={questao.url_imagem_principal} alt="Questão" className="max-h-80 object-contain" />
          </div>
        )}

        <p className="font-bold text-gray-900 mt-4 mb-6">{questao.comando}</p>

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
        (revelar && isCorrect) || (!revelar && isSelected) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
      } ${revelar && isCorrect ? 'bg-green-500' : ''}`}>
        {alt.label}
      </span>
      <span className="flex-1">{alt.text}</span>
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
              onClick={() => { setRevelar(false); setRespostaSelecionada(null); }}
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