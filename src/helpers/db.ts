import { Client } from 'pg';

type GetDbValueOptions = {
  query: string;
  params?: any[];
  field: string;
};

export async function getDbValue({
  query,
  params = [],
  field,
}: GetDbValueOptions): Promise<string> {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();

    const result = await client.query(query, params);

    if (result.rows.length === 0) {
      throw new Error('DB query returned no rows');
    }

    const value = result.rows[0][field];

    if (value === undefined) {
      throw new Error(`Field "${field}" not found in DB result`);
    }

    if (value === null || String(value).trim() === '') {
      throw new Error(`Field "${field}" in DB is empty`);
    }

    return String(value);
  } catch (e: any) {
    throw new Error(
      `getDbValue failed: field="${field}". ${e.message}`
    );
  } finally {
    await client.end();
  }
}
