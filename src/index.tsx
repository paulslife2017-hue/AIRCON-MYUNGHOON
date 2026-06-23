import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { AREAS, getAreaBySlug } from './areas'
import { renderAreaPage } from './area-page'
// @ts-ignore
import pageHtml from './page.html?raw'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/gallery/*', serveStatic({ root: './' }))

// 메인 페이지
app.get('/', (c) => {
  return c.html(pageHtml)
})

// 지역별 전용 페이지
app.get('/area/:slug', (c) => {
  const slug = c.req.param('slug')
  const area = getAreaBySlug(slug)
  if (!area) return c.notFound()
  return c.html(renderAreaPage(area))
})

// 서비스 지역 목록 페이지
app.get('/area', (c) => {
  const repairAreas = AREAS.filter(a => a.service === 'repair' || a.service === 'both')
  const cleanAreas  = AREAS.filter(a => a.service === 'clean'  || a.service === 'both')

  const makeCard = (a: typeof AREAS[0]) => {
    const label = a.service === 'repair' ? '수리' : a.service === 'clean' ? '청소' : '수리·청소'
    const icon  = a.service === 'repair' ? 'fa-wrench' : 'fa-spray-can'
    return `<a href="/area/${a.slug}" class="area-card">
      <i class="fas ${icon}"></i>
      <strong>${a.shortName}</strong>
      <span>${label}</span>
    </a>`
  }

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>서비스 지역 | 에어컨해결사</title>
  <meta name="description" content="에어컨해결사 서비스 지역 목록. 금천·관악·구로·영등포·광명·안양 수리, 동작·강동·노원·중랑·동대문·성북·강북·하남·남양주·구리 청소 당일 출장."/>
  <meta name="robots" content="index,follow"/>
  <link rel="canonical" href="https://www.airconhelper.co.kr/area"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;800&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Noto Sans KR',sans-serif;background:#F7F9FF;color:#1A1F35}
    .nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(10,15,30,.95);backdrop-filter:blur(12px);padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
    .nav-logo{color:#fff;font-weight:800;font-size:18px;text-decoration:none}
    .nav-logo span{color:#00C2FF}
    .nav-phone{color:#fff;font-weight:700;font-size:15px;text-decoration:none;background:#0057FF;padding:8px 16px;border-radius:8px}
    .hero{background:linear-gradient(135deg,#0A0F1E,#0d1f4a,#0057FF);padding:100px 24px 60px;text-align:center}
    .hero h1{font-size:clamp(24px,4vw,36px);font-weight:800;color:#fff;margin-bottom:10px}
    .hero h1 em{color:#00C2FF;font-style:normal}
    .hero p{color:rgba(255,255,255,.6);font-size:15px}
    .section{padding:48px 24px;max-width:800px;margin:0 auto}
    .section-title{font-size:18px;font-weight:800;margin-bottom:20px;padding-bottom:10px;border-bottom:3px solid #0057FF}
    .section-title i{color:#0057FF;margin-right:8px}
    .area-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px}
    .area-card{display:flex;flex-direction:column;align-items:center;gap:6px;background:#fff;border:1px solid #EEF2FF;border-radius:14px;padding:20px 12px;text-decoration:none;color:#1A1F35;transition:all .2s}
    .area-card:hover{border-color:#0057FF;transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,87,255,.12)}
    .area-card i{font-size:24px;color:#0057FF}
    .area-card strong{font-size:15px;font-weight:700}
    .area-card span{font-size:12px;color:#5A6380;background:#E8F0FF;padding:2px 10px;border-radius:20px}
    .back{display:block;text-align:center;padding:24px;font-size:14px;color:#5A6380;text-decoration:none}
    .back:hover{color:#0057FF}
  </style>
</head>
<body>
  <nav class="nav">
    <a href="/" class="nav-logo">에어컨<span>해결사</span></a>
    <a href="tel:010-2343-2966" class="nav-phone"><i class="fas fa-phone"></i> 010-2343-2966</a>
  </nav>
  <section class="hero">
    <h1><em>에어컨해결사</em> 서비스 지역</h1>
    <p>수리 6개 지역 · 청소 10개 지역 · 당일 출장</p>
  </section>
  <div class="section">
    <h2 class="section-title"><i class="fas fa-wrench"></i>에어컨 수리 지역</h2>
    <div class="area-grid">${repairAreas.map(makeCard).join('')}</div>
  </div>
  <div class="section">
    <h2 class="section-title"><i class="fas fa-spray-can"></i>에어컨 청소 지역</h2>
    <div class="area-grid">${cleanAreas.map(makeCard).join('')}</div>
  </div>
  <a href="/" class="back">← 메인으로 돌아가기</a>
</body>
</html>`
  return c.html(html)
})

// 네이버 HTML 인증 파일
app.get('/navercc5f5865627c5427ec07847cbb871262.html', (c) => {
  return c.text('naver-site-verification: navercc5f5865627c5427ec07847cbb871262.html')
})

// sitemap.xml 자동 생성
app.get('/sitemap.xml', (c) => {
  const BASE = 'https://www.airconhelper.co.kr'
  const today = new Date().toISOString().split('T')[0]

  const urls = [
    { loc: BASE, priority: '1.0', changefreq: 'weekly' },
    { loc: `${BASE}/area`, priority: '0.8', changefreq: 'monthly' },
    ...AREAS.map(a => ({ loc: `${BASE}/area/${a.slug}`, priority: '0.9', changefreq: 'monthly' })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return c.text(xml, 200, { 'Content-Type': 'application/xml; charset=utf-8' })
})

export default app
