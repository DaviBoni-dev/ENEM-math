import { query } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { questaoId, opcaoEscolhida, acertou } = await request.json();

    // Inserindo a resposta vinculada ao ID do usuário logado
    await query(
      `INSERT INTO historico_respostas (usuario_id, questao_id, opcao_escolhida, acertou) 
       VALUES ($1, $2, $3, $4)`,
      [session.user.id, questaoId, opcaoEscolhida, acertou]
    );

    return NextResponse.json({ message: "Resposta salva!" }, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar resposta:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}