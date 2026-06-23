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

// sitemap.xml 자동 생성 (315개 URL: 메인+area목록+동적area+정적SEO페이지)
app.get('/sitemap.xml', (c) => {
  const BASE = 'https://www.airconhelper.co.kr'
  const today = new Date().toISOString().split('T')[0]

  // 파워링크 집행 지역 (우선순위 높음)
  const powerLinkAreas = ['금천','구로','강동','하남','중랑','동대문','노원','강북']

  // 정적 SEO 페이지 slugs (313개 area/*.html 파일)
  const staticAreaSlugs = [
    '강남-실외기고장','강남-에어컨매립배관수리','강남-에어컨물','강남-에어컨소음','강남-에어컨시원하지않음','강남-에어컨안켜짐','강남-위니아에어컨수리','강남-창문형에어컨수리',
    '강동-냉매충전','강동-실외기고장','강동-에어컨가스충전','강동-에어컨매립배관수리','강동-에어컨물','강동-에어컨소음','강동-에어컨수리','강동-에어컨시원하지않음','강동-에어컨안켜짐','강동-에어컨점검','강동-위니아에어컨수리','강동-창문형에어컨수리',
    '강북-냉매충전','강북-실외기고장','강북-에어컨가스충전','강북-에어컨매립배관수리','강북-에어컨물','강북-에어컨소음','강북-에어컨수리','강북-에어컨시원하지않음','강북-에어컨안켜짐','강북-에어컨점검','강북-위니아에어컨수리','강북-창문형에어컨수리',
    '강서-실외기고장','강서-에어컨매립배관수리','강서-에어컨물','강서-에어컨소음','강서-에어컨시원하지않음','강서-에어컨안켜짐','강서-위니아에어컨수리','강서-창문형에어컨수리',
    '관악-냉매충전','관악-실외기고장','관악-에어컨가스충전','관악-에어컨매립배관수리','관악-에어컨물','관악-에어컨소음','관악-에어컨수리','관악-에어컨시원하지않음','관악-에어컨안켜짐','관악-에어컨점검','관악-에어컨청소','관악-위니아에어컨수리','관악-창문형에어컨수리',
    '광명-냉매충전','광명-실외기고장','광명-에어컨가스충전','광명-에어컨매립배관수리','광명-에어컨물','광명-에어컨소음','광명-에어컨수리','광명-에어컨시원하지않음','광명-에어컨안켜짐','광명-에어컨점검','광명-위니아에어컨수리','광명-창문형에어컨수리',
    '구로-냉매충전','구로-실외기고장','구로-에어컨가스충전','구로-에어컨매립배관수리','구로-에어컨물','구로-에어컨소음','구로-에어컨수리','구로-에어컨시원하지않음','구로-에어컨안켜짐','구로-에어컨점검','구로-에어컨청소','구로-위니아에어컨수리','구로-창문형에어컨수리',
    '구리-냉매충전','구리-실외기고장','구리-에어컨가스충전','구리-에어컨매립배관수리','구리-에어컨물','구리-에어컨소음','구리-에어컨수리','구리-에어컨시원하지않음','구리-에어컨안켜짐','구리-에어컨점검','구리-위니아에어컨수리','구리-창문형에어컨수리',
    '금천-냉매충전','금천-실외기고장','금천-에어컨가스충전','금천-에어컨매립배관수리','금천-에어컨물','금천-에어컨소음','금천-에어컨수리','금천-에어컨시원하지않음','금천-에어컨안켜짐','금천-에어컨점검','금천-에어컨청소','금천-위니아에어컨수리','금천-창문형에어컨수리',
    '남양주-냉매충전','남양주-실외기고장','남양주-에어컨가스충전','남양주-에어컨매립배관수리','남양주-에어컨물','남양주-에어컨소음','남양주-에어컨수리','남양주-에어컨시원하지않음','남양주-에어컨안켜짐','남양주-에어컨점검','남양주-위니아에어컨수리','남양주-창문형에어컨수리',
    '노원-냉매충전','노원-실외기고장','노원-에어컨가스충전','노원-에어컨매립배관수리','노원-에어컨물','노원-에어컨소음','노원-에어컨수리','노원-에어컨시원하지않음','노원-에어컨안켜짐','노원-에어컨점검','노원-위니아에어컨수리','노원-창문형에어컨수리',
    '도봉-실외기고장','도봉-에어컨매립배관수리','도봉-에어컨물','도봉-에어컨소음','도봉-에어컨시원하지않음','도봉-에어컨안켜짐','도봉-위니아에어컨수리','도봉-창문형에어컨수리',
    '동대문-냉매충전','동대문-실외기고장','동대문-에어컨가스충전','동대문-에어컨매립배관수리','동대문-에어컨물','동대문-에어컨소음','동대문-에어컨수리','동대문-에어컨시원하지않음','동대문-에어컨안켜짐','동대문-에어컨점검','동대문-위니아에어컨수리','동대문-창문형에어컨수리',
    '동작-실외기고장','동작-에어컨매립배관수리','동작-에어컨물','동작-에어컨소음','동작-에어컨시원하지않음','동작-에어컨안켜짐','동작-에어컨청소','동작-위니아에어컨수리','동작-창문형에어컨수리',
    '마포-실외기고장','마포-에어컨매립배관수리','마포-에어컨물','마포-에어컨소음','마포-에어컨시원하지않음','마포-에어컨안켜짐','마포-위니아에어컨수리','마포-창문형에어컨수리',
    '부천-실외기고장','부천-에어컨매립배관수리','부천-에어컨물','부천-에어컨소음','부천-에어컨시원하지않음','부천-에어컨안켜짐','부천-위니아에어컨수리','부천-창문형에어컨수리',
    '서대문-실외기고장','서대문-에어컨매립배관수리','서대문-에어컨물','서대문-에어컨소음','서대문-에어컨시원하지않음','서대문-에어컨안켜짐','서대문-위니아에어컨수리','서대문-창문형에어컨수리',
    '서초-실외기고장','서초-에어컨매립배관수리','서초-에어컨물','서초-에어컨소음','서초-에어컨시원하지않음','서초-에어컨안켜짐','서초-위니아에어컨수리','서초-창문형에어컨수리',
    '성남-실외기고장','성남-에어컨매립배관수리','성남-에어컨물','성남-에어컨소음','성남-에어컨시원하지않음','성남-에어컨안켜짐','성남-위니아에어컨수리','성남-창문형에어컨수리',
    '성동-실외기고장','성동-에어컨매립배관수리','성동-에어컨물','성동-에어컨소음','성동-에어컨시원하지않음','성동-에어컨안켜짐','성동-위니아에어컨수리','성동-창문형에어컨수리',
    '성북-냉매충전','성북-실외기고장','성북-에어컨가스충전','성북-에어컨매립배관수리','성북-에어컨물','성북-에어컨소음','성북-에어컨수리','성북-에어컨시원하지않음','성북-에어컨안켜짐','성북-에어컨점검','성북-위니아에어컨수리','성북-창문형에어컨수리',
    '송파-실외기고장','송파-에어컨매립배관수리','송파-에어컨물','송파-에어컨소음','송파-에어컨시원하지않음','송파-에어컨안켜짐','송파-위니아에어컨수리','송파-창문형에어컨수리',
    '수원-실외기고장','수원-에어컨매립배관수리','수원-에어컨물','수원-에어컨소음','수원-에어컨시원하지않음','수원-에어컨안켜짐','수원-위니아에어컨수리','수원-창문형에어컨수리',
    '안양-냉매충전','안양-실외기고장','안양-에어컨가스충전','안양-에어컨매립배관수리','안양-에어컨물','안양-에어컨소음','안양-에어컨수리','안양-에어컨시원하지않음','안양-에어컨안켜짐','안양-에어컨점검','안양-위니아에어컨수리','안양-창문형에어컨수리',
    '양천-실외기고장','양천-에어컨매립배관수리','양천-에어컨물','양천-에어컨소음','양천-에어컨시원하지않음','양천-에어컨안켜짐','양천-위니아에어컨수리','양천-창문형에어컨수리',
    '영등포-냉매충전','영등포-실외기고장','영등포-에어컨가스충전','영등포-에어컨매립배관수리','영등포-에어컨물','영등포-에어컨소음','영등포-에어컨수리','영등포-에어컨시원하지않음','영등포-에어컨안켜짐','영등포-에어컨점검','영등포-에어컨청소','영등포-위니아에어컨수리','영등포-창문형에어컨수리',
    '용산-실외기고장','용산-에어컨매립배관수리','용산-에어컨물','용산-에어컨소음','용산-에어컨시원하지않음','용산-에어컨안켜짐','용산-위니아에어컨수리','용산-창문형에어컨수리',
    '은평-실외기고장','은평-에어컨매립배관수리','은평-에어컨물','은평-에어컨소음','은평-에어컨시원하지않음','은평-에어컨안켜짐','은평-위니아에어컨수리','은평-창문형에어컨수리',
    '인천-실외기고장','인천-에어컨매립배관수리','인천-에어컨물','인천-에어컨소음','인천-에어컨시원하지않음','인천-에어컨안켜짐','인천-위니아에어컨수리','인천-창문형에어컨수리',
    '중랑-냉매충전','중랑-실외기고장','중랑-에어컨가스충전','중랑-에어컨매립배관수리','중랑-에어컨물','중랑-에어컨소음','중랑-에어컨수리','중랑-에어컨시원하지않음','중랑-에어컨안켜짐','중랑-에어컨점검','중랑-위니아에어컨수리','중랑-창문형에어컨수리',
    '하남-냉매충전','하남-실외기고장','하남-에어컨가스충전','하남-에어컨매립배관수리','하남-에어컨물','하남-에어컨소음','하남-에어컨수리','하남-에어컨시원하지않음','하남-에어컨안켜짐','하남-에어컨점검','하남-위니아에어컨수리','하남-창문형에어컨수리',
  ]

  const getAreaPriority = (slug: string) => {
    const areaName = slug.split('-')[0]
    return powerLinkAreas.includes(areaName) ? '0.9' : '0.8'
  }

  const urls = [
    { loc: BASE, priority: '1.0', changefreq: 'weekly' },
    { loc: `${BASE}/area`, priority: '0.8', changefreq: 'monthly' },
    // 동적 area 페이지 (AREAS 배열 기반)
    ...AREAS.map(a => ({ loc: `${BASE}/area/${a.slug}`, priority: '0.9', changefreq: 'monthly' })),
    // 정적 SEO 랜딩 페이지 (313개 area/*.html) - RFC 3986 퍼센트 인코딩
    ...staticAreaSlugs.map(slug => ({
      loc: `${BASE}/area/${slug.split('').map(ch => /[\uAC00-\uD7A3]/.test(ch) ? encodeURIComponent(ch) : ch).join('')}`,
      priority: getAreaPriority(slug),
      changefreq: 'monthly'
    })),
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
