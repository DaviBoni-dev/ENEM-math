# MathFlow - Plataforma de Matemática para o ENEM

O **MathFlow** é uma plataforma web interativa desenvolvida para estudantes se prepararem para a prova de **Matemática e suas Tecnologias** do ENEM (Exame Nacional do Ensino Médio).

---

## 🚀 Funcionalidades

- **Simulados Oficiais do ENEM**: Resolução de provas completas por ano (ex.: ENEM 2023, 2022).
- **Modos de Estudo**:
  - **Prática Livre**: Feedback imediato alternativa por alternativa, sem pressão de tempo.
  - **Modo Simulado**: Cronômetro em tempo real, respostas ocultas até o encerramento e confirmação para evitar saídas acidentais.
- **Treino por Temas**: Prática focada em tópicos específicos (Geometria, Funções, Probabilidade, etc.).
- **Desafio Aleatório**: Sorteio rápido de 10 questões para revisão geral.
- **Renderização Matemática de Alta Qualidade**: Suporte nativo a fórmulas e expressões em LaTeX via KaTeX.
- **Dashboard com Métricas Reais**: Taxa de precisão, meta diária de questões resolvidas e análise de domínio/reforço por área.
- **Autenticação Segura**: Login por e-mail e senha com hash seguro (bcryptjs) ou via Google OAuth (NextAuth).

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router) + [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) v4 + [Lucide React](https://lucide.dev/)
- **Renderização Matemática**: [KaTeX](https://katex.org/) & `react-katex`
- **Autenticação**: [NextAuth.js](https://next-auth.js.org/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) via `pg` pool

---

## 🏁 Como Começar

### 1. Pré-requisitos
- Node.js 20+
- PostgreSQL configurado e rodando localmente

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz com:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/enem_matematica
NEXTAUTH_SECRET=sua_chave_secreta_aqui
NEXTAUTH_URL=http://localhost:3000

# Opcional: Login Google
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
```

### 3. Instalar Dependências e Executar
```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.
