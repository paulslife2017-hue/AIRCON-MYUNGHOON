import { AreaData } from './areas'

const PHONE = '010-2343-2966'
const SITE_NAME = '에어컨해결사'
const BASE_URL = 'https://www.airconhelper.co.kr'

export function renderAreaPage(area: AreaData): string {
  const isRepair = area.service === 'repair' || area.service === 'both'
  const isClean = area.service === 'clean' || area.service === 'both'

  const serviceLabel = isRepair && isClean ? '수리·청소' : isRepair ? '수리' : '청소'
  const serviceKeyword = isRepair ? '에어컨수리' : '에어컨청소'
  const canonicalUrl = `${BASE_URL}/area/${area.slug}`

  const dongsText = area.dongs.join(' · ')

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${area.shortName} 에어컨${serviceLabel} 당일출장 | ${area.name} 전문 | ${SITE_NAME}</title>
  <meta name="description" content="${area.description}" />
  <meta name="keywords" content="${area.shortName}에어컨,${area.shortName}${serviceKeyword},${area.name}에어컨,${area.name}${serviceKeyword},에어컨${serviceLabel},당일출장,${area.dongs.join(',')}" />
  <meta name="robots" content="index,follow" />
  <meta name="naver-site-verification" content="10e10edd1ef5ff973f1f9834637b9aa28cfe22f8" />
  <meta name="google-site-verification" content="rRDWFJmypYsfPFXa2oQOMtR2dq_lcGIyJA6BdcsPl7w" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ko_KR" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${area.shortName} 에어컨${serviceLabel} 당일출장 | ${area.name} 전문 | ${SITE_NAME}" />
  <meta property="og:description" content="${area.description}" />
  <meta property="og:url" content="${canonicalUrl}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${area.shortName} 에어컨${serviceLabel} 당일출장 | ${SITE_NAME}" />
  <meta name="twitter:description" content="${area.description}" />

  <!-- JSON-LD LocalBusiness -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "${BASE_URL}/#localbusiness",
    "name": "${SITE_NAME}",
    "url": "${BASE_URL}",
    "telephone": "${PHONE}",
    "description": "${area.description}",
    "priceRange": "$$",
    "openingHours": "Mo-Su 08:00-21:00",
    "areaServed": "${area.name}",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": ${area.lat},
      "longitude": ${area.lng}
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "${area.shortName} 에어컨 서비스",
      "itemListElement": [
        ${isRepair ? `{ "@type": "Offer", "itemOffered": { "@type": "Service", "name": "${area.shortName} 에어컨 수리" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "${area.shortName} 에어컨 가스충전" } },` : ''}
        ${isClean ? `{ "@type": "Offer", "itemOffered": { "@type": "Service", "name": "${area.shortName} 에어컨 분해청소" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "${area.shortName} 시스템에어컨 청소" } },` : ''}
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "${area.shortName} 천장형 에어컨 청소" } }
      ]
    },
    "sameAs": []
  }
  </script>

  <!-- JSON-LD BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": "${BASE_URL}" },
      { "@type": "ListItem", "position": 2, "name": "서비스 지역", "item": "${BASE_URL}/area" },
      { "@type": "ListItem", "position": 3, "name": "${area.shortName} 에어컨${serviceLabel}", "item": "${canonicalUrl}" }
    ]
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --primary: #0057FF;
      --primary-dark: #003FCC;
      --primary-light: #E8F0FF;
      --accent: #00C2FF;
      --dark: #0A0F1E;
      --text-main: #1A1F35;
      --text-sub: #5A6380;
      --white: #FFFFFF;
      --radius: 16px;
    }
    html { scroll-behavior: smooth; }
    body { font-family: 'Noto Sans KR', sans-serif; background: #F7F9FF; color: var(--text-main); line-height: 1.6; overflow-x: hidden; }

    /* NAV */
    .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(10,15,30,0.95); backdrop-filter: blur(12px); padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
    .nav-logo { color: #fff; font-weight: 800; font-size: 18px; text-decoration: none; }
    .nav-logo span { color: var(--accent); }
    .nav-phone { color: #fff; font-weight: 700; font-size: 15px; text-decoration: none; background: var(--primary); padding: 8px 16px; border-radius: 8px; }
    .nav-phone i { margin-right: 6px; }

    /* HERO */
    .hero { background: linear-gradient(135deg, #0A0F1E 0%, #0d1f4a 60%, #0057FF 100%); padding: 100px 24px 60px; text-align: center; }
    .breadcrumb { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px; font-size: 13px; color: rgba(255,255,255,0.5); }
    .breadcrumb a { color: rgba(255,255,255,0.5); text-decoration: none; }
    .breadcrumb a:hover { color: #fff; }
    .breadcrumb-sep { color: rgba(255,255,255,0.3); }
    .hero h1 { font-size: clamp(28px, 5vw, 44px); font-weight: 800; color: #fff; margin-bottom: 12px; line-height: 1.3; }
    .hero h1 em { color: var(--accent); font-style: normal; }
    .hero-sub { font-size: 16px; color: rgba(255,255,255,0.7); margin-bottom: 8px; }
    .hero-dongs { font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 32px; }
    .hero-cta { display: inline-flex; align-items: center; gap: 10px; background: #fff; color: var(--primary); font-size: 18px; font-weight: 800; padding: 16px 36px; border-radius: 50px; text-decoration: none; box-shadow: 0 8px 32px rgba(0,87,255,0.3); }
    .hero-cta i { font-size: 20px; }

    /* SECTION */
    .section { padding: 60px 24px; max-width: 720px; margin: 0 auto; }
    .section-title { font-size: 22px; font-weight: 800; color: var(--text-main); margin-bottom: 24px; padding-bottom: 12px; border-bottom: 3px solid var(--primary); }
    .section-title i { color: var(--primary); margin-right: 8px; }

    /* SERVICE CARDS */
    .service-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .service-card { background: #fff; border-radius: var(--radius); padding: 24px 20px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #EEF2FF; }
    .service-card i { font-size: 32px; color: var(--primary); margin-bottom: 12px; display: block; }
    .service-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
    .service-card p { font-size: 13px; color: var(--text-sub); line-height: 1.6; }

    /* PROCESS */
    .process-list { display: flex; flex-direction: column; gap: 16px; }
    .process-item { display: flex; align-items: flex-start; gap: 16px; background: #fff; border-radius: var(--radius); padding: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
    .process-num { width: 36px; height: 36px; border-radius: 50%; background: var(--primary); color: #fff; font-weight: 800; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .process-text h4 { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
    .process-text p { font-size: 13px; color: var(--text-sub); }

    /* PRICE */
    .price-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: var(--radius); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .price-table th { background: var(--primary); color: #fff; padding: 14px 16px; font-size: 14px; font-weight: 700; text-align: left; }
    .price-table td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid #EEF2FF; }
    .price-table tr:last-child td { border-bottom: none; }
    .price-note { font-size: 12px; color: var(--text-sub); margin-top: 10px; }

    /* DONG LIST */
    .dong-grid { display: flex; flex-wrap: wrap; gap: 10px; }
    .dong-tag { background: var(--primary-light); color: var(--primary); padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }

    /* CTA BOTTOM */
    .cta-bottom { background: linear-gradient(135deg, var(--dark) 0%, #0d1f4a 100%); padding: 60px 24px; text-align: center; }
    .cta-bottom h2 { font-size: clamp(22px, 4vw, 32px); font-weight: 800; color: #fff; margin-bottom: 8px; }
    .cta-bottom p { color: rgba(255,255,255,0.6); font-size: 15px; margin-bottom: 28px; }
    .cta-btn { display: inline-flex; align-items: center; gap: 10px; background: var(--primary); color: #fff; font-size: 18px; font-weight: 800; padding: 18px 40px; border-radius: 50px; text-decoration: none; }

    /* BACK LINK */
    .back-link { display: block; text-align: center; padding: 24px; font-size: 14px; color: var(--text-sub); text-decoration: none; }
    .back-link:hover { color: var(--primary); }

    @media (max-width: 480px) {
      .hero h1 { font-size: 26px; }
      .hero-cta { font-size: 16px; padding: 14px 28px; }
      .cta-btn { font-size: 16px; padding: 16px 28px; }
    }
  </style>
</head>
<body>

  <!-- 네비게이션 -->
  <nav class="nav">
    <a href="/" class="nav-logo">에어컨<span>해결사</span></a>
    <a href="tel:${PHONE}" class="nav-phone"><i class="fas fa-phone"></i>${PHONE}</a>
  </nav>

  <!-- 히어로 -->
  <section class="hero">
    <nav class="breadcrumb" aria-label="breadcrumb">
      <a href="/">홈</a>
      <span class="breadcrumb-sep">›</span>
      <a href="/area">서비스 지역</a>
      <span class="breadcrumb-sep">›</span>
      <span>${area.shortName} 에어컨${serviceLabel}</span>
    </nav>
    <h1><em>${area.shortName}</em> 에어컨${serviceLabel}<br>당일 출장 전문</h1>
    <p class="hero-sub">${area.name} 전 지역 방문 · 합리적인 가격 · 전문 기사 직접 방문</p>
    <p class="hero-dongs">${dongsText}</p>
    <a href="tel:${PHONE}" class="hero-cta">
      <i class="fas fa-phone"></i>
      지금 바로 전화상담
    </a>
  </section>

  <!-- 서비스 안내 -->
  <div class="section">
    <h2 class="section-title"><i class="fas fa-tools"></i>${area.shortName} 에어컨 서비스</h2>
    <div class="service-grid">
      ${isRepair ? `
      <div class="service-card">
        <i class="fas fa-wrench"></i>
        <h3>에어컨 수리</h3>
        <p>냉방불량·누수·이상소음<br>현장 즉시 진단 수리</p>
      </div>
      <div class="service-card">
        <i class="fas fa-wind"></i>
        <h3>가스충전</h3>
        <p>냉매 부족·누설 점검<br>친환경 냉매 충전</p>
      </div>
      ` : ''}
      ${isClean ? `
      <div class="service-card">
        <i class="fas fa-spray-can"></i>
        <h3>에어컨 분해청소</h3>
        <p>필터·열교환기 분해<br>고압 세척 후 건조</p>
      </div>
      <div class="service-card">
        <i class="fas fa-building"></i>
        <h3>시스템에어컨 청소</h3>
        <p>천장형·4방향 카세트<br>전문 장비 분해세척</p>
      </div>
      ` : ''}
      <div class="service-card">
        <i class="fas fa-clock"></i>
        <h3>당일 출장</h3>
        <p>전화 후 빠른 출장<br>${area.shortName} 전 지역 가능</p>
      </div>
    </div>
  </div>

  <!-- 출장 프로세스 -->
  <div class="section" style="background:#fff; max-width:100%; padding: 60px 24px;">
    <div style="max-width:720px; margin:0 auto;">
      <h2 class="section-title"><i class="fas fa-list-ol"></i>출장 진행 순서</h2>
      <div class="process-list">
        <div class="process-item">
          <div class="process-num">1</div>
          <div class="process-text">
            <h4>전화 상담</h4>
            <p>증상을 말씀해 주시면 예상 비용과 출장 시간을 안내해 드립니다.</p>
          </div>
        </div>
        <div class="process-item">
          <div class="process-num">2</div>
          <div class="process-text">
            <h4>출장 방문</h4>
            <p>${area.shortName} 전 지역 당일 출장. 전문 기사가 직접 방문합니다.</p>
          </div>
        </div>
        <div class="process-item">
          <div class="process-num">3</div>
          <div class="process-text">
            <h4>현장 진단</h4>
            <p>정확한 점검 후 비용을 사전에 안내. 동의 후 작업을 진행합니다.</p>
          </div>
        </div>
        <div class="process-item">
          <div class="process-num">4</div>
          <div class="process-text">
            <h4>작업 완료 및 테스트</h4>
            <p>작업 완료 후 정상 작동 확인. 사후 A/S도 책임집니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 요금 안내 -->
  <div class="section">
    <h2 class="section-title"><i class="fas fa-won-sign"></i>${area.shortName} 에어컨 요금 안내</h2>
    ${isRepair ? `
    <table class="price-table">
      <thead>
        <tr><th>서비스</th><th>요금 (출장비 포함)</th></tr>
      </thead>
      <tbody>
        <tr><td>에어컨 점검 진단</td><td>현장 안내</td></tr>
        <tr><td>가스충전 (R410A 기준)</td><td>6만원~</td></tr>
        <tr><td>실내기 수리</td><td>현장 진단 후 안내</td></tr>
        <tr><td>전기부품 교체</td><td>현장 진단 후 안내</td></tr>
      </tbody>
    </table>
    ` : ''}
    ${isClean ? `
    <table class="price-table">
      <thead>
        <tr><th>청소 종류</th><th>요금</th></tr>
      </thead>
      <tbody>
        <tr><td>벽걸이 에어컨 분해청소</td><td>6만원~</td></tr>
        <tr><td>스탠드 에어컨 분해청소</td><td>8만원~</td></tr>
        <tr><td>시스템에어컨 1대 청소</td><td>10만원~</td></tr>
        <tr><td>천장형 (4방향 카세트)</td><td>현장 안내</td></tr>
      </tbody>
    </table>
    ` : ''}
    <p class="price-note">※ 실제 요금은 기종·상태에 따라 다를 수 있습니다. 방문 전 전화로 상담해 드립니다.</p>
  </div>

  <!-- 출장 지역 -->
  <div class="section" style="background:#fff; max-width:100%; padding: 60px 24px;">
    <div style="max-width:720px; margin:0 auto;">
      <h2 class="section-title"><i class="fas fa-map-marker-alt"></i>${area.shortName} 출장 가능 지역</h2>
      <div class="dong-grid">
        ${area.dongs.map(d => `<span class="dong-tag">${d}</span>`).join('\n        ')}
        <span class="dong-tag">${area.shortName} 전 지역</span>
      </div>
    </div>
  </div>

  <!-- 하단 CTA -->
  <section class="cta-bottom">
    <h2>${area.shortName} 에어컨 문제,<br>지금 바로 해결하세요</h2>
    <p>전화 한 통으로 당일 출장 · 합리적인 가격 · 전문 기사 직접 방문</p>
    <a href="tel:${PHONE}" class="cta-btn">
      <i class="fas fa-phone"></i>
      ${PHONE}
    </a>
  </section>

  <a href="/" class="back-link">← 에어컨해결사 메인으로 돌아가기</a>

</body>
</html>`
}
