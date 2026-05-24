import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 3,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
})

const ADMIN_PW = process.env.ADMIN_PW || '0907'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body || {}
  if (password !== ADMIN_PW) {
    return res.status(401).json({ ok: false, message: '비밀번호가 틀렸습니다.' })
  }

  try {
    // 1. 총 방문수 & 오늘 방문수
    const totalVisits = await pool.query(`SELECT COUNT(*) AS cnt FROM visits`)
    const todayVisits = await pool.query(
      `SELECT COUNT(*) AS cnt FROM visits
       WHERE visited_at >= CURRENT_DATE AT TIME ZONE 'Asia/Seoul'`
    )

    // 2. 총 전화클릭 & 오늘 클릭
    const totalClicks = await pool.query(`SELECT COUNT(*) AS cnt FROM phone_clicks`)
    const todayClicks = await pool.query(
      `SELECT COUNT(*) AS cnt FROM phone_clicks
       WHERE clicked_at >= CURRENT_DATE AT TIME ZONE 'Asia/Seoul'`
    )

    // 3. 기기별 방문 비율
    const deviceStats = await pool.query(
      `SELECT device_type, COUNT(*) AS cnt
       FROM visits GROUP BY device_type ORDER BY cnt DESC`
    )

    // 4. 전화 클릭 위치별 분석
    const clickByLocation = await pool.query(
      `SELECT location, COUNT(*) AS cnt
       FROM phone_clicks GROUP BY location ORDER BY cnt DESC`
    )

    // 5. 최근 방문 20개
    const recentVisits = await pool.query(
      `SELECT visited_at, device_type, referrer, ip
       FROM visits ORDER BY visited_at DESC LIMIT 20`
    )

    // 6. 최근 전화클릭 20개
    const recentClicks = await pool.query(
      `SELECT clicked_at, location, device_type, ip
       FROM phone_clicks ORDER BY clicked_at DESC LIMIT 20`
    )

    // 7. 일별 방문 추이 (최근 14일)
    const dailyVisits = await pool.query(
      `SELECT DATE(visited_at AT TIME ZONE 'Asia/Seoul') AS day,
              COUNT(*) AS cnt
       FROM visits
       WHERE visited_at >= NOW() - INTERVAL '14 days'
       GROUP BY day ORDER BY day`
    )

    // 8. 유입 경로 TOP 5 (referrer_type 컬럼명 통일)
    const referrerStats = await pool.query(
      `SELECT
         CASE
           WHEN referrer = '' OR referrer IS NULL THEN 'direct'
           WHEN referrer LIKE '%naver%' THEN 'naver'
           WHEN referrer LIKE '%google%' THEN 'google'
           WHEN referrer LIKE '%kakao%' THEN 'kakao'
           WHEN referrer LIKE '%instagram%' THEN 'instagram'
           ELSE 'other'
         END AS referrer_type,
         COUNT(*) AS count
       FROM visits
       GROUP BY referrer_type ORDER BY count DESC LIMIT 5`
    )

    return res.status(200).json({
      ok: true,
      totalVisits: parseInt(totalVisits.rows[0].cnt),
      todayVisits: parseInt(todayVisits.rows[0].cnt),
      totalClicks: parseInt(totalClicks.rows[0].cnt),
      todayClicks: parseInt(todayClicks.rows[0].cnt),
      deviceStats: deviceStats.rows.map(r => ({ device_type: r.device_type, count: r.cnt })),
      clickLocationStats: clickByLocation.rows.map(r => ({ location: r.location, count: r.cnt })),
      recentVisits: recentVisits.rows.map(r => ({
        visited_at: r.visited_at,
        device_type: r.device_type,
        referrer_type: r.referrer ? (
          r.referrer.includes('naver') ? 'naver' :
          r.referrer.includes('google') ? 'google' :
          r.referrer.includes('kakao') ? 'kakao' :
          r.referrer.includes('instagram') ? 'instagram' : 'other'
        ) : 'direct',
        ip: r.ip
      })),
      recentClicks: recentClicks.rows.map(r => ({
        clicked_at: r.clicked_at,
        location: r.location,
        device_type: r.device_type,
        ip: r.ip
      })),
      dailyVisits: dailyVisits.rows,
      referrerStats: referrerStats.rows,
    })
  } catch (err) {
    console.error('stats error:', err.message)
    return res.status(500).json({ ok: false, message: '서버 오류' })
  }
}
