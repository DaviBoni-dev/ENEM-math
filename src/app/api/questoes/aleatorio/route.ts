import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Seleciona 10 questões aleatórias do banco
    const result = await query(
      `SELECT * FROM questoes 
       WHERE disciplina = 'matematica' 
       ORDER BY RANDOM() 
       LIMIT 10`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar questões aleatórias:", error);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}