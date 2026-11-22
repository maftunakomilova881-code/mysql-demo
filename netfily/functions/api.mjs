import mysql from 'mysql2/promise';

export default async (req) => {
  const conn = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: Number(process.env.TIDB_PORT || 4000),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE || 'test',
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
  });

  if (req.method === 'POST') {
    const { name } = await req.json();
    if (name && name.trim()) {
      await conn.execute('INSERT INTO notes (name) VALUES (?)', [name.trim()]);
    }
  }

  const [rows] = await conn.execute('SELECT * FROM notes ORDER BY id DESC');
  await conn.end();

  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json' }
  });
};
    
    
