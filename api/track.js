import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 3,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
})

function getDeviceType(ua = '') {
  if (!ua) return 'unknown'
  if (/tablet|ipad/i.test(ua)) return 'tablet'
  if (/mobile|android|iphone|ipod/i.test(ua)) return 'mobile'
  return 'desktop'
}

function getIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  )
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { type, location, utm_source } = req.body || {}
  const ua = req.headers['user-agent'] || ''
  const referrer = req.headers['referer'] || req.headers['referrer'] || ''
  const ip = getIP(req)
  const device = getDeviceType(ua)

  // utm_source 우선, 없으면 referrer에서 추출
  const source = utm_source || (() => {
    if (!referrer) return 'direct'
    if (/daangn/.test(referrer)) return 'daangn'
    if (/naver/.test(referrer)) return 'naver'
    if (/google/.test(referrer)) return 'google'
    if (/kakao/.test(referrer)) return 'kakao'
    if (/instagram/.test(referrer)) return 'instagram'
    if (/facebook|fb\.com/.test(referrer)) return 'facebook'
    if (/youtube/.test(referrer)) return 'youtube'
    return 'direct'
  })()

  try {
    if (type === 'visit') {
      await pool.query(
        `INSERT INTO visits (user_agent, referrer, page, device_type, ip, utm_source)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [ua, referrer, '/', device, ip, source]
      )
    } else if (type === 'click') {
      await pool.query(
        `INSERT INTO phone_clicks (location, user_agent, ip, device_type, referrer, utm_source)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [location || 'unknown', ua, ip, device, referrer, source]
      )
    }
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('track error:', err.message)
    return res.status(500).json({ ok: false })
  }
}
