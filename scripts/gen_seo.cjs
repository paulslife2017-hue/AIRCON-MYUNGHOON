#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const PHONE = '010-2343-2966'
const SITE  = 'https://airconhero.vercel.app'
const BASE  = path.resolve(__dirname, '../public/area')
fs.mkdirSync(BASE, { recursive: true })

// ── 수리 지역 ──────────────────────────────────────────────
const repairAreas = [
  { slug: '금천-에어컨수리', name: '금천', gu: '금천구', dongs: '독산·시흥·가산' },
  { slug: '관악-에어컨수리', name: '관악', gu: '관악구', dongs: '신림·봉천·난곡·난향' },
  { slug: '구로-에어컨수리', name: '구로', gu: '구로구', dongs: '구로·개봉·오류·항동' },
  { slug: '영등포-에어컨수리', name: '영등포', gu: '영등포구', dongs: '영등포·당산·여의도·도림·대림' },
  { slug: '광명-에어컨수리', name: '광명', gu: '광명시', dongs: '철산·하안·소하·광명' },
  { slug: '안양-에어컨수리', name: '안양', gu: '안양시', dongs: '안양·평촌·호계·비산·관양' },
]

// ── 청소 지역 ──────────────────────────────────────────────
const cleanAreas = [
  { slug: '영등포-에어컨청소', name: '영등포', gu: '영등포구', dongs: '영등포·당산·여의도·도림·대림' },
  { slug: '동작-에어컨청소',  name: '동작',   gu: '동작구',   dongs: '사당·노량진·상도·흑석·신대방' },
  { slug: '구로-에어컨청소',  name: '구로',   gu: '구로구',   dongs: '구로·개봉·오류·항동' },
  { slug: '금천-에어컨청소',  name: '금천',   gu: '금천구',   dongs: '독산·시흥·가산' },
  { slug: '관악-에어컨청소',  name: '관악',   gu: '관악구',   dongs: '신림·봉천·난곡·난향' },
  { slug: '남양주-에어컨청소', name: '남양주', gu: '남양주시', dongs: '별내·다산·화도·오남·진접' },
  { slug: '구리-에어컨청소',  name: '구리',   gu: '구리시',   dongs: '인창·교문·수택·갈매' },
  { slug: '강동-에어컨청소',  name: '강동',   gu: '강동구',   dongs: '천호·암사·길동·명일·고덕' },
  { slug: '하남-에어컨청소',  name: '하남',   gu: '하남시',   dongs: '미사·감일·풍산·위례' },
  { slug: '중랑-에어컨청소',  name: '중랑',   gu: '중랑구',   dongs: '면목·중화·묵동·신내·망우' },
  { slug: '동대문-에어컨청소', name: '동대문', gu: '동대문구', dongs: '청량리·전농·답십리·장안·이문' },
  { slug: '노원-에어컨청소',  name: '노원',   gu: '노원구',   dongs: '상계·중계·하계·공릉·월계' },
  { slug: '강북-에어컨청소',  name: '강북',   gu: '강북구',   dongs: '미아·번동·수유·우이' },
  { slug: '성북-에어컨청소',  name: '성북',   gu: '성북구',   dongs: '성북·정릉·길음·종암·장위' },
]

