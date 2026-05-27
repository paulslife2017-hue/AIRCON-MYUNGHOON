import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 3,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 8000,
})

const ADMIN_PW = process.env.ADMIN_PW || '0907'

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

  const { password } = req.body || {}
  if (!password || password !== ADMIN_PW) {
    return res.status(401).json({ ok: false, message: '비밀번호가 틀렸습니다.' })
  }

  try {
    // 1. 총 방문수
    const totalVisits = await pool.query(`SELECT COUNT(*) AS cnt FROM visits`)

    // 2. 오늘 방문수
    const todayVisits = await pool.query(
      `SELECT COUNT(*) AS cnt FROM visits WHERE visited_at::date = CURRENT_DATE`
    )

    // 3. 총 전화클릭
    const totalClicks = await pool.query(`SELECT COUNT(*) AS cnt FROM phone_clicks`)

    // 4. 오늘 클릭
    const todayClicks = await pool.query(
      `SELECT COUNT(*) AS cnt FROM phone_clicks WHERE clicked_at::date = CURRENT_DATE`
    )

    // 5. 기기별 방문
    const deviceStats = await pool.query(
      `SELECT device_type, COUNT(*) AS cnt FROM visits GROUP BY device_type ORDER BY cnt DESC`
    )

    // 6. 클릭 위치별
    const clickByLocation = await pool.query(
      `SELECT location, COUNT(*) AS cnt FROM phone_clicks GROUP BY location ORDER BY cnt DESC`
    )

    // 7. 최근 방문 20개
    const recentVisits = await pool.query(
      `SELECT visited_at, device_type, referrer, ip FROM visits ORDER BY visited_at DESC LIMIT 20`
    )

    // 8. 최근 클릭 20개
    const recentClicks = await pool.query(
      `SELECT clicked_at, location, device_type, ip, referrer FROM phone_clicks ORDER BY clicked_at DESC LIMIT 20`
    )

    // 9. 방문 유입경로 TOP5
    const visitReferrerStats = await pool.query(
      `SELECT
         CASE
           WHEN referrer IS NULL OR referrer = '' THEN 'direct'
           WHEN referrer LIKE '%daangn%' THEN 'daangn'
           WHEN referrer LIKE '%naver%' THEN 'naver'
           WHEN referrer LIKE '%google%' THEN 'google'
           WHEN referrer LIKE '%kakao%' THEN 'kakao'
           WHEN referrer LIKE '%instagram%' THEN 'instagram'
           WHEN referrer LIKE '%facebook%' OR referrer LIKE '%fb.com%' THEN 'facebook'
           WHEN referrer LIKE '%youtube%' THEN 'youtube'
           ELSE 'other'
         END AS referrer_type,
         COUNT(*) AS count
       FROM visits
       GROUP BY referrer_type
       ORDER BY count DESC
       LIMIT 7`
    )

    // 10. 클릭 유입경로 TOP5 (어디서 보고 전화했는지)
    const clickReferrerStats = await pool.query(
      `SELECT
         CASE
           WHEN referrer IS NULL OR referrer = '' THEN 'direct'
           WHEN referrer LIKE '%daangn%' THEN 'daangn'
           WHEN referrer LIKE '%naver%' THEN 'naver'
           WHEN referrer LIKE '%google%' THEN 'google'
           WHEN referrer LIKE '%kakao%' THEN 'kakao'
           WHEN referrer LIKE '%instagram%' THEN 'instagram'
           WHEN referrer LIKE '%facebook%' OR referrer LIKE '%fb.com%' THEN 'facebook'
           WHEN referrer LIKE '%youtube%' THEN 'youtube'
           ELSE 'other'
         END AS referrer_type,
         COUNT(*) AS count
       FROM phone_clicks
       GROUP BY referrer_type
       ORDER BY count DESC
       LIMIT 7`
    )

    // 11. 최근 30일 일별 방문 수 (달력용)
    const dailyVisits = await pool.query(
      `SELECT
         TO_CHAR(visited_at::date, 'YYYY-MM-DD') AS day,
         COUNT(*) AS count
       FROM visits
       WHERE visited_at >= NOW() - INTERVAL '30 days'
       GROUP BY visited_at::date
       ORDER BY visited_at::date`
    )

    // 12. 최근 30일 일별 전화 클릭 수 (달력용)
    const dailyClicks = await pool.query(
      `SELECT
         TO_CHAR(clicked_at::date, 'YYYY-MM-DD') AS day,
         COUNT(*) AS count
       FROM phone_clicks
       WHERE clicked_at >= NOW() - INTERVAL '30 days'
       GROUP BY clicked_at::date
       ORDER BY clicked_at::date`
    )

    return res.status(200).json({
      ok: true,
      totalVisits: parseInt(totalVisits.rows[0].cnt),
      todayVisits: parseInt(todayVisits.rows[0].cnt),
      totalClicks: parseInt(totalClicks.rows[0].cnt),
      todayClicks: parseInt(todayClicks.rows[0].cnt),
      deviceStats: deviceStats.rows.map(r => ({ device_type: r.device_type, count: parseInt(r.cnt) })),
      clickLocationStats: clickByLocation.rows.map(r => ({ location: r.location, count: parseInt(r.cnt) })),
      recentVisits: recentVisits.rows.map(r => ({
        visited_at: r.visited_at,
        device_type: r.device_type,
        referrer_type: classifyReferrer(r.referrer),
        ip: r.ip
      })),
      recentClicks: recentClicks.rows.map(r => ({
        clicked_at: r.clicked_at,
        location: r.location,
        device_type: r.device_type,
        referrer_type: classifyReferrer(r.referrer),
        ip: r.ip
      })),
      visitReferrerStats: visitReferrerStats.rows,
      clickReferrerStats: clickReferrerStats.rows,
      dailyVisits: dailyVisits.rows.map(r => ({ day: r.day, count: parseInt(r.count) })),
      dailyClicks: dailyClicks.rows.map(r => ({ day: r.day, count: parseInt(r.count) })),
    })
  } catch (err) {
    console.error('[stats error]', err.message)
    return res.status(500).json({ ok: false, message: err.message || '서버 오류' })
  }
}
