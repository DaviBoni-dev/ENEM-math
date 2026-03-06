import { query } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Off" }, { status: 401 });

  try {
    const result = await query(
      `SELECT 
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE acertou = TRUE)::int AS acertos,
          -- Contagem específica para o dia de hoje
          COUNT(*) FILTER (WHERE data_resposta::date = CURRENT_DATE)::int AS hoje,
          CASE 
              WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE acertou = TRUE) * 100.0) / COUNT(*), 1)
              ELSE 0 
          END AS taxa
       FROM historico_respostas 
       WHERE usuario_id = $1`,
      [session.user.id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}