import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { nome, email, senha } = await request.json();

    // 1. Verificamos se o usuário já existe
    const userExists = await query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 400 });
    }

    // 2. Geramos o hash da senha (Segurança de Engenharia)
    // O custo de $2^{10}$ iterações garante proteção contra brute-force.
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // 3. Inserimos no banco de dados local no Ubuntu
    await query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)',
      [nome, email, senhaHash]
    );

    return NextResponse.json({ message: 'Usuário criado com sucesso!' }, { status: 201 });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    return NextResponse.json({ error: 'Erro ao processar o cadastro.' }, { status: 500 });
  }
}