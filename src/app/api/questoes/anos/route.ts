import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mesma lógica que tinhas antes, mas agora dentro de uma API
    const result = await query('SELECT DISTINCT ano_enem FROM questoes ORDER BY ano_enem DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar anos das provas:", error);
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}