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

// referrer → 유입경로 분류 (당근마켓 포함)
function classifyReferrer(ref = '') {
  if (!ref) return 'direct'
  if (/daangn|당근/.test(ref)) return 'daangn'
  if (/naver/.test(ref)) return 'naver'
  if (/google/.test(ref)) return 'google'
  if (/kakao|kakaotalk/.test(ref)) return 'kakao'
  if (/instagram/.test(ref)) return 'instagram'
  if (/facebook|fb\.com/.test(ref)) return 'facebook'
  if (/youtube/.test(ref)) return 'youtube'
  return 'other'
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { type, location } = req.body || {}
  const ua = req.headers['user-agent'] || ''
  const referrer = req.headers['referer'] || req.headers['referrer'] || ''
  const ip = getIP(req)
  const device = getDeviceType(ua)
  const referrerType = classifyReferrer(referrer)

  try {
    if (type === 'visit') {
      await pool.query(
        `INSERT INTO visits (user_agent, referrer, page, device_type, ip)
         VALUES ($1, $2, $3, $4, $5)`,
        [ua, referrer, '/', device, ip]
      )
    } else if (type === 'click') {
      await pool.query(
        `INSERT INTO phone_clicks (location, user_agent, ip, device_type, referrer)
         VALUES ($1, $2, $3, $4, $5)`,
        [location || 'unknown', ua, ip, device, referrer]
      )
    }
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('track error:', err.message)
    return res.status(500).json({ ok: false })
  }
}
