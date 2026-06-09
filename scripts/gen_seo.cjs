#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const PHONE = '010-2343-2966'
const SITE  = 'https://airconhero.vercel.app'
const BASE  = path.resolve(__dirname, '../public/area')

// 기존 파일 전체 삭제 후 재생성
if (fs.existsSync(BASE)) {
  fs.readdirSync(BASE).forEach(f => fs.unlinkSync(path.join(BASE, f)))
}
fs.mkdirSync(BASE, { recursive: true })

// ── 수리 지역 15개 ─────────────────────────────────────────
const repairAreas = [
  { slug: '금천-에어컨수리', name: '금천', gu: '금천구', dongs: '독산·시흥·가산' },
  { slug: '관악-에어컨수리', name: '관악', gu: '관악구', dongs: '신림·봉천·난곡·난향' },
  { slug: '구로-에어컨수리', name: '구로', gu: '구로구', dongs: '구로·개봉·오류·항동' },
  { slug: '영등포-에어컨수리', name: '영등포', gu: '영등포구', dongs: '영등포·당산·여의도·도림·대림' },
  { slug: '광명-에어컨수리', name: '광명', gu: '광명시', dongs: '철산·하안·소하·광명' },
  { slug: '안양-에어컨수리', name: '안양', gu: '안양시', dongs: '안양·평촌·호계·비산·관양' },
  { slug: '남양주-에어컨수리', name: '남양주', gu: '남양주시', dongs: '별내·다산·화도·오남·진접' },
  { slug: '구리-에어컨수리', name: '구리', gu: '구리시', dongs: '인창·교문·수택·갈매' },
  { slug: '강동-에어컨수리', name: '강동', gu: '강동구', dongs: '천호·암사·길동·명일·고덕' },
  { slug: '하남-에어컨수리', name: '하남', gu: '하남시', dongs: '미사·감일·풍산·위례' },
  { slug: '중랑-에어컨수리', name: '중랑', gu: '중랑구', dongs: '면목·중화·묵동·신내·망우' },
  { slug: '동대문-에어컨수리', name: '동대문', gu: '동대문구', dongs: '청량리·전농·답십리·장안·이문' },
  { slug: '노원-에어컨수리', name: '노원', gu: '노원구', dongs: '상계·중계·하계·공릉·월계' },
  { slug: '강북-에어컨수리', name: '강북', gu: '강북구', dongs: '미아·번동·수유·우이' },
  { slug: '성북-에어컨수리', name: '성북', gu: '성북구', dongs: '성북·정릉·길음·종암·장위' },
]

// ── 청소 지역 5개 ──────────────────────────────────────────
const cleanAreas = [
  { slug: '영등포-에어컨청소', name: '영등포', gu: '영등포구', dongs: '영등포·당산·여의도·도림·대림' },
  { slug: '동작-에어컨청소',  name: '동작',   gu: '동작구',   dongs: '사당·노량진·상도·흑석·신대방' },
  { slug: '구로-에어컨청소',  name: '구로',   gu: '구로구',   dongs: '구로·개봉·오류·항동' },
  { slug: '금천-에어컨청소',  name: '금천',   gu: '금천구',   dongs: '독산·시흥·가산' },
  { slug: '관악-에어컨청소',  name: '관악',   gu: '관악구',   dongs: '신림·봉천·난곡·난향' },
]