// ── 수리 페이지 HTML ────────────────────────────────────────
function repairPage(a) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${a.name} 에어컨 수리 당일출장 | 가스충전·누설수리 | 에어컨해결사</title>
  <meta name="description" content="${a.name} 에어컨 수리 전문 에어컨해결사. 시스템에어컨 수리·가스충전·냉매누설 당일 출장. ${a.dongs} 등 ${a.gu} 전역 방문 수리." />
  <meta name="keywords" content="${a.name}에어컨수리,${a.gu}에어컨,${a.name}에어컨가스충전,${a.name}에어컨냉매,${a.name}에어컨당일출장,에어컨해결사" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${SITE}/area/${a.slug}" />
  <meta property="og:title" content="${a.name} 에어컨 수리 당일출장 | 에어컨해결사" />
  <meta property="og:description" content="${a.name} 에어컨 수리·가스충전 당일 출장. ${a.dongs} 등 ${a.gu} 전역." />
  <meta property="og:url" content="${SITE}/area/${a.slug}" />
  <meta property="og:type" content="website" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "에어컨해결사",
    "url": "${SITE}",
    "telephone": "${PHONE}",
    "description": "${a.name} 에어컨 수리·가스충전 당일출장 전문. ${a.dongs} 등 ${a.gu} 전역 방문.",
    "areaServed": "${a.gu}",
    "openingHours": "Mo-Su 08:00-21:00",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "${a.name} 에어컨 서비스",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "${a.name} 에어컨 수리" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "${a.name} 에어컨 가스충전" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "${a.name} 냉매 누설 수리" } }
      ]
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": "${SITE}" },
      { "@type": "ListItem", "position": 2, "name": "${a.name} 에어컨 수리", "item": "${SITE}/area/${a.slug}" }
    ]
  }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" />
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Noto Sans KR',sans-serif;background:#F7F9FF;color:#1A1F35}
    .area-header{background:linear-gradient(135deg,#0A0F1E,#141929);color:#fff;padding:60px 24px 48px;text-align:center}
    .area-header h1{font-size:32px;font-weight:800;margin-bottom:10px}
    .area-header h1 span{color:#00C2FF}
    .area-header .dongs{font-size:14px;color:rgba(255,255,255,0.5);margin-top:6px}
    .area-header .badge{display:inline-block;background:rgba(0,194,255,0.15);border:1px solid rgba(0,194,255,0.3);border-radius:50px;padding:4px 14px;font-size:12px;color:#00C2FF;margin-bottom:16px}
    .inner{max-width:860px;margin:0 auto;padding:0 24px}
    .section{padding:52px 0}
    .section-title{font-size:22px;font-weight:800;margin-bottom:8px;color:#0A0F1E}
    .section-desc{font-size:14px;color:#5A6380;margin-bottom:28px;line-height:1.7}
    .service-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px}
    @media(max-width:600px){.service-grid{grid-template-columns:1fr}}
    .svc-card{background:#fff;border:1.5px solid #E8EEFF;border-radius:16px;padding:22px 18px;text-align:center}
    .svc-card i{font-size:28px;color:#0057FF;margin-bottom:10px}
    .svc-card h3{font-size:15px;font-weight:700;margin-bottom:6px}
    .svc-card p{font-size:12px;color:#5A6380;line-height:1.6}
    .svc-card .price{font-size:15px;font-weight:800;color:#0057FF;margin-top:10px}
    .price-table{width:100%;border-collapse:collapse;margin-bottom:32px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,87,255,0.06)}
    .price-table th{background:#0A0F1E;color:#fff;padding:12px 16px;font-size:13px;text-align:left}
    .price-table td{padding:12px 16px;font-size:13px;border-bottom:1px solid #F0F3FF;color:#1A1F35}
    .price-table td:last-child{font-weight:700;color:#0057FF;white-space:nowrap}
    .faq{margin-bottom:12px;background:#fff;border-radius:12px;border:1px solid #E8EEFF;overflow:hidden}
    .faq-q{padding:16px 20px;font-size:14px;font-weight:700;color:#0A0F1E;cursor:pointer;display:flex;justify-content:space-between;align-items:center}
    .faq-q::after{content:'＋';font-size:18px;color:#0057FF}
    .faq-a{padding:0 20px 16px;font-size:13px;color:#5A6380;line-height:1.8;display:none}
    .faq.open .faq-q::after{content:'－'}
    .faq.open .faq-a{display:block}
    .cta-box{background:linear-gradient(135deg,#0057FF,#00C2FF);border-radius:20px;padding:36px 24px;text-align:center;color:#fff;margin:40px 0}
    .cta-box h2{font-size:22px;font-weight:800;margin-bottom:8px}
    .cta-box p{font-size:14px;opacity:0.85;margin-bottom:22px}
    .cta-btn{display:inline-flex;align-items:center;gap:8px;background:#fff;color:#0057FF;font-weight:800;font-size:16px;padding:14px 32px;border-radius:50px;text-decoration:none}
    footer{background:#0A0F1E;color:rgba(255,255,255,0.4);text-align:center;padding:24px;font-size:12px}
    footer a{color:#00C2FF;text-decoration:none}
  </style>
</head>
<body>

<div class="area-header">
  <div class="badge"><i class="fas fa-map-marker-alt"></i> ${a.gu} 전역 당일 출장</div>
  <h1><span>${a.name}</span> 에어컨 수리</h1>
  <p class="dongs">${a.dongs} 전 지역 방문 수리</p>
</div>

<div class="inner">

  <section class="section">
    <h2 class="section-title">${a.name} 에어컨 수리 서비스</h2>
    <p class="section-desc">${a.gu} 전역 당일 출장 수리. 수리 전 반드시 견적을 안내드리며, 동의 없이 추가 비용이 발생하지 않습니다.</p>
    <div class="service-grid">
      <div class="svc-card">
        <i class="fas fa-tools"></i>
        <h3>에어컨 수리</h3>
        <p>작동불량·소음·누수·에러코드 현장 즉시 수리</p>
        <div class="price">30,000원~</div>
      </div>
      <div class="svc-card">
        <i class="fas fa-tint"></i>
        <h3>가스충전·누설수리</h3>
        <p>냉매 부족, 누설 점검 후 충전·수리</p>
        <div class="price">60,000원~</div>
      </div>
      <div class="svc-card">
        <i class="fas fa-search"></i>
        <h3>점검·유지보수</h3>
        <p>시즌 전 사전 점검으로 갑작스러운 고장 예방</p>
        <div class="price">30,000원~</div>
      </div>
    </div>

    <table class="price-table">
      <thead><tr><th>서비스</th><th>기준</th><th>요금</th></tr></thead>
      <tbody>
        <tr><td>에어컨 수리 (간단)</td><td>현장 진단 후</td><td>30,000원~</td></tr>
        <tr><td>벽걸이 가스보충</td><td>부분 충전</td><td>60,000원</td></tr>
        <tr><td>벽걸이 완전충전</td><td>전체 충전</td><td>100,000원</td></tr>
        <tr><td>스탠드 가스보충</td><td>부분 충전</td><td>70,000원</td></tr>
        <tr><td>스탠드 완전충전</td><td>전체 충전</td><td>120,000원</td></tr>
        <tr><td>냉매 누설 수리</td><td>전 기종</td><td>300,000원 전후</td></tr>
        <tr><td>시스템에어컨 수리</td><td>현장 확인 후</td><td>별도 문의</td></tr>
      </tbody>
    </table>
  </section>

  <section class="section" style="padding-top:0">
    <h2 class="section-title">${a.name} 에어컨 수리 자주 묻는 질문</h2>
    <p class="section-desc">${a.gu} 고객님들이 자주 묻는 질문입니다.</p>

    <div class="faq open">
      <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">에어컨에서 찬바람이 안 나와요. 원인이 뭔가요?</div>
      <div class="faq-a">냉매 부족, 필터 오염, 실외기 이상, 컴프레셔 문제 등이 원인일 수 있습니다. ${a.name} 지역 당일 방문 진단 후 정확한 원인을 안내드립니다.</div>
    </div>
    <div class="faq">
      <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">가스충전만 하면 되나요? 누설 수리는 꼭 해야 하나요?</div>
      <div class="faq-a">정상 에어컨은 냉매가 자연 감소하지 않습니다. 반복 충전이 필요하다면 누설 수리가 필요합니다. 충전만 반복하면 같은 증상이 재발합니다.</div>
    </div>
    <div class="faq">
      <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">에어컨에서 물이 떨어져요.</div>
      <div class="faq-a">드레인 배관 막힘, 역구배, 결로 등이 원인입니다. ${a.name} 지역 현장 점검 후 원인을 파악해 수리합니다.</div>
    </div>
    <div class="faq">
      <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">당일 출장이 가능한가요?</div>
      <div class="faq-a">네. ${a.gu} 전역 당일 출장 가능합니다. 전화 주시면 일정을 최대한 빠르게 조율해드립니다.</div>
    </div>
    <div class="faq">
      <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">수리 전 견적을 알 수 있나요?</div>
      <div class="faq-a">현장 도착 후 무상 진단 후 견적을 먼저 안내드립니다. 동의하신 후에만 수리를 진행하며, 추가 비용은 발생하지 않습니다.</div>
    </div>
  </section>

  <div class="cta-box">
    <h2>${a.name} 에어컨 문제, 지금 바로 해결하세요</h2>
    <p>${a.dongs} 등 ${a.gu} 전역 당일 출장 · 전문 기사 직접 방문</p>
    <a href="tel:${PHONE}" class="cta-btn"><i class="fas fa-phone"></i> 지금 바로 전화하기</a>
  </div>

</div>

<footer>
  <p>에어컨해결사 · <a href="tel:${PHONE}">${PHONE}</a> · <a href="${SITE}">홈으로</a></p>
  <p style="margin-top:6px">${a.gu} 전역 에어컨 수리·가스충전·점검 당일출장</p>
</footer>

<script>
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => q.parentElement.classList.toggle('open'))
  })
</script>
</body>
</html>`
}

// ── 청소 페이지 HTML ────────────────────────────────────────
function cleanPage(a) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${a.name} 에어컨 청소 당일출장 | 분해세척 전문 | 에어컨해결사</title>
  <meta name="description" content="${a.name} 에어컨 청소 전문 에어컨해결사. 벽걸이·스탠드·천장형 분해세척, 곰팡이·냄새 완전 제거. ${a.dongs} 등 ${a.gu} 전역 당일 출장." />
  <meta name="keywords" content="${a.name}에어컨청소,${a.gu}에어컨청소,${a.name}에어컨분해청소,${a.name}에어컨냄새,${a.name}에어컨곰팡이,에어컨해결사" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${SITE}/area/${a.slug}" />
  <meta property="og:title" content="${a.name} 에어컨 청소 당일출장 | 에어컨해결사" />
  <meta property="og:description" content="${a.name} 에어컨 청소 분해세척 전문. 곰팡이·냄새 완전 제거. ${a.gu} 전역 당일 출장." />
  <meta property="og:url" content="${SITE}/area/${a.slug}" />
  <meta property="og:type" content="website" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "에어컨해결사",
    "url": "${SITE}",
    "telephone": "${PHONE}",
    "description": "${a.name} 에어컨 청소 분해세척 전문. 곰팡이·냄새 완전 제거. ${a.gu} 전역 당일 방문.",
    "areaServed": "${a.gu}",
    "openingHours": "Mo-Su 08:00-21:00",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "${a.name} 에어컨 청소",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "${a.name} 벽걸이 에어컨 청소" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "${a.name} 스탠드 에어컨 청소" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "${a.name} 천장형 에어컨 청소" } }
      ]
    }
  }
  <\/script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": "${SITE}" },
      { "@type": "ListItem", "position": 2, "name": "${a.name} 에어컨 청소", "item": "${SITE}/area/${a.slug}" }
    ]
  }
  <\/script>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" />
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Noto Sans KR',sans-serif;background:#F7F9FF;color:#1A1F35}
    .area-header{background:linear-gradient(135deg,#052e16,#065f46);color:#fff;padding:60px 24px 48px;text-align:center}
    .area-header h1{font-size:32px;font-weight:800;margin-bottom:10px}
    .area-header h1 span{color:#6EE7B7}
    .area-header .dongs{font-size:14px;color:rgba(255,255,255,0.5);margin-top:6px}
    .area-header .badge{display:inline-block;background:rgba(110,231,183,0.15);border:1px solid rgba(110,231,183,0.3);border-radius:50px;padding:4px 14px;font-size:12px;color:#6EE7B7;margin-bottom:16px}
    .inner{max-width:860px;margin:0 auto;padding:0 24px}
    .section{padding:52px 0}
    .section-title{font-size:22px;font-weight:800;margin-bottom:8px}
    .section-desc{font-size:14px;color:#5A6380;margin-bottom:28px;line-height:1.7}
    .service-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px}
    @media(max-width:600px){.service-grid{grid-template-columns:1fr}}
    .svc-card{background:#fff;border:1.5px solid #A7F3D0;border-radius:16px;padding:22px 18px;text-align:center}
    .svc-card i{font-size:28px;color:#059669;margin-bottom:10px}
    .svc-card h3{font-size:15px;font-weight:700;margin-bottom:6px}
    .svc-card p{font-size:12px;color:#5A6380;line-height:1.6}
    .svc-card .price{font-size:15px;font-weight:800;color:#059669;margin-top:10px}
    .price-table{width:100%;border-collapse:collapse;margin-bottom:32px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(5,150,105,0.06)}
    .price-table th{background:#065f46;color:#fff;padding:12px 16px;font-size:13px;text-align:left}
    .price-table td{padding:12px 16px;font-size:13px;border-bottom:1px solid #F0FDF4;color:#1A1F35}
    .price-table td:last-child{font-weight:700;color:#059669;white-space:nowrap}
    .faq{margin-bottom:12px;background:#fff;border-radius:12px;border:1px solid #A7F3D0;overflow:hidden}
    .faq-q{padding:16px 20px;font-size:14px;font-weight:700;color:#065f46;cursor:pointer;display:flex;justify-content:space-between;align-items:center}
    .faq-q::after{content:'＋';font-size:18px;color:#059669}
    .faq-a{padding:0 20px 16px;font-size:13px;color:#5A6380;line-height:1.8;display:none}
    .faq.open .faq-q::after{content:'－'}
    .faq.open .faq-a{display:block}
    .cta-box{background:linear-gradient(135deg,#059669,#34D399);border-radius:20px;padding:36px 24px;text-align:center;color:#fff;margin:40px 0}
    .cta-box h2{font-size:22px;font-weight:800;margin-bottom:8px}
    .cta-box p{font-size:14px;opacity:0.85;margin-bottom:22px}
    .cta-btn{display:inline-flex;align-items:center;gap:8px;background:#fff;color:#059669;font-weight:800;font-size:16px;padding:14px 32px;border-radius:50px;text-decoration:none}
    footer{background:#052e16;color:rgba(255,255,255,0.4);text-align:center;padding:24px;font-size:12px}
    footer a{color:#6EE7B7;text-decoration:none}
  </style>
</head>
<body>

<div class="area-header">
  <div class="badge"><i class="fas fa-map-marker-alt"></i> ${a.gu} 전역 당일 출장</div>
  <h1><span>${a.name}</span> 에어컨 청소</h1>
  <p class="dongs">${a.dongs} 전 지역 방문 청소</p>
</div>

<div class="inner">

  <section class="section">
    <h2 class="section-title">${a.name} 에어컨 청소 서비스</h2>
    <p class="section-desc">곰팡이·냄새·먼지를 완벽 제거하는 분해 세척. ${a.gu} 전역 당일 출장, 냉방 효율 UP · 공기 질 UP.</p>
    <div class="service-grid">
      <div class="svc-card">
        <i class="fas fa-wind"></i>
        <h3>벽걸이 청소</h3>
        <p>완전 분해 후 고압 세척, 곰팡이·냄새 제거</p>
        <div class="price">70,000원</div>
      </div>
      <div class="svc-card">
        <i class="fas fa-fan"></i>
        <h3>스탠드 청소</h3>
        <p>내부 열교환기·팬 분해 세척</p>
        <div class="price">120,000원</div>
      </div>
      <div class="svc-card">
        <i class="fas fa-building"></i>
        <h3>천장형 청소</h3>
        <p>4WAY·2WAY·1WAY 분해 전문 세척</p>
        <div class="price">90,000원~</div>
      </div>
    </div>

    <table class="price-table">
      <thead><tr><th>기종</th><th>서비스</th><th>요금</th></tr></thead>
      <tbody>
        <tr><td>벽걸이형</td><td>분해 세척</td><td>70,000원</td></tr>
        <tr><td>스탠드형</td><td>분해 세척</td><td>120,000원</td></tr>
        <tr><td>천장형 1WAY</td><td>분해 세척</td><td>90,000원</td></tr>
        <tr><td>천장형 2WAY</td><td>분해 세척</td><td>110,000원</td></tr>
        <tr><td>천장형 4WAY</td><td>분해 세척</td><td>150,000원</td></tr>
      </tbody>
    </table>
  </section>

  <section class="section" style="padding-top:0">
    <h2 class="section-title">${a.name} 에어컨 청소 자주 묻는 질문</h2>
    <p class="section-desc">${a.gu} 고객님들이 자주 묻는 질문입니다.</p>

    <div class="faq open">
      <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">에어컨 청소를 꼭 해야 하나요?</div>
      <div class="faq-a">에어컨 내부에는 곰팡이·세균·먼지가 쌓여 냉방 효율이 떨어지고 불쾌한 냄새가 납니다. 1~2년에 한 번 분해 세척을 권장드립니다.</div>
    </div>
    <div class="faq">
      <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">에어컨에서 퀴퀴한 냄새가 나요.</div>
      <div class="faq-a">내부 곰팡이·세균이 원인입니다. 필터 청소만으로는 해결되지 않으며, 열교환기·팬 분해 세척이 필요합니다. ${a.name} 지역 당일 출장 가능합니다.</div>
    </div>
    <div class="faq">
      <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">청소하면 냉방 효율이 좋아지나요?</div>
      <div class="faq-a">네. 내부 오염으로 막힌 열교환기를 세척하면 냉방 성능이 눈에 띄게 향상되고, 전기요금도 절감됩니다.</div>
    </div>
    <div class="faq">
      <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">청소 후 바로 사용할 수 있나요?</div>
      <div class="faq-a">세척 후 건조 과정을 거쳐 작동 테스트 후 완료합니다. 보통 30분~1시간 후 정상 사용 가능합니다.</div>
    </div>
    <div class="faq">
      <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">천장형 에어컨 청소도 가능한가요?</div>
      <div class="faq-a">네. 4WAY·2WAY·1WAY 모든 천장형 시스템에어컨 청소 가능합니다. ${a.name} 지역 식당·사무실·매장 방문 청소 가능합니다.</div>
    </div>
  </section>

  <div class="cta-box">
    <h2>${a.name} 에어컨 청소, 지금 바로 예약하세요</h2>
    <p>${a.dongs} 등 ${a.gu} 전역 당일 출장 · 분해세척 전문</p>
    <a href="tel:${PHONE}" class="cta-btn"><i class="fas fa-phone"></i> 지금 바로 전화하기</a>
  </div>

</div>

<footer>
  <p>에어컨해결사 · <a href="tel:${PHONE}">${PHONE}</a> · <a href="${SITE}">홈으로</a></p>
  <p style="margin-top:6px">${a.gu} 전역 에어컨 청소·분해세척 당일출장</p>
</footer>

<script>
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => q.parentElement.classList.toggle('open'))
  })
</script>
</body>
</html>`
}

// ── 파일 생성 ──────────────────────────────────────────────
let count = 0
repairAreas.forEach(a => {
  fs.writeFileSync(path.join(BASE, `${a.slug}.html`), repairPage(a), 'utf8')
  console.log(`✅ 수리: ${a.slug}.html`)
  count++
})
cleanAreas.forEach(a => {
  fs.writeFileSync(path.join(BASE, `${a.slug}.html`), cleanPage(a), 'utf8')
  console.log(`✅ 청소: ${a.slug}.html`)
  count++
})
console.log(`\n총 ${count}개 페이지 생성 완료`)
