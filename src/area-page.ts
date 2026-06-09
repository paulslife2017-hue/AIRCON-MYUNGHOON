import { AreaData } from './areas'

const PHONE = '010-2343-2966'
const BASE_URL = 'https://www.airconhelper.co.kr'

// 키워드별 텍스트 맵
const KW = {
  repair: { label: '에어컨 수리',   h1sub: '수리·냉방불량·누수 당일 출장', priceRows: [['에어컨 점검 진단','현장 안내'],['가스충전 (R410A)','6만원~'],['실내기 수리','현장 진단 후 안내'],['전기부품 교체','현장 진단 후 안내']] },
  gas:    { label: '에어컨 가스충전', h1sub: '냉매충전·누설점검 당일 출장',  priceRows: [['가스충전 (R410A)','6만원~'],['가스충전 (R22)','5만원~'],['냉매 누설 점검','현장 안내'],['충전 후 냉방 테스트','포함']] },
  check:  { label: '에어컨 점검',   h1sub: '냉방불량·이상소음 당일 점검',  priceRows: [['에어컨 기본 점검','현장 안내'],['냉매량 확인','포함'],['전기·배선 점검','포함'],['수리 필요 시','별도 안내']] },
  clean:  { label: '냉매충전',      h1sub: '냉매부족·냉방약화 즉시 해결',  priceRows: [['R410A 냉매충전','6만원~'],['R22 냉매충전','5만원~'],['냉매 누설 확인','포함'],['충전 후 테스트','포함']] },
}

