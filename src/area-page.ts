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

// 키워드별 FAQ
const FAQ: Record<string, {q:string, a:string}[]> = {
  repair: [
    { q: '에어컨 수리 비용이 얼마나 되나요?', a: '에어컨 수리 비용은 고장 원인과 기종에 따라 다릅니다. 가스충전은 6만원~, 전기부품 교체는 현장 진단 후 안내드립니다. 방문 전 전화 상담으로 예상 비용을 먼저 확인하실 수 있습니다.' },
    { q: '당일 출장이 가능한가요?', a: '네, 가능합니다. 오전 접수 시 당일 방문을 원칙으로 하며, 전화 상담 후 일정을 조율해 드립니다. 에어컨 고장은 더운 여름에 급하게 발생하는 만큼 최대한 빠르게 출장드립니다.' },
    { q: '에어컨에서 찬바람이 안 나오는 이유가 뭔가요?', a: '찬바람이 약하거나 안 나오는 주요 원인은 냉매(가스) 부족, 필터 오염, 실외기 이상, 컴프레셔 문제 등입니다. 정확한 원인은 현장 점검 후 파악되며, 단순 가스충전만으로 해결되지 않는 경우도 있어 진단이 중요합니다.' },
    { q: '수리 후 A/S는 되나요?', a: '네, 작업 완료 후 이상이 생기면 재방문하여 확인해 드립니다. 동일 증상 재발 시 추가 비용 없이 점검해 드리는 것을 원칙으로 합니다.' },
    { q: '시스템에어컨도 수리 가능한가요?', a: '네, 가능합니다. 벽걸이·스탠드형은 물론 천장형 시스템에어컨, 4방향 카세트형 등 모든 기종 수리가 가능합니다. 시스템에어컨은 구조가 복잡해 전문 장비가 필요하며, 에어컨해결사는 전문 기사가 직접 방문합니다.' },
  ],
  gas: [
    { q: '에어컨 가스충전이 필요한 증상이 뭔가요?', a: '찬바람이 약해지거나 미지근한 바람이 나올 때, 실외기가 계속 돌아가는데 냉방이 안 될 때, 배관에 얼음이 맺힐 때 가스 부족을 의심할 수 있습니다. 단, 정상적인 에어컨은 냉매가 자연 감소하지 않으므로 누설 여부도 함께 점검하는 것이 중요합니다.' },
    { q: '가스충전만 하면 해결되나요?', a: '냉매 누설이 없는 경우라면 충전만으로 해결됩니다. 하지만 배관이나 실내외기 연결부에서 누설이 있다면 충전 후에도 금방 다시 부족해집니다. 에어컨해결사는 충전 전 누설 여부를 먼저 확인하고 근본 원인을 해결합니다.' },
    { q: '가스충전 비용이 얼마나 드나요?', a: 'R410A 냉매 기준 6만원~, R22 냉매 기준 5만원~입니다. 누설 수리가 필요한 경우 추가 비용이 발생할 수 있으며, 방문 전 전화로 상담해 드립니다.' },
    { q: '가스충전 후 얼마나 효과가 지속되나요?', a: '누설 없이 정상 충전된 경우 반영구적으로 유지됩니다. 1~2년 내 다시 부족해진다면 미세 누설이 있을 가능성이 높으므로 누설 점검을 권장합니다.' },
    { q: '어떤 냉매를 사용하나요?', a: '기종에 따라 R410A 또는 R22 냉매를 사용합니다. 최신 에어컨 대부분은 R410A를 사용하며, 구형 기종은 R22를 사용합니다. 기종 확인 후 맞는 냉매로 충전해 드립니다.' },
  ],
  check: [
    { q: '에어컨 점검은 언제 받는 게 좋나요?', a: '여름 성수기 전인 5~6월에 미리 점검받는 것을 권장합니다. 냉방 성능 저하, 이상 소음, 물 떨어짐 등의 증상이 있을 때도 즉시 점검이 필요합니다. 성수기에는 수리 일정이 밀리기 때문에 미리 점검하시면 좋습니다.' },
    { q: '점검 비용이 따로 있나요?', a: '현장 점검 후 안내드립니다. 단순 점검 후 이상이 없으면 출장비만 발생하며, 수리가 필요한 경우 작업 전 비용을 먼저 안내드리고 동의 후 진행합니다.' },
    { q: '에어컨 점검 시 무엇을 확인하나요?', a: '냉매 압력, 전기·배선 상태, 필터 오염도, 실외기 작동 상태, 드레인 배수 상태, 이상 소음 여부 등을 종합적으로 점검합니다. 점검 결과를 현장에서 바로 설명드립니다.' },
    { q: '에어컨에서 이상한 냄새가 나는데 점검이 필요한가요?', a: '네, 필요합니다. 곰팡이 냄새는 내부 오염, 탄 냄새는 전기 부품 이상, 냉매 냄새는 가스 누설 가능성이 있습니다. 특히 탄 냄새는 즉시 전원을 끄고 점검을 받으시는 것이 안전합니다.' },
    { q: '에어컨 소음이 심해졌는데 어떻게 해야 하나요?', a: '딸깍 소리는 부품 접촉 문제, 윙윙 소리는 팬 모터 이상, 쿵쿵 소리는 컴프레셔 문제일 수 있습니다. 소음 방치 시 추가 고장으로 이어질 수 있어 조기 점검을 권장합니다.' },
  ],
  clean: [
    { q: '냉매충전과 가스충전은 같은 건가요?', a: '네, 같습니다. 에어컨에 사용되는 냉매를 일반적으로 "가스"라고도 부릅니다. R410A, R22 등이 대표적인 냉매(가스)이며, 냉매가 부족하면 냉방 성능이 크게 저하됩니다.' },
    { q: '냉매가 부족하면 어떤 증상이 나타나나요?', a: '찬바람이 약해지거나 미지근한 바람이 나옵니다. 실외기는 계속 돌아가는데 실내가 시원해지지 않고, 전기요금이 늘어나는 경우도 있습니다. 배관에 성에나 얼음이 맺히기도 합니다.' },
    { q: '냉매충전 비용이 얼마인가요?', a: 'R410A 기준 6만원~, R22 기준 5만원~입니다. 기종과 냉매 종류에 따라 다르며, 누설이 있는 경우 수리 비용이 추가될 수 있습니다. 방문 전 전화로 먼저 상담해 드립니다.' },
    { q: '냉매는 얼마나 자주 충전해야 하나요?', a: '정상적인 에어컨은 냉매를 반영구적으로 사용합니다. 자꾸 부족해진다면 배관이나 연결부에서 누설이 발생하고 있을 가능성이 높습니다. 단순 충전만 반복하기보다 누설 원인을 찾아 해결하는 것이 중요합니다.' },
    { q: '냉매충전 후 바로 효과가 나타나나요?', a: '네, 충전 완료 후 즉시 냉방 성능이 회복됩니다. 충전 후 현장에서 냉방 테스트를 통해 정상 작동 여부를 확인하고 마무리합니다.' },
  ],
  cleanSvc: [
    { q: '에어컨 청소는 얼마나 자주 해야 하나요?', a: '필터 청소는 2~4주마다, 내부 분해세척은 1~2년에 한 번 권장합니다. 시스템에어컨은 사용 빈도와 환경에 따라 다르지만 연 1회 이상 청소를 권장합니다.' },
    { q: '에어컨 청소 비용이 얼마나 되나요?', a: '벽걸이 분해청소 6만원~, 스탠드 분해청소 8만원~, 시스템에어컨 1대 10만원~입니다. 기종과 오염 정도에 따라 달라질 수 있으며 방문 전 전화 상담이 가능합니다.' },
    { q: '청소 후 냄새가 없어지나요?', a: '네, 대부분 없어집니다. 곰팡이·세균에 의한 냄새는 분해세척 후 크게 개선됩니다. 다만 오염이 심한 경우 2회 청소가 필요할 수 있습니다.' },
    { q: '시스템에어컨 청소도 가능한가요?', a: '네, 가능합니다. 천장형·4방향 카세트형 시스템에어컨 분해청소를 전문으로 합니다. 일반 에어컨보다 구조가 복잡해 전문 장비와 기술이 필요하며, 에어컨해결사 전문 기사가 직접 방문합니다.' },
    { q: '청소 시간이 얼마나 걸리나요?', a: '벽걸이 기준 약 1~1.5시간, 스탠드 약 1.5~2시간, 시스템에어컨은 1대당 약 1.5~2시간 소요됩니다. 오염 정도에 따라 달라질 수 있습니다.' },
  ],
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
  const faqs = isClean ? FAQ.cleanSvc : FAQ[area.keyword]
  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  })

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
  <script type="application/ld+json">${faqJsonLd}</script>
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
    .faq-list{display:flex;flex-direction:column;gap:10px}
    .faq-item{background:#fff;border-radius:var(--r);border:1px solid #EEF2FF;overflow:hidden}
    .faq-q{width:100%;text-align:left;padding:18px 20px;font-size:15px;font-weight:700;color:#1A1F35;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px}
    .faq-q i{color:var(--p);font-size:13px;flex-shrink:0;transition:transform .3s}
    .faq-item.open .faq-q i{transform:rotate(180deg)}
    .faq-a{display:none;padding:0 20px 18px;font-size:14px;color:var(--sub);line-height:1.8;border-top:1px solid #EEF2FF}
    .faq-item.open .faq-a{display:block}
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

<div class="wrap">
  <h2 class="sec-title"><i class="fas fa-question-circle"></i>${area.shortName} ${kw.label} 자주 묻는 질문</h2>
  <div class="faq-list">
    ${faqs.map((f,i) => `<div class="faq-item${i===0?' open':''}">
      <button class="faq-q" onclick="this.parentElement.classList.toggle('open')">
        ${f.q}<i class="fas fa-chevron-down"></i>
      </button>
      <div class="faq-a">${f.a}</div>
    </div>`).join('')}
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
