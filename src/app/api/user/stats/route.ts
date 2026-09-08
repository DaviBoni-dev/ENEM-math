import { query } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Off" }, { status: 401 });

  try {
    const statsResult = await query(
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

    // Cálculo da sequência de dias consecutivos (Streak)
    const streakResult = await query(
      `SELECT DISTINCT data_resposta::date AS dia
       FROM historico_respostas
       WHERE usuario_id = $1
       ORDER BY dia DESC
       LIMIT 60`,
      [session.user.id]
    );

    let streak = 0;
    if (streakResult.rows.length > 0) {
      const dates: string[] = streakResult.rows.map(r => {
        const d = new Date(r.dia);
        return d.toISOString().split('T')[0];
      });

      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (dates.includes(todayStr) || dates.includes(yesterdayStr)) {
        streak = 1;
        const startDate = dates.includes(todayStr) ? today : yesterday;
        const checkDate = new Date(startDate);

        while (true) {
          checkDate.setDate(checkDate.getDate() - 1);
          const checkStr = checkDate.toISOString().split('T')[0];
          if (dates.includes(checkStr)) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    const data = statsResult.rows[0] || { total: 0, acertos: 0, taxa: 0, hoje: 0 };
    return NextResponse.json({
      ...data,
      streak
    });
  } catch (error) {
    console.error("Erro ao carregar estatísticas do usuário:", error);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}