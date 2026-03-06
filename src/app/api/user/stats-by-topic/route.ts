import { query } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Off" }, { status: 401 });

  try {
    // Engenharia: Unimos o histórico com a tabela de questões para saber o tema
    const result = await query(
      `SELECT 
          q.tema,
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE h.acertou = TRUE)::int AS acertos,
          ROUND((COUNT(*) FILTER (WHERE h.acertou = TRUE) * 100.0) / COUNT(*), 1) AS precisao
       FROM historico_respostas h
       JOIN questoes q ON h.questao_id = q.id
       WHERE h.usuario_id = $1
       GROUP BY q.tema
       ORDER BY precisao DESC`,
      [session.user.id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar temas" }, { status: 500 });
  }
}