import { getClient } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const client = await getClient();

  try {
    const { ano, total, acertos, tempo, respostas, modo } = await request.json();

    await client.query('BEGIN');

    // 1. Salva o resumo do simulado concluído
    await client.query(
      `INSERT INTO simulados_concluidos (usuario_id, ano_enem, total_questoes, total_acertos, tempo_segundos)
       VALUES ($1, $2, $3, $4, $5)`,
      [session.user.id, ano || 'Geral', total, acertos, tempo]
    );

    // 2. Se for modo 'simulado', salva as respostas no histórico individual em lote.
    // (No modo livre, cada resposta já é gravada imediatamente no momento do clique)
    if (modo === 'simulado' && respostas && typeof respostas === 'object') {
      const entries = Object.entries(respostas);
      for (const [questaoId, opcao] of entries) {
        const qResult = await client.query('SELECT resposta_correta FROM questoes WHERE id = $1', [questaoId]);
        if (qResult.rows.length > 0) {
          const acertou = qResult.rows[0].resposta_correta === opcao;

          await client.query(
            `INSERT INTO historico_respostas (usuario_id, questao_id, opcao_escolhida, acertou)
             VALUES ($1, $2, $3, $4)`,
            [session.user.id, questaoId, opcao, acertou]
          );
        }
      }
    }

    await client.query('COMMIT');
    return NextResponse.json({ message: "Simulado salvo com sucesso!" }, { status: 201 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Erro ao finalizar simulado:", error);
    return NextResponse.json({ error: "Erro interno ao processar simulado" }, { status: 500 });
  } finally {
    client.release();
  }
}