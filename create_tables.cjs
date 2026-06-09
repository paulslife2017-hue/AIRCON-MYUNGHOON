const { Client } = require('pg')

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_KYyvSOkgo7D2@ep-still-mud-apjgr7ps.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
})

async function createTables() {
  await client.connect()
  console.log('DB 연결 성공!')

  await client.query(`
    CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      visited_at TIMESTAMPTZ DEFAULT NOW(),
      user_agent TEXT,
      referrer TEXT,
      page TEXT DEFAULT '/',
      device_type TEXT,
      ip TEXT
    )
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS phone_clicks (
      id SERIAL PRIMARY KEY,
      clicked_at TIMESTAMPTZ DEFAULT NOW(),
      location TEXT,
      user_agent TEXT,
      ip TEXT,
      device_type TEXT
    )
  `)

  console.log('visits 테이블 생성 완료')
  console.log('phone_clicks 테이블 생성 완료')

  const res = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY table_name
  `)
  console.log('생성된 테이블:', res.rows.map(r => r.table_name))
  await client.end()
}

createTables().catch(console.error)
