import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    // 1. Busca o usuário apenas pelo e-mail
    const result = await query(
      'SELECT id, nome, email, senha_hash FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 401 });
    }

    const usuario = result.rows[0];

    // 2. Compara a senha digitada com o hash salvo no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

    if (senhaCorreta) {
      // Removemos a senha do objeto antes de enviar para o front
      const { senha: _, ...userSemSenha } = usuario;
      return NextResponse.json({ message: 'Login realizado!', user: userSemSenha });
    } else {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }
    
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}