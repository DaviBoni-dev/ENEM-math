import { query } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const { ano, total, acertos, tempo, respostas } = await request.json();

    // 1. Salva o resumo do simulado
    await query(
      `INSERT INTO simulados_concluidos (usuario_id, ano_enem, total_questoes, total_acertos, tempo_segundos)
       VALUES ($1, $2, $3, $4, $5)`,
      [session.user.id, ano, total, acertos, tempo]
    );

    // 2. Salva cada resposta individual no histórico geral (para o Dashboard)
    // Transformamos o objeto de respostas em um array para inserir em lote
    const entries = Object.entries(respostas);
    for (const [questaoId, opcao] of entries) {
      // Busca a resposta correta para validar antes de salvar
      const qResult = await query('SELECT resposta_correta FROM questoes WHERE id = $1', [questaoId]);
      const acertou = qResult.rows[0].resposta_correta === opcao;

      await query(
        `INSERT INTO historico_respostas (usuario_id, questao_id, opcao_escolhida, acertou)
         VALUES ($1, $2, $3, $4)`,
        [session.user.id, questaoId, opcao, acertou]
      );
    }

    return NextResponse.json({ message: "Simulado salvo com sucesso!" }, { status: 201 });
  } catch (error) {
    console.error("Erro ao finalizar simulado:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}