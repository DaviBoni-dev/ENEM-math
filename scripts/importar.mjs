/**
 * MathFlow - Script de Ingestão de Questões do ENEM
 * 
 * Uso:
 *   node scripts/importar.mjs
 *   node scripts/importar.mjs 2021 2022 2023
 *   node scripts/importar.mjs --url="postgresql://..." 2022 2023
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

// 1. Carrega variáveis de ambiente do .env.local caso não fornecida via argumento
let databaseUrl = process.env.DATABASE_URL;

const args = process.argv.slice(2);
const urlArg = args.find(a => a.startsWith('--url=') || a.startsWith('--database-url='));
if (urlArg) {
  databaseUrl = urlArg.split('=')[1];
}

if (!databaseUrl) {
  const envPath = resolve(__dirname, '../.env.local');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('DATABASE_URL=')) {
        databaseUrl = trimmed.replace('DATABASE_URL=', '').trim();
        break;
      }
    }
  }
}

if (!databaseUrl) {
  console.error("🚨 Erro: DATABASE_URL não encontrada nem no .env.local nem como argumento (--url=...).");
  process.exit(1);
}

// Determina anos a importar (padrão: 2021, 2022, 2023)
const specifiedYears = args.filter(a => !a.startsWith('--')).map(a => parseInt(a, 10)).filter(n => !isNaN(n));
const anos = specifiedYears.length > 0 ? specifiedYears : [2021, 2022, 2023];

const isLocalhost = databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1');
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isLocalhost ? undefined : { rejectUnauthorized: false },
});

// Classificador inteligente de tópicos matemáticos do ENEM
function classificarTema(textoCompleto) {
  const t = textoCompleto.toLowerCase();

  if (t.includes('volume') || t.includes('cilindr') || t.includes('cone') || t.includes('esfera') || 
      t.includes('prisma') || t.includes('pirâmide') || t.includes('paralelepípedo') || t.includes('capacidade em litro')) {
    return 'Geometria Espacial';
  }

  if (t.includes('triângulo') || t.includes('área do') || t.includes('perímetro') || t.includes('circunferência') || 
      t.includes('raio') || t.includes('quadrado') || t.includes('polígono') || t.includes('trapézio') || t.includes('losango')) {
    return 'Geometria Plana';
  }

  if (t.includes('probabilidade') || t.includes('sorteio') || t.includes('aleatoriamente') || t.includes('chance de')) {
    return 'Probabilidade';
  }

  if (t.includes('média') || t.includes('mediana') || t.includes('moda') || t.includes('desvio padrão') || 
      t.includes('desvio-padrão') || t.includes('gráfico de barras') || t.includes('frequência')) {
    return 'Estatística e Médias';
  }

  if (t.includes('porcent') || t.includes('%') || t.includes('juros') || t.includes('desconto') || 
      t.includes('lucro') || t.includes('inflação') || t.includes('rendimento financeiro')) {
    return 'Porcentagem e Matemática Financeira';
  }

  if (t.includes('seno') || t.includes('cosseno') || t.includes('tangente') || t.includes('trigonom')) {
    return 'Trigonometria';
  }

  if (t.includes('anagrama') || t.includes('combinaç') || t.includes('arranjo') || t.includes('possibilidades de escolha')) {
    return 'Análise Combinatória';
  }

  if (t.includes('função') || t.includes('f(x)') || t.includes('parábola') || t.includes('vértice') || 
      t.includes('exponencial') || t.includes('logaritmo') || t.includes('log(')) {
    return 'Funções e Gráficos';
  }

  if (t.includes('escala') || t.includes('proporç') || t.includes('regra de três') || t.includes('razão entre')) {
    return 'Razão, Proporção e Regra de Três';
  }

  return 'Aritmética e Álgebra';
}

async function main() {
  console.log(`\n🚀 Conectando ao PostgreSQL... (${isLocalhost ? 'Local' : 'Nuvem / SSL'})`);
  const client = await pool.connect();

  try {
    // 1. Garante que os temas existam e monta dicionário
    const temasRes = await client.query('SELECT id, nome FROM temas');
    const temaMap = {};
    for (const row of temasRes.rows) {
      temaMap[row.nome] = row.id;
    }

    let totalGeralInserido = 0;
    let totalGeralExistente = 0;

    for (const ano of anos) {
      console.log(`\n📅 Iniciando ingestão do ENEM ${ano}...`);
      let offset = 0;
      const limit = 50;
      let hasMore = true;
      let anoInseridas = 0;
      let anoExistentes = 0;

      while (hasMore) {
        const url = `https://api.enem.dev/v1/exams/${ano}/questions?limit=${limit}&offset=${offset}`;
        let response;
        try {
          response = await fetch(url);
        } catch (fetchErr) {
          console.error(`🚨 Erro de rede ao buscar offset ${offset} do ano ${ano}:`, fetchErr.message);
          break;
        }

        if (!response.ok) {
          console.error(`🚨 Resposta inesperada da API (${response.status}) no ano ${ano}`);
          break;
        }

        const data = await response.json();
        const questoes = data.questions || [];

        for (const q of questoes) {
          // No ENEM, Matemática e suas Tecnologias são questões com disciplina 'matematica' ou índice >= 136
          const isMatematica = q.discipline === 'matematica' || (q.index && q.index >= 136);
          if (!isMatematica) continue;

          const enunciado = q.context || "Texto da questão disponível na imagem.";
          const comando = q.alternativesIntroduction || "Analise a questão e selecione a alternativa correta.";
          const correta = q.correctAlternative || "A";
          const imagens = Array.isArray(q.files) && q.files.length > 0 ? q.files : null;
          const imagemPrincipal = imagens ? imagens[0] : null;

          const alts = {};
          for (const alt of (q.alternatives || [])) {
            alts[alt.letter] = alt.text || "Ver imagem da alternativa.";
          }

          const textoCompleto = `${enunciado} ${comando}`;
          const tema = classificarTema(textoCompleto);
          const temaId = temaMap[tema] || null;

          // Verifica se já existe para não duplicar
          const checkRes = await client.query(
            `SELECT id FROM questoes WHERE ano_enem = $1 AND comando = $2`,
            [String(ano), comando]
          );

          if (checkRes.rows.length > 0) {
            anoExistentes++;
            totalGeralExistente++;
            continue;
          }

          // Insere no banco
          await client.query(
            `INSERT INTO questoes (
              enunciado, comando, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e,
              resposta_correta, ano_enem, urls_imagens, url_imagem_principal, disciplina, tema, tema_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
            [
              enunciado,
              comando,
              alts['A'] || '',
              alts['B'] || '',
              alts['C'] || '',
              alts['D'] || '',
              alts['E'] || '',
              correta,
              String(ano),
              imagens,
              imagemPrincipal,
              'matematica',
              tema,
              temaId
            ]
          );

          anoInseridas++;
          totalGeralInserido++;
        }

        hasMore = data.metadata?.hasMore === true;
        offset += limit;
        process.stdout.write(`  ⏳ Processados ${offset} itens do ENEM ${ano}... (${anoInseridas} adicionadas)\r`);
      }

      console.log(`\n  ✅ ENEM ${ano} concluído: ${anoInseridas} questões novas inseridas (${anoExistentes} já existiam).`);
    }

    console.log(`\n==========================================================`);
    console.log(`🎉 Ingestão finalizada com sucesso!`);
    console.log(`📊 Total de questões novas inseridas: ${totalGeralInserido}`);
    console.log(`🔁 Total de questões já existentes ignoradas: ${totalGeralExistente}`);
    console.log(`==========================================================\n`);

  } catch (error) {
    console.error("🚨 Erro fatal durante a ingestão:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