// ── 공통 CSS ───────────────────────────────────────────────
const commonCSS = (accent, headerBg, cardBorder, tableBg) => `
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Noto Sans KR',sans-serif;background:#F7F9FF;color:#1A1F35;line-height:1.6}
    .area-header{background:${headerBg};color:#fff;padding:56px 24px 44px;text-align:center}
    .area-header h1{font-size:30px;font-weight:800;margin-bottom:8px}
    .area-header h1 span{color:${accent}}
    .area-header .dongs{font-size:13px;color:rgba(255,255,255,0.5);margin-top:4px}
    .area-header .badge{display:inline-block;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.25);border-radius:50px;padding:4px 14px;font-size:12px;color:${accent};margin-bottom:14px}
    .inner{max-width:860px;margin:0 auto;padding:0 20px}
    .section{padding:48px 0}
    .sec-title{font-size:20px;font-weight:800;margin-bottom:6px;color:#0A0F1E}
    .sec-desc{font-size:13px;color:#5A6380;margin-bottom:24px;line-height:1.7}
    .svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px}
    @media(max-width:580px){.svc-grid{grid-template-columns:1fr 1fr}}
    .svc-card{background:#fff;border:1.5px solid ${cardBorder};border-radius:14px;padding:20px 14px;text-align:center}
    .svc-card i{font-size:24px;color:${accent === '#00C2FF' ? '#0057FF' : '#059669'};margin-bottom:8px}
    .svc-card h3{font-size:14px;font-weight:700;margin-bottom:4px}
    .svc-card p{font-size:11px;color:#5A6380;line-height:1.5}
    .svc-card .price{font-size:14px;font-weight:800;color:${accent === '#00C2FF' ? '#0057FF' : '#059669'};margin-top:8px}
    .ptable{width:100%;border-collapse:collapse;margin-bottom:28px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
    .ptable th{background:${tableBg};color:#fff;padding:11px 14px;font-size:12px;text-align:left}
    .ptable td{padding:11px 14px;font-size:13px;border-bottom:1px solid #F5F7FF;color:#1A1F35}
    .ptable td:last-child{font-weight:700;color:${accent === '#00C2FF' ? '#0057FF' : '#059669'};white-space:nowrap}
    .faq-wrap{margin-bottom:8px}
    .faq{background:#fff;border-radius:12px;border:1px solid ${cardBorder};margin-bottom:8px;overflow:hidden}
    .faq-q{padding:14px 18px;font-size:13px;font-weight:700;color:#0A0F1E;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px}
    .faq-q::after{content:'＋';font-size:16px;color:${accent === '#00C2FF' ? '#0057FF' : '#059669'};flex-shrink:0}
    .faq-a{padding:0 18px 14px;font-size:13px;color:#5A6380;line-height:1.8;display:none}
    .faq.open .faq-q::after{content:'－'}
    .faq.open .faq-a{display:block}
    .cta-box{background:${accent === '#00C2FF' ? 'linear-gradient(135deg,#0057FF,#00C2FF)' : 'linear-gradient(135deg,#059669,#34D399)'};border-radius:18px;padding:34px 20px;text-align:center;color:#fff;margin:36px 0}
    .cta-box h2{font-size:20px;font-weight:800;margin-bottom:6px}
    .cta-box p{font-size:13px;opacity:0.85;margin-bottom:20px}
    .cta-btn{display:inline-flex;align-items:center;gap:8px;background:#fff;color:${accent === '#00C2FF' ? '#0057FF' : '#059669'};font-weight:800;font-size:15px;padding:13px 28px;border-radius:50px;text-decoration:none}
    .tip-box{background:#F0F4FF;border-left:4px solid #0057FF;border-radius:0 10px 10px 0;padding:14px 16px;margin-bottom:12px;font-size:13px;color:#1A1F35;line-height:1.7}
    .tip-box.green{background:#F0FDF4;border-color:#059669}
    footer{background:#0A0F1E;color:rgba(255,255,255,0.35);text-align:center;padding:20px;font-size:11px}
    footer a{color:${accent};text-decoration:none}
    .kw-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px}
    .kw-tag{background:#EEF3FF;color:#0057FF;font-size:11px;padding:3px 10px;border-radius:50px;font-weight:600}
    .kw-tag.green{background:#DCFCE7;color:#059669}
`

