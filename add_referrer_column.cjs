const { Pool } = require('pg')
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_KYyvSOkgo7D2@ep-still-mud-apjgr7ps-pooler.c-7.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require',
  ssl: { rejectUnauthorized: false }
})
async function run() {
  try {
    await pool.query(`ALTER TABLE phone_clicks ADD COLUMN IF NOT EXISTS referrer TEXT DEFAULT ''`)
    console.log('✅ phone_clicks.referrer 컬럼 추가 완료')
  } catch(e) {
    console.error('❌', e.message)
  } finally {
    await pool.end()
  }
}
run()
