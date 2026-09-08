import { query } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json([], { status: 200 });

  try {
    const result = await query(
      `SELECT 
          id,
          ano_enem,
          total_questoes,
          total_acertos,
          tempo_segundos,
          criado_em,
          CASE 
              WHEN total_questoes > 0 THEN ROUND((total_acertos * 100.0) / total_questoes)::int
              ELSE 0 
          END AS precisao
       FROM simulados_concluidos 
       WHERE usuario_id = $1
       ORDER BY criado_em DESC
       LIMIT 4`,
      [session.user.id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Erro ao carregar simulados recentes:", error);
    return NextResponse.json([], { status: 500 });
  }
}