// ── 수리 페이지 ────────────────────────────────────────────
function repairPage(a) {
  const kws = `${a.name}에어컨수리,${a.name}에어컨가스충전,${a.name}에어컨냉매충전,${a.name}에어컨점검,${a.name}에어컨AS,${a.gu}에어컨수리,${a.gu}에어컨냉매,${a.name}에어컨당일출장`
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${a.name} 에어컨수리 당일출장 | 가스충전·냉매충전·AS | 에어컨해결사</title>
  <meta name="description" content="${a.name} 에어컨수리 전문 에어컨해결사. 에어컨 가스충전·냉매충전·점검·AS 당일출장. ${a.dongs} 등 ${a.gu} 전역 전문 기사 직접 방문."/>
  <meta name="keywords" content="${kws}"/>
  <meta name="robots" content="index,follow"/>
  <link rel="canonical" href="${SITE}/area/${a.slug}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="${a.name} 에어컨수리 당일출장 | 가스충전·냉매충전 | 에어컨해결사"/>
  <meta property="og:description" content="${a.name} 에어컨수리·가스충전·냉매충전·AS. ${a.gu} 전역 당일출장."/>
  <meta property="og:url" content="${SITE}/area/${a.slug}"/>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"에어컨해결사","url":"${SITE}","telephone":"${PHONE}","description":"${a.name} 에어컨수리·가스충전·냉매충전·점검·AS 당일출장","areaServed":"${a.gu}","openingHours":"Mo-Su 08:00-21:00","hasOfferCatalog":{"@type":"OfferCatalog","name":"${a.name} 에어컨 서비스","itemListElement":[{"@type":"Offer","itemOffered":{"@type":"Service","name":"${a.name} 에어컨 수리"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"${a.name} 에어컨 가스충전"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"${a.name} 에어컨 냉매충전"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"${a.name} 에어컨 점검"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"${a.name} 에어컨 AS"}}]}}</script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"홈","item":"${SITE}"},{"@type":"ListItem","position":2,"name":"${a.name} 에어컨수리","item":"${SITE}/area/${a.slug}"}]}</script>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
  <style>${commonCSS('#00C2FF','linear-gradient(135deg,#0A0F1E,#1E2640)','#E8EEFF','#0A0F1E')}</style>
</head>
<body>

<div class="area-header">
  <div class="badge"><i class="fas fa-map-marker-alt"></i> ${a.gu} 전역 당일출장</div>
  <h1><span>${a.name}</span> 에어컨수리</h1>
  <p class="dongs">${a.dongs} · 에어컨 가스충전 · 냉매충전 · 점검 · AS</p>
</div>