export function renderAreaPage(area: AreaData): string {
  const kw = KW[area.keyword]
  const canonicalUrl = `${BASE_URL}/area/${area.slug}`
  const title = `${area.shortName} ${kw.label} 당일출장 | ${area.name} 전문 | 에어컨해결사`
  const desc  = area.service === 'repair'
    ? `${area.name} ${kw.label} 전문 에어컨해결사. ${kw.h1sub}. ${area.dongs.join('·')} 전 지역 방문, 합리적인 가격.`
    : `${area.name} 에어컨 청소 전문 에어컨해결사. 분해세척·시스템에어컨·천장형 당일 출장. ${area.dongs.join('·')} 전 지역 방문 청소.`
  const dongsText = area.dongs.join(' · ')
  const isClean = area.service === 'clean'

  const priceRows = isClean
    ? [['벽걸이 분해청소','6만원~'],['스탠드 분해청소','8만원~'],['시스템에어컨 1대','10만원~'],['천장형 카세트','현장 안내']]
    : kw.priceRows

  const services = isClean
    ? [['fa-spray-can','에어컨 분해청소','필터·열교환기 분해 고압 세척'],['fa-building','시스템에어컨 청소','천장형·4방향 카세트 전문'],['fa-clock','당일 출장',`${area.shortName} 전 지역 가능`]]
    : area.keyword === 'gas' || area.keyword === 'clean'
      ? [['fa-wind','냉매 충전','R410A·R22 친환경 냉매 충전'],['fa-search','누설 점검','냉매 누설 정밀 확인'],['fa-clock','당일 출장',`${area.shortName} 전 지역 가능`]]
      : area.keyword === 'check'
        ? [['fa-search','에어컨 점검','냉방불량·소음 정밀 진단'],['fa-tools','현장 수리','점검 후 즉시 수리 가능'],['fa-clock','당일 출장',`${area.shortName} 전 지역 가능`]]
        : [['fa-wrench','에어컨 수리','냉방불량·누수·소음 즉시 수리'],['fa-wind','가스충전','냉매 부족·누설 점검 및 충전'],['fa-clock','당일 출장',`${area.shortName} 전 지역 가능`]]

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title}</title>
  <meta name="description" content="${desc}"/>
  <meta name="keywords" content="${area.shortName}에어컨,${area.shortName}${kw.label.replace(' ','')},${area.name}에어컨,당일출장,${area.dongs.join(',')}"/>
  <meta name="robots" content="index,follow"/>
  <meta name="naver-site-verification" content="10e10edd1ef5ff973f1f9834637b9aa28cfe22f8"/>
  <meta name="google-site-verification" content="rRDWFJmypYsfPFXa2oQOMtR2dq_lcGIyJA6BdcsPl7w"/>
  <link rel="canonical" href="${canonicalUrl}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:locale" content="ko_KR"/>
  <meta property="og:site_name" content="에어컨해결사"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${desc}"/>
  <meta property="og:url" content="${canonicalUrl}"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${desc}"/>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","@id":"${BASE_URL}/#localbusiness","name":"에어컨해결사","url":"${BASE_URL}","telephone":"${PHONE}","description":"${desc}","priceRange":"$$","openingHours":"Mo-Su 08:00-21:00","areaServed":"${area.name}","geo":{"@type":"GeoCoordinates","latitude":${area.lat},"longitude":${area.lng}},"sameAs":[]}</script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"홈","item":"${BASE_URL}"},{"@type":"ListItem","position":2,"name":"서비스 지역","item":"${BASE_URL}/area"},{"@type":"ListItem","position":3,"name":"${area.shortName} ${kw.label}","item":"${canonicalUrl}"}]}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;800&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    :root{--p:#0057FF;--pk:#00C2FF;--dark:#0A0F1E;--sub:#5A6380;--bg:#F7F9FF;--r:14px}
    body{font-family:'Noto Sans KR',sans-serif;background:var(--bg);color:#1A1F35;line-height:1.6;overflow-x:hidden}
    .nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(10,15,30,.95);backdrop-filter:blur(12px);padding:0 20px;height:60px;display:flex;align-items:center;justify-content:space-between}
    .nav-logo{color:#fff;font-weight:800;font-size:17px;text-decoration:none}.nav-logo span{color:var(--pk)}
    .nav-tel{color:#fff;font-weight:700;font-size:14px;text-decoration:none;background:var(--p);padding:7px 14px;border-radius:8px}
    .hero{background:linear-gradient(135deg,#0A0F1E,#0d1f4a,#0057FF);padding:96px 20px 52px;text-align:center}
    .bc{display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:16px;font-size:12px;color:rgba(255,255,255,.45)}
    .bc a{color:rgba(255,255,255,.45);text-decoration:none}.bc a:hover{color:#fff}
    h1{font-size:clamp(24px,5vw,40px);font-weight:800;color:#fff;margin-bottom:10px;line-height:1.3}
    h1 em{color:var(--pk);font-style:normal}
    .hero-sub{font-size:15px;color:rgba(255,255,255,.65);margin-bottom:6px}
    .hero-dongs{font-size:13px;color:rgba(255,255,255,.45);margin-bottom:28px}
    .cta{display:inline-flex;align-items:center;gap:8px;background:#fff;color:var(--p);font-size:17px;font-weight:800;padding:14px 32px;border-radius:50px;text-decoration:none;box-shadow:0 8px 28px rgba(0,87,255,.25)}
    .wrap{padding:48px 20px;max-width:720px;margin:0 auto}
    .sec-title{font-size:18px;font-weight:800;margin-bottom:18px;padding-bottom:10px;border-bottom:3px solid var(--p)}
    .sec-title i{color:var(--p);margin-right:7px}
    .svc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
    .svc-card{background:#fff;border-radius:var(--r);padding:20px 16px;text-align:center;box-shadow:0 3px 14px rgba(0,0,0,.06);border:1px solid #EEF2FF}
    .svc-card i{font-size:28px;color:var(--p);margin-bottom:10px;display:block}
    .svc-card h3{font-size:15px;font-weight:700;margin-bottom:5px}
    .svc-card p{font-size:12px;color:var(--sub)}
    .steps{display:flex;flex-direction:column;gap:12px}
    .step{display:flex;align-items:flex-start;gap:14px;background:#fff;border-radius:var(--r);padding:16px;box-shadow:0 3px 12px rgba(0,0,0,.05)}
    .step-num{width:32px;height:32px;border-radius:50%;background:var(--p);color:#fff;font-weight:800;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .step h4{font-size:14px;font-weight:700;margin-bottom:3px}
    .step p{font-size:12px;color:var(--sub)}
    .price-tbl{width:100%;border-collapse:collapse;background:#fff;border-radius:var(--r);overflow:hidden;box-shadow:0 3px 14px rgba(0,0,0,.06)}
    .price-tbl th{background:var(--p);color:#fff;padding:12px 14px;font-size:13px;text-align:left}
    .price-tbl td{padding:12px 14px;font-size:13px;border-bottom:1px solid #EEF2FF}
    .price-tbl tr:last-child td{border-bottom:none}
    .note{font-size:11px;color:var(--sub);margin-top:8px}
    .dong-wrap{display:flex;flex-wrap:wrap;gap:8px}
    .dong{background:#E8F0FF;color:var(--p);padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600}
    .cta2{background:linear-gradient(135deg,var(--dark),#0d1f4a);padding:52px 20px;text-align:center}
    .cta2 h2{font-size:clamp(20px,4vw,30px);font-weight:800;color:#fff;margin-bottom:8px}
    .cta2 p{color:rgba(255,255,255,.55);font-size:14px;margin-bottom:24px}
    .cta2-btn{display:inline-flex;align-items:center;gap:8px;background:var(--p);color:#fff;font-size:17px;font-weight:800;padding:15px 36px;border-radius:50px;text-decoration:none}
    .back{display:block;text-align:center;padding:20px;font-size:13px;color:var(--sub);text-decoration:none}
    .back:hover{color:var(--p)}
    .white-sec{background:#fff;padding:48px 20px}
  </style>
</head>
<body>
<nav class="nav">
  <a href="/" class="nav-logo">에어컨<span>해결사</span></a>
  <a href="tel:${PHONE}" class="nav-tel"><i class="fas fa-phone"></i> ${PHONE}</a>
</nav>

<section class="hero">
  <nav class="bc" aria-label="breadcrumb">
    <a href="/">홈</a><span>›</span><a href="/area">서비스 지역</a><span>›</span><span>${area.shortName} ${kw.label}</span>
  </nav>
  <h1><em>${area.shortName}</em> ${kw.label}<br>당일 출장 전문</h1>
  <p class="hero-sub">${area.name} 전 지역 방문 · ${kw.h1sub}</p>
  <p class="hero-dongs">${dongsText}</p>
  <a href="tel:${PHONE}" class="cta"><i class="fas fa-phone"></i> 지금 바로 전화상담</a>
</section>

<div class="wrap">
  <h2 class="sec-title"><i class="fas fa-tools"></i>${area.shortName} ${kw.label} 서비스</h2>
  <div class="svc-grid">
    ${services.map(([ic,name,desc]) => `<div class="svc-card"><i class="fas ${ic}"></i><h3>${name}</h3><p>${desc}</p></div>`).join('')}
  </div>
</div>

<div class="white-sec">
  <div style="max-width:720px;margin:0 auto">
    <h2 class="sec-title"><i class="fas fa-list-ol"></i>출장 진행 순서</h2>
    <div class="steps">
      <div class="step"><div class="step-num">1</div><div><h4>전화 상담</h4><p>증상을 말씀해 주시면 예상 비용과 출장 시간을 안내드립니다.</p></div></div>
      <div class="step"><div class="step-num">2</div><div><h4>출장 방문</h4><p>${area.shortName} 전 지역 당일 출장. 전문 기사가 직접 방문합니다.</p></div></div>
      <div class="step"><div class="step-num">3</div><div><h4>현장 진단</h4><p>정확한 점검 후 비용 사전 안내. 동의 후 작업을 진행합니다.</p></div></div>
      <div class="step"><div class="step-num">4</div><div><h4>완료 및 테스트</h4><p>작업 완료 후 정상 작동 확인. 사후 A/S도 책임집니다.</p></div></div>
    </div>
  </div>
</div>

<div class="wrap">
  <h2 class="sec-title"><i class="fas fa-won-sign"></i>${area.shortName} ${kw.label} 요금</h2>
  <table class="price-tbl">
    <thead><tr><th>서비스</th><th>요금</th></tr></thead>
    <tbody>${priceRows.map(([s,p]) => `<tr><td>${s}</td><td>${p}</td></tr>`).join('')}</tbody>
  </table>
  <p class="note">※ 기종·상태에 따라 달라질 수 있습니다. 방문 전 전화로 상담해 드립니다.</p>
</div>

<div class="white-sec">
  <div style="max-width:720px;margin:0 auto">
    <h2 class="sec-title"><i class="fas fa-map-marker-alt"></i>${area.shortName} 출장 가능 지역</h2>
    <div class="dong-wrap">
      ${area.dongs.map(d => `<span class="dong">${d}</span>`).join('')}
      <span class="dong">${area.shortName} 전 지역</span>
    </div>
  </div>
</div>

<section class="cta2">
  <h2>${area.shortName} 에어컨 문제,<br>지금 바로 해결하세요</h2>
  <p>전화 한 통으로 당일 출장 · 합리적인 가격 · 전문 기사 직접 방문</p>
  <a href="tel:${PHONE}" class="cta2-btn"><i class="fas fa-phone"></i> ${PHONE}</a>
</section>
<a href="/" class="back">← 에어컨해결사 메인으로 돌아가기</a>
</body>
</html>`
}
