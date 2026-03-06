import { query } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Você precisa estar logado." }, { status: 401 });
  }

  try {
    const { questaoId, opcaoEscolhida, acertou } = await request.json();

    await query(
      `INSERT INTO historico_respostas (usuario_id, questao_id, opcao_escolhida, acertou) 
       VALUES ($1, $2, $3, $4)`,
      [session.user.id, questaoId, opcaoEscolhida, acertou]
    );

    return NextResponse.json({ message: "Gravado com sucesso!" }, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar no Postgres:", error);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}