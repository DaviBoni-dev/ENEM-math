import { Pool } from 'pg';

// Criamos o pool usando a URL que definimos no .env.local
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params?: unknown[]) => {
  return pool.query(text, params);
};