<div class="inner">
  <section class="section">
    <div class="kw-tags">
      <span class="kw-tag">${a.name} 에어컨수리</span>
      <span class="kw-tag">${a.name} 에어컨 가스충전</span>
      <span class="kw-tag">${a.name} 에어컨 냉매충전</span>
      <span class="kw-tag">${a.name} 에어컨 점검</span>
      <span class="kw-tag">${a.name} 에어컨 AS</span>
      <span class="kw-tag">${a.name} 에어컨 당일출장</span>
    </div>
    <h2 class="sec-title">${a.name} 에어컨수리 서비스</h2>
    <p class="sec-desc">${a.gu} 전역 당일출장. 수리 전 견적 먼저 안내, 동의 없이 추가 비용 없습니다.</p>
    <div class="svc-grid">
      <div class="svc-card"><i class="fas fa-tools"></i><h3>에어컨 수리·AS</h3><p>작동불량·소음·누수·에러코드 현장 즉시 수리</p><div class="price">30,000원~</div></div>
      <div class="svc-card"><i class="fas fa-tint"></i><h3>가스충전·냉매충전</h3><p>냉매 부족·누설 점검 후 충전·수리</p><div class="price">60,000원~</div></div>
      <div class="svc-card"><i class="fas fa-search"></i><h3>에어컨 점검</h3><p>시즌 전 사전 점검, 갑작스러운 고장 예방</p><div class="price">30,000원~</div></div>
    </div>
    <table class="ptable">
      <thead><tr><th>서비스</th><th>기준</th><th>요금</th></tr></thead>
      <tbody>
        <tr><td>에어컨 수리·AS (간단)</td><td>현장진단 후</td><td>30,000원~</td></tr>
        <tr><td>벽걸이 가스충전·냉매보충</td><td>부분충전</td><td>60,000원</td></tr>
        <tr><td>벽걸이 냉매완전충전</td><td>전체충전</td><td>100,000원</td></tr>
        <tr><td>스탠드 가스충전·냉매보충</td><td>부분충전</td><td>70,000원</td></tr>
        <tr><td>스탠드 냉매완전충전</td><td>전체충전</td><td>120,000원</td></tr>
        <tr><td>냉매 누설 수리</td><td>전 기종</td><td>300,000원 전후</td></tr>
        <tr><td>시스템에어컨 수리·점검</td><td>현장확인 후</td><td>별도문의</td></tr>
      </tbody>
    </table>
  </section>

  <section class="section" style="padding-top:0">
    <h2 class="sec-title">${a.name} 에어컨수리 FAQ</h2>
    <p class="sec-desc">${a.gu} 고객님들이 자주 묻는 질문 모음입니다.</p>

    <div class="faq open"><div class="faq-q">에어컨에서 찬바람이 안 나와요. 원인이 뭔가요?</div><div class="faq-a">냉매(가스) 부족이 가장 흔한 원인입니다. 그 외에도 필터 오염, 실외기 이상, 컴프레셔 문제 등이 있습니다. ${a.name} 지역 당일 방문 진단 후 정확한 원인을 안내드립니다.</div></div>

    <div class="faq"><div class="faq-q">에어컨 냉매충전과 가스충전은 같은 건가요?</div><div class="faq-a">네, 같은 말입니다. 에어컨 냉매(냉각 가스)를 보충하는 작업을 가스충전·냉매충전이라고 합니다. ${a.name} 지역 벽걸이·스탠드·시스템에어컨 모두 가능합니다.</div></div>

    <div class="faq"><div class="faq-q">냉매충전만 하면 되나요? 누설 수리도 해야 하나요?</div><div class="faq-a">정상 에어컨은 냉매가 자연 감소하지 않습니다. 반복 충전이 필요하다면 배관·연결부 누설을 먼저 수리해야 합니다. 충전만 반복하면 같은 증상이 재발합니다.</div></div>

    <div class="faq"><div class="faq-q">에어컨 냉매 누설이란 무엇인가요?</div><div class="faq-a">냉매가 배관 연결부·실내외기 접합부에서 새는 현상입니다. 냉매가 부족해지면 냉방 성능이 급격히 떨어지고 실외기가 계속 작동해 전기요금이 올라갑니다.</div></div>

    <div class="faq"><div class="faq-q">에어컨에서 물이 떨어져요. 왜 그런가요?</div><div class="faq-a">드레인(배수) 배관 막힘, 역구배, 결로, 보온재 손상 등이 원인입니다. 방치하면 천장 손상·곰팡이로 이어질 수 있어 빠른 점검이 필요합니다. ${a.name} 지역 당일 출장 가능합니다.</div></div>

    <div class="faq"><div class="faq-q">에어컨에서 이상한 소음이 나요.</div><div class="faq-a">팬 이물질 끼임, 팬모터 이상, 냉매 부족으로 인한 액압축, 실외기 진동 등이 원인입니다. 소음 종류에 따라 원인이 다르므로 현장 진단이 필요합니다.</div></div>

    <div class="faq"><div class="faq-q">에어컨 에러코드가 떴어요.</div><div class="faq-a">에러코드는 제조사·기종마다 다릅니다. 삼성·LG·캐리어·위니아·센추리 등 전 브랜드 에러코드 진단 가능합니다. ${a.name} 지역 당일 방문 진단해드립니다.</div></div>

    <div class="faq"><div class="faq-q">실외기가 작동하지 않아요.</div><div class="faq-a">차단기 트립, 실외기 전원 이상, 컴프레셔 고장, PCB(기판) 이상, 냉매 압력 이상 등이 원인입니다. 실외기가 멈추면 냉방이 전혀 되지 않으므로 빠른 점검을 권장합니다.</div></div>

    <div class="faq"><div class="faq-q">에어컨 AS(애프터서비스)는 어떻게 받나요?</div><div class="faq-a">제조사 AS는 대기 시간이 길고 비용이 높은 경우가 많습니다. 에어컨해결사는 ${a.name} 지역 당일 출장으로 빠르고 합리적인 가격에 AS를 진행합니다.</div></div>

    <div class="faq"><div class="faq-q">에어컨 점검은 언제 받는 게 좋나요?</div><div class="faq-a">여름 시즌 시작 전(5~6월)에 점검을 받으시면 성수기 고장을 예방할 수 있습니다. 필터 청소·냉매 압력 확인·실외기 상태 점검을 함께 진행합니다.</div></div>

    <div class="faq"><div class="faq-q">에어컨 전기요금이 갑자기 많이 나와요.</div><div class="faq-a">냉매 부족, 필터 오염, 실외기 과부하, 열교환기 오염이 주요 원인입니다. 정기 점검과 청소로 냉방 효율을 높이면 전기요금이 절감됩니다.</div></div>

    <div class="faq"><div class="faq-q">당일 출장이 가능한가요?</div><div class="faq-a">네. ${a.gu} 전역 당일 출장 가능합니다. 전화 주시면 최대한 빠르게 방문 일정을 잡아드립니다.</div></div>

    <div class="faq"><div class="faq-q">수리 전 견적을 미리 알 수 있나요?</div><div class="faq-a">현장 무상 진단 후 수리 전 반드시 견적을 안내드립니다. 동의하신 후에만 수리를 진행하며 추가 비용은 발생하지 않습니다.</div></div>

    <div class="faq"><div class="faq-q">오래된 에어컨도 수리가 가능한가요?</div><div class="faq-a">대부분 가능합니다. 단, 10년 이상 된 경우 부품 수급이 어려울 수 있으며, 이 경우 현장에서 수리 가능 여부를 정직하게 안내드립니다.</div></div>

    <div class="faq"><div class="faq-q">어떤 브랜드 에어컨을 수리하나요?</div><div class="faq-a">삼성·LG·캐리어·위니아·센추리·귀뚜라미·SK·동양매직 등 국내외 전 브랜드 수리 가능합니다.</div></div>
  </section>

  <section class="section" style="padding-top:0">
    <h2 class="sec-title">${a.name} 에어컨 고장 증상별 원인</h2>
    <p class="sec-desc">증상만 봐도 원인을 어느 정도 파악할 수 있습니다. ${a.gu} 현장 진단이 가장 정확합니다.</p>
    <div class="tip-box">💨 <strong>찬바람이 안 나옴</strong> — 냉매 부족(가스충전 필요), 필터 막힘, 실외기 이상, 컴프레셔 문제</div>
    <div class="tip-box">💧 <strong>물이 떨어짐</strong> — 드레인 막힘, 역구배, 결로, 보온재 손상</div>
    <div class="tip-box">🔊 <strong>이상 소음</strong> — 팬 이물질, 팬모터 이상, 냉매 액압축, 실외기 진동</div>
    <div class="tip-box">❄️ <strong>배관에 얼음 생김</strong> — 냉매 누설, 필터 막힘, 팬 이상</div>
    <div class="tip-box">💡 <strong>차단기가 자꾸 내려감</strong> — 전기 누전, 컴프레셔 과부하, PCB 이상</div>
    <div class="tip-box">🌡️ <strong>냉방은 되는데 효율 저하</strong> — 냉매 부족, 열교환기 오염, 실외기 오염</div>
  </section>

  <div class="cta-box">
    <h2>${a.name} 에어컨 문제, 지금 바로 해결하세요</h2>
    <p>${a.dongs} 등 ${a.gu} 전역 당일출장 · 수리·가스충전·냉매충전·점검·AS</p>
    <a href="tel:${PHONE}" class="cta-btn"><i class="fas fa-phone"></i> 지금 바로 전화하기</a>
  </div>
