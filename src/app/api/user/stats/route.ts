import { query } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const result = await query(
      `SELECT 
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE acertou = TRUE)::int AS acertos,
          CASE 
              WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE acertou = TRUE) * 100.0) / COUNT(*), 1)
              ELSE 0 
          END AS taxa
       FROM historico_respostas
       WHERE usuario_id = $1`,
      [session.user.id]
    );

    // Retorna os dados exatos: { total: X, acertos: Y, taxa: Z }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar stats:", error);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}