</div>

<footer>
  <p>에어컨해결사 · <a href="tel:${PHONE}">${PHONE}</a> · <a href="${SITE}">홈으로</a></p>
  <p style="margin-top:4px">${a.gu} 에어컨수리·가스충전·냉매충전·점검·AS 당일출장</p>
</footer>
<script>document.querySelectorAll('.faq-q').forEach(q=>{q.addEventListener('click',()=>q.parentElement.classList.toggle('open'))})</script>
</body></html>`
}

// ── 청소 페이지 ────────────────────────────────────────────
function cleanPage(a) {
  const kws = `${a.name}에어컨청소,${a.gu}에어컨청소,${a.name}에어컨분해청소,${a.name}에어컨세척,${a.name}에어컨냄새제거,${a.name}에어컨곰팡이,${a.name}천장형에어컨청소,에어컨해결사`
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${a.name} 에어컨청소 당일출장 | 분해세척·곰팡이제거 전문 | 에어컨해결사</title>
  <meta name="description" content="${a.name} 에어컨청소 전문 에어컨해결사. 벽걸이·스탠드·천장형 분해세척, 곰팡이·냄새 완전제거. ${a.dongs} 등 ${a.gu} 전역 당일출장."/>
  <meta name="keywords" content="${kws}"/>
  <meta name="robots" content="index,follow"/>
  <link rel="canonical" href="${SITE}/area/${a.slug}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="${a.name} 에어컨청소 당일출장 | 분해세척 전문 | 에어컨해결사"/>
  <meta property="og:description" content="${a.name} 에어컨청소 분해세척 전문. 곰팡이·냄새 완전제거. ${a.gu} 전역 당일출장."/>
  <meta property="og:url" content="${SITE}/area/${a.slug}"/>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"에어컨해결사","url":"${SITE}","telephone":"${PHONE}","description":"${a.name} 에어컨청소 분해세척 전문. 곰팡이·냄새 완전제거. ${a.gu} 전역 당일방문.","areaServed":"${a.gu}","openingHours":"Mo-Su 08:00-21:00","hasOfferCatalog":{"@type":"OfferCatalog","name":"${a.name} 에어컨청소","itemListElement":[{"@type":"Offer","itemOffered":{"@type":"Service","name":"${a.name} 벽걸이 에어컨 청소"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"${a.name} 스탠드 에어컨 청소"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"${a.name} 천장형 에어컨 청소"}}]}}</script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"홈","item":"${SITE}"},{"@type":"ListItem","position":2,"name":"${a.name} 에어컨청소","item":"${SITE}/area/${a.slug}"}]}</script>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
  <style>${commonCSS('#6EE7B7','linear-gradient(135deg,#052e16,#065f46)','#A7F3D0','#065f46')}</style>
</head>
<body>

<div class="area-header">
  <div class="badge"><i class="fas fa-map-marker-alt"></i> ${a.gu} 전역 당일출장</div>
  <h1><span>${a.name}</span> 에어컨청소</h1>
  <p class="dongs">${a.dongs} · 분해세척 · 곰팡이제거 · 냄새제거</p>
</div>

<div class="inner">
  <section class="section">
    <div class="kw-tags">
      <span class="kw-tag green">${a.name} 에어컨청소</span>
      <span class="kw-tag green">${a.name} 에어컨 분해세척</span>
      <span class="kw-tag green">${a.name} 에어컨 냄새제거</span>
      <span class="kw-tag green">${a.name} 에어컨 곰팡이제거</span>
      <span class="kw-tag green">${a.name} 천장형 에어컨청소</span>
    </div>
    <h2 class="sec-title">${a.name} 에어컨청소 서비스</h2>
    <p class="sec-desc">곰팡이·냄새·먼지를 완벽 제거하는 분해세척. ${a.gu} 전역 당일출장, 냉방효율 UP · 공기질 UP.</p>
    <div class="svc-grid">
      <div class="svc-card"><i class="fas fa-wind"></i><h3>벽걸이 청소</h3><p>완전 분해 후 고압세척, 곰팡이·냄새 제거</p><div class="price">70,000원</div></div>
      <div class="svc-card"><i class="fas fa-fan"></i><h3>스탠드 청소</h3><p>내부 열교환기·팬 분해세척</p><div class="price">120,000원</div></div>
      <div class="svc-card"><i class="fas fa-building"></i><h3>천장형 청소</h3><p>4WAY·2WAY·1WAY 전문 분해세척</p><div class="price">90,000원~</div></div>
    </div>
    <table class="ptable">
      <thead><tr><th>기종</th><th>서비스</th><th>요금</th></tr></thead>
      <tbody>
        <tr><td>벽걸이형</td><td>분해세척</td><td>70,000원</td></tr>
        <tr><td>스탠드형</td><td>분해세척</td><td>120,000원</td></tr>
        <tr><td>천장형 1WAY</td><td>분해세척</td><td>90,000원</td></tr>
        <tr><td>천장형 2WAY</td><td>분해세척</td><td>110,000원</td></tr>
        <tr><td>천장형 4WAY</td><td>분해세척</td><td>150,000원</td></tr>
      </tbody>
    </table>
  </section>

  <section class="section" style="padding-top:0">
    <h2 class="sec-title">${a.name} 에어컨청소 FAQ</h2>
    <p class="sec-desc">${a.gu} 고객님들이 자주 묻는 에어컨청소 질문 모음입니다.</p>

    <div class="faq open"><div class="faq-q">에어컨 청소를 꼭 해야 하나요?</div><div class="faq-a">에어컨 내부에는 곰팡이·세균·먼지가 쌓여 냉방 효율이 떨어지고 불쾌한 냄새가 납니다. 1~2년에 한 번 분해세척을 권장드립니다.</div></div>

    <div class="faq"><div class="faq-q">에어컨에서 퀴퀴한 냄새가 나요. 왜 그런가요?</div><div class="faq-a">내부 열교환기·팬에 곰팡이와 세균이 번식한 것이 원인입니다. 필터 청소만으로는 해결되지 않으며 분해세척이 필요합니다. ${a.name} 당일출장 가능합니다.</div></div>

    <div class="faq"><div class="faq-q">에어컨 내부 곰팡이가 건강에 영향을 주나요?</div><div class="faq-a">네. 에어컨 내부 곰팡이 포자가 실내 공기로 퍼져 호흡기 질환, 알레르기, 비염을 유발할 수 있습니다. 특히 영유아·노인·환자가 있는 가정은 정기 청소가 필요합니다.</div></div>

    <div class="faq"><div class="faq-q">분해청소와 일반 청소의 차이가 뭔가요?</div><div class="faq-a">일반 청소는 필터만 세척합니다. 분해청소는 커버·필터·열교환기·팬·드레인팬까지 전부 분리해 고압세척하므로 곰팡이와 냄새를 완전히 제거할 수 있습니다.</div></div>

    <div class="faq"><div class="faq-q">청소하면 냉방 효율이 좋아지나요?</div><div class="faq-a">네. 열교환기 오염이 제거되면 냉방 성능이 눈에 띄게 향상됩니다. 냉매 충전 없이도 냉방 효율이 올라가고 전기요금도 절감됩니다.</div></div>

    <div class="faq"><div class="faq-q">청소 후 바로 사용할 수 있나요?</div><div class="faq-a">세척 후 건조·작동 테스트를 완료합니다. 보통 30분~1시간 후 정상 사용 가능합니다.</div></div>

    <div class="faq"><div class="faq-q">천장형 에어컨 청소도 가능한가요?</div><div class="faq-a">네. 4WAY·2WAY·1WAY 모든 천장형 시스템에어컨 청소 가능합니다. ${a.name} 지역 식당·사무실·매장 방문 청소 가능합니다.</div></div>

    <div class="faq"><div class="faq-q">에어컨 청소 주기는 얼마나 되나요?</div><div class="faq-a">필터는 2~4주마다 청소, 분해세척은 1~2년에 한 번을 권장합니다. 주방 근처나 먼지가 많은 환경이라면 더 자주 청소하는 게 좋습니다.</div></div>

    <div class="faq"><div class="faq-q">스탠드 에어컨 청소 시간이 얼마나 걸리나요?</div><div class="faq-a">벽걸이는 약 1시간, 스탠드는 1시간~1시간 30분, 천장형은 1시간 30분~2시간 정도 소요됩니다.</div></div>

    <div class="faq"><div class="faq-q">청소 과정에서 물이나 오염물이 집안에 튀지 않나요?</div><div class="faq-a">청소 전 바닥·가구 보양 작업을 진행합니다. 오염물이 외부로 나오지 않도록 전용 세척 커버를 사용합니다.</div></div>

    <div class="faq"><div class="faq-q">당일 출장이 가능한가요?</div><div class="faq-a">네. ${a.gu} 전역 당일출장 가능합니다. 전화 주시면 최대한 빠르게 방문 일정을 잡아드립니다.</div></div>
  </section>

  <section class="section" style="padding-top:0">
    <h2 class="sec-title">에어컨 청소가 필요한 증상</h2>
    <p class="sec-desc">${a.name} 지역 고객님, 이런 증상이 있다면 청소가 필요합니다.</p>
    <div class="tip-box green">🤧 <strong>냄새가 남</strong> — 가동 시 퀴퀴하거나 쿰쿰한 냄새. 내부 곰팡이·세균 번식이 원인.</div>
    <div class="tip-box green">❄️ <strong>냉방 효율 저하</strong> — 예전보다 덜 시원함. 열교환기 오염이 냉방 성능을 떨어뜨림.</div>
    <div class="tip-box green">🌫️ <strong>바람이 약해짐</strong> — 팬·필터 오염으로 풍량 감소.</div>
    <div class="tip-box green">💡 <strong>전기요금 증가</strong> — 오염된 열교환기가 더 많은 에너지를 소비.</div>
    <div class="tip-box green">🤧 <strong>알레르기·비염 악화</strong> — 곰팡이 포자가 실내 공기에 퍼짐.</div>
  </section>

  <div class="cta-box">
    <h2>${a.name} 에어컨청소, 지금 바로 예약하세요</h2>
    <p>${a.dongs} 등 ${a.gu} 전역 당일출장 · 분해세척 전문</p>
    <a href="tel:${PHONE}" class="cta-btn"><i class="fas fa-phone"></i> 지금 바로 전화하기</a>
  </div>
</div>

<footer>
  <p>에어컨해결사 · <a href="tel:${PHONE}">${PHONE}</a> · <a href="${SITE}">홈으로</a></p>
  <p style="margin-top:4px">${a.gu} 에어컨청소·분해세척·곰팡이제거 당일출장</p>
</footer>
<script>document.querySelectorAll('.faq-q').forEach(q=>{q.addEventListener('click',()=>q.parentElement.classList.toggle('open'))})</script>
</body></html>`
}

// ── 생성 실행 ──────────────────────────────────────────────
let count = 0
repairAreas.forEach(a => {
  fs.writeFileSync(path.join(BASE, `${a.slug}.html`), repairPage(a), 'utf8')
  console.log(`✅ 수리: ${a.slug}`)
  count++
})
cleanAreas.forEach(a => {
  fs.writeFileSync(path.join(BASE, `${a.slug}.html`), cleanPage(a), 'utf8')
  console.log(`✅ 청소: ${a.slug}`)
  count++
})
console.log(`\n총 ${count}개 생성 완료 (수리 ${repairAreas.length} + 청소 ${cleanAreas.length})`)
