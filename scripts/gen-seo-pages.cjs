/**
 * SEO 랜딩 페이지 일괄 생성 스크립트
 * 파워링크 키워드 + 구글 SEO 타겟 키워드 × 지역
 */
const fs = require('fs')
const path = require('path')

const OUT_DIR = path.join(__dirname, '../public/area')

// ─── 지역 데이터 ───────────────────────────────────────────────
// 파워링크 집행 지역 (핵심) + SEO 추가 확장 지역
const REGIONS = [
  // ── 파워링크 집행 8개 지역 (최우선) ──
  { name:'금천구',   short:'금천',   dongs:['가산동','독산동','시흥동'],                    lat:37.4564, lng:126.8954 },
  { name:'구로구',   short:'구로',   dongs:['구로동','개봉동','오류동','항동'],              lat:37.4954, lng:126.8874 },
  { name:'강동구',   short:'강동',   dongs:['천호동','암사동','길동','명일동'],              lat:37.5301, lng:127.1238 },
  { name:'하남시',   short:'하남',   dongs:['덕풍동','신장동','미사동','감이동'],            lat:37.5397, lng:127.2148 },
  { name:'중랑구',   short:'중랑',   dongs:['묵동','신내동','망우동','면목동'],              lat:37.6063, lng:127.0925 },
  { name:'동대문구', short:'동대문', dongs:['전농동','답십리동','장안동','회기동'],          lat:37.5744, lng:127.0397 },
  { name:'노원구',   short:'노원',   dongs:['상계동','중계동','월계동','공릉동'],            lat:37.6543, lng:127.0568 },
  { name:'강북구',   short:'강북',   dongs:['미아동','번동','수유동','우이동'],              lat:37.6396, lng:127.0257 },
  // ── 기존 서비스 지역 (이미 수리/가스 페이지 있지만 증상페이지 추가) ──
  { name:'관악구',   short:'관악',   dongs:['신림동','봉천동','남현동'],                    lat:37.4784, lng:126.9516 },
  { name:'영등포구', short:'영등포', dongs:['영등포동','여의도동','당산동','양평동'],        lat:37.5264, lng:126.8963 },
  { name:'광명시',   short:'광명',   dongs:['광명동','철산동','하안동','소하동'],            lat:37.4786, lng:126.8664 },
  { name:'안양시',   short:'안양',   dongs:['안양동','비산동','관양동','평촌동','호계동'],   lat:37.3943, lng:126.9568 },
  { name:'성북구',   short:'성북',   dongs:['성북동','정릉동','길음동','돈암동'],            lat:37.5894, lng:127.0167 },
  { name:'남양주시', short:'남양주', dongs:['화도읍','별내동','다산동','퇴계원읍'],          lat:37.6360, lng:127.2165 },
  { name:'구리시',   short:'구리',   dongs:['인창동','교문동','수택동','토평동'],            lat:37.5943, lng:127.1296 },
  // ── SEO 확장 추가 지역 (수도권 인구 밀집, 검색량 높음) ──
  { name:'송파구',   short:'송파',   dongs:['잠실동','가락동','문정동','거여동'],            lat:37.5145, lng:127.1059 },
  { name:'강남구',   short:'강남',   dongs:['역삼동','삼성동','대치동','개포동'],            lat:37.5172, lng:127.0473 },
  { name:'서초구',   short:'서초',   dongs:['서초동','방배동','반포동','양재동'],            lat:37.4837, lng:127.0324 },
  { name:'마포구',   short:'마포',   dongs:['합정동','망원동','상암동','공덕동'],            lat:37.5663, lng:126.9014 },
  { name:'은평구',   short:'은평',   dongs:['불광동','응암동','녹번동','진관동'],            lat:37.6176, lng:126.9227 },
  { name:'서대문구', short:'서대문', dongs:['홍제동','홍은동','남가좌동','북가좌동'],        lat:37.5791, lng:126.9368 },
  { name:'용산구',   short:'용산',   dongs:['이태원동','한남동','청파동','효창동'],          lat:37.5324, lng:126.9904 },
  { name:'성동구',   short:'성동',   dongs:['왕십리동','행당동','사근동','금호동'],          lat:37.5634, lng:127.0369 },
  { name:'도봉구',   short:'도봉',   dongs:['도봉동','방학동','쌍문동','창동'],              lat:37.6688, lng:127.0471 },
  { name:'양천구',   short:'양천',   dongs:['신정동','목동','신월동'],                      lat:37.5270, lng:126.8566 },
  { name:'강서구',   short:'강서',   dongs:['화곡동','방화동','마곡동','염창동'],            lat:37.5509, lng:126.8496 },
  { name:'동작구',   short:'동작',   dongs:['사당동','노량진동','상도동','흑석동'],          lat:37.5124, lng:126.9394 },
  { name:'관악구',   short:'관악2',  dongs:['신림동','봉천동','남현동'],                    lat:37.4784, lng:126.9516 },
  { name:'수원시',   short:'수원',   dongs:['영통동','권선동','팔달동','장안동'],            lat:37.2636, lng:127.0286 },
  { name:'성남시',   short:'성남',   dongs:['분당동','판교동','수정동','중원동'],            lat:37.4196, lng:127.1267 },
  { name:'부천시',   short:'부천',   dongs:['중동','상동','원미동','소사동'],                lat:37.5035, lng:126.7660 },
  { name:'인천시',   short:'인천',   dongs:['부평동','계산동','작전동','갈산동'],            lat:37.4563, lng:126.7052 },
]

// ─── 키워드 정의 ───────────────────────────────────────────────
// type: 'symptom'=증상별 / 'brand'=브랜드별 / 'type'=기종별
const KEYWORDS = [
  // ── 파워링크 직접 키워드 (가장 중요) ──
  {
    slug: '에어컨소음',
    title: (s) => `${s} 에어컨 소음`,
    h1: (s) => `<em>${s}</em> 에어컨 소음<br>원인 진단·수리 전문`,
    desc: (s,n) => `${n} 에어컨 소음 전문 에어컨해결사. 실내기·실외기 소음·진동·이음 당일 출장 수리. ${s} 전 지역 방문.`,
    keywords: (s,n,ds) => `${s}에어컨소음,${s}에어컨수리,${n}에어컨소음,에어컨소음수리,${ds}`,
    svcCards: [
      {icon:'fa-volume-up', h:'소음·진동 수리', p:'에어컨 소음 원인 정확히 진단'},
      {icon:'fa-wrench',    h:'실외기 소음', p:'실외기 팬·컴프레서 소음 해결'},
      {icon:'fa-clock',     h:'당일 출장', p:`${' '}전 지역 빠른 출장`},
    ],
    priceRows: [['소음 원인 진단','현장 안내'],['실내기 팬 수리','현장 진단 후 안내'],['실외기 소음 수리','현장 진단 후 안내'],['베어링·팬모터 교체','현장 진단 후 안내']],
    faqs: [
      ['에어컨 켜면 딸깍·뚝뚝 소리가 나요','열팽창으로 인한 플라스틱 수축·팽창 소리이거나 팬 블레이드 이물질, 팬모터 베어링 마모일 수 있습니다. 지속될 경우 점검이 필요합니다.'],
      ['실외기에서 쇠 갈리는 소리가 나요','컴프레서 이상 또는 팬모터 베어링 마모 가능성이 높습니다. 방치하면 컴프레서 교체까지 이어질 수 있어 빠른 점검을 권장드립니다.'],
      ['에어컨 소음 수리 비용이 얼마나 되나요','원인에 따라 다르며 현장 진단 후 안내드립니다. 간단한 이물질 제거는 저렴하게 해결되나 부품 교체 시 비용이 달라집니다.'],
      ['당일 출장이 가능한가요','네, 오전 접수 시 당일 방문을 원칙으로 합니다. 전화 상담 후 빠르게 일정을 잡아드립니다.'],
    ],
    ctaText: (s) => `${s} 에어컨 소음, 오늘 바로 해결하세요`,
  },
  {
    slug: '에어컨물',
    title: (s) => `${s} 에어컨 물 떨어짐`,
    h1: (s) => `<em>${s}</em> 에어컨 물 떨어짐<br>누수 원인 수리 전문`,
    desc: (s,n) => `${n} 에어컨 물 떨어짐·누수 전문 에어컨해결사. 드레인 막힘·냉매 부족 누수 당일 출장. ${s} 전 지역 방문.`,
    keywords: (s,n,ds) => `${s}에어컨물,${s}에어컨누수,${n}에어컨물떨어짐,에어컨물수리,에어컨드레인,${ds}`,
    svcCards: [
      {icon:'fa-tint',      h:'누수 원인 진단', p:'드레인·냉매 누수 정확히 파악'},
      {icon:'fa-tools',     h:'드레인 청소', p:'막힌 배수호스 청소·교체'},
      {icon:'fa-clock',     h:'당일 출장', p:'벽·천장 누수 피해 전 빠른 해결'},
    ],
    priceRows: [['드레인 막힘 청소','현장 안내'],['드레인 호스 교체','현장 진단 후 안내'],['냉매 부족 충전','7만원~'],['결빙 원인 수리','현장 진단 후 안내']],
    faqs: [
      ['에어컨 실내기에서 물이 뚝뚝 떨어져요','드레인(배수) 호스가 막혔거나 냉매 부족으로 실내기가 결빙되는 경우 발생합니다. 방치하면 벽·천장 누수로 이어질 수 있어 빠른 점검이 필요합니다.'],
      ['에어컨 켤 때마다 물이 흘러요','에어컨 배수 경로 전체를 점검해야 합니다. 드레인 팬 오염, 호스 꺾임, 드레인 펌프 불량 등 다양한 원인이 있습니다.'],
      ['누수 수리 비용이 얼마나 되나요','드레인 청소는 비교적 저렴하며, 원인에 따라 달라집니다. 현장 진단 후 정확한 비용을 안내드립니다.'],
      ['당일 출장이 가능한가요','네, 누수는 피해가 커질 수 있어 최대한 빠르게 출장드립니다. 오전 접수 시 당일 방문을 원칙으로 합니다.'],
    ],
    ctaText: (s) => `${s} 에어컨 누수, 오늘 바로 점검하세요`,
  },
  {
    slug: '에어컨안켜짐',
    title: (s) => `${s} 에어컨 안켜짐`,
    h1: (s) => `<em>${s}</em> 에어컨 안켜짐<br>전원불량 수리 전문`,
    desc: (s,n) => `${n} 에어컨 안켜짐·전원불량 전문 에어컨해결사. 작동불량·리모컨·전기 문제 당일 출장. ${s} 전 지역 방문.`,
    keywords: (s,n,ds) => `${s}에어컨안켜짐,${s}에어컨전원,${n}에어컨고장,에어컨안켜짐수리,에어컨작동불량,${ds}`,
    svcCards: [
      {icon:'fa-power-off', h:'전원불량 수리', p:'에어컨 안켜짐 원인 정확 진단'},
      {icon:'fa-bolt',      h:'전기부품 교체', p:'컨트롤보드·퓨즈·릴레이 교체'},
      {icon:'fa-clock',     h:'당일 출장', p:'급한 에어컨 고장 당일 해결'},
    ],
    priceRows: [['전원불량 진단','현장 안내'],['리모컨·수신부 교체','현장 진단 후 안내'],['컨트롤보드 교체','현장 진단 후 안내'],['전기배선 수리','현장 진단 후 안내']],
    faqs: [
      ['에어컨 전원 버튼을 눌러도 안 켜져요','리모컨 배터리, 에어컨 수신부 불량, 컨트롤보드 이상, 과전류 차단기 트립 등 다양한 원인이 있습니다. 현장 점검으로 정확한 원인을 파악합니다.'],
      ['에어컨이 갑자기 꺼지고 안 켜져요','과부하 보호 장치 작동, 컴프레서 과열, 전기 문제일 수 있습니다. 특히 여름 성수기에 과부하로 발생하는 경우가 많습니다.'],
      ['에어컨 수리 비용이 얼마나 되나요','원인에 따라 다르며 리모컨 교체는 저렴하나 보드 교체 시 비용이 달라집니다. 현장 진단 후 정확히 안내드립니다.'],
      ['당일 수리가 가능한가요','네, 부품 재고 여부에 따라 당일 수리가 가능합니다. 전화 상담 시 증상 설명 주시면 미리 부품을 준비해 방문합니다.'],
    ],
    ctaText: (s) => `${s} 에어컨 안켜짐, 오늘 바로 수리하세요`,
  },
  {
    slug: '에어컨시원하지않음',
    title: (s) => `${s} 에어컨 시원하지않음`,
    h1: (s) => `<em>${s}</em> 에어컨 시원하지 않음<br>냉방불량 전문 수리`,
    desc: (s,n) => `${n} 에어컨 시원하지않음·냉방불량 전문 에어컨해결사. 가스충전·필터청소·실외기 점검 당일 출장. ${s} 전 지역.`,
    keywords: (s,n,ds) => `${s}에어컨시원하지않음,${s}에어컨냉방불량,${n}에어컨약냉,에어컨가스충전,에어컨냉매부족,${ds}`,
    svcCards: [
      {icon:'fa-thermometer-half', h:'냉방불량 진단', p:'냉매부족·실외기·필터 정확 점검'},
      {icon:'fa-wind',             h:'가스(냉매) 충전', p:'R410A·R22 정품 냉매 충전'},
      {icon:'fa-clock',            h:'당일 출장', p:'무더운 여름, 당일 해결'},
    ],
    priceRows: [['냉방불량 진단','현장 안내'],['가스충전 R410A','7만원~'],['가스충전 R22','현장 진단 후 안내'],['실외기 점검·수리','현장 진단 후 안내']],
    faqs: [
      ['에어컨이 약냉으로만 나와요','냉매(가스) 부족이 가장 흔한 원인입니다. 단, 냉매 부족의 원인(누설 등)을 파악하지 않으면 재발합니다. 전문 기사가 누설 여부까지 점검합니다.'],
      ['필터 청소했는데도 시원하지 않아요','필터가 아닌 실내기 코일 오염, 냉매 부족, 실외기 과부하일 수 있습니다. 정확한 진단이 필요합니다.'],
      ['가스충전 비용이 얼마나 되나요','R410A 기준 7만원~이며 냉매 종류와 충전량에 따라 달라집니다. 현장에서 정확히 안내드립니다.'],
      ['여름 성수기에도 당일 출장이 되나요','최대한 당일 출장을 원칙으로 합니다. 성수기에는 오전 일찍 접수하시면 당일 방문 가능성이 높습니다.'],
    ],
    ctaText: (s) => `${s} 에어컨 냉방불량, 오늘 바로 점검하세요`,
  },
  {
    slug: '실외기고장',
    title: (s) => `${s} 에어컨 실외기 고장`,
    h1: (s) => `<em>${s}</em> 에어컨 실외기 고장<br>당일 출장 전문 수리`,
    desc: (s,n) => `${n} 에어컨 실외기 고장·수리 전문 에어컨해결사. 실외기 안돌아감·소음·과열 당일 출장. ${s} 전 지역 방문.`,
    keywords: (s,n,ds) => `${s}실외기고장,${s}에어컨실외기,${n}실외기수리,에어컨실외기안돌아감,실외기소음,${ds}`,
    svcCards: [
      {icon:'fa-cogs',  h:'실외기 진단', p:'컴프레서·팬모터·PCB 정밀 점검'},
      {icon:'fa-wrench',h:'실외기 수리', p:'실외기 부품 교체·수리 전문'},
      {icon:'fa-clock', h:'당일 출장', p:'실외기 고장 당일 해결'},
    ],
    priceRows: [['실외기 진단','현장 안내'],['팬모터 교체','현장 진단 후 안내'],['PCB 기판 수리','현장 진단 후 안내'],['컴프레서 점검','현장 진단 후 안내']],
    faqs: [
      ['실외기 팬이 돌아가지 않아요','팬모터 불량, PCB 기판 이상, 캐패시터 고장이 주요 원인입니다. 방치하면 컴프레서에 무리가 가므로 빠른 수리가 필요합니다.'],
      ['실외기가 자꾸 꺼졌다 켜졌다 해요','과열 보호 장치 작동, 냉매 부족, 응축기 오염 등의 원인이 있습니다. 여름 고온에 자주 발생합니다.'],
      ['실외기 수리 비용이 얼마나 되나요','부품에 따라 다르며 팬모터 등 부품 교체가 필요한 경우 현장 진단 후 안내드립니다.'],
      ['당일 수리가 가능한가요','네, 부품 재고에 따라 당일 수리가 가능합니다. 전화 상담으로 미리 증상 말씀해 주시면 준비해 방문합니다.'],
    ],
    ctaText: (s) => `${s} 실외기 고장, 오늘 바로 수리하세요`,
  },
  {
    slug: '에어컨매립배관수리',
    title: (s) => `${s} 에어컨 배관 수리`,
    h1: (s) => `<em>${s}</em> 에어컨 배관 수리<br>매립배관 전문`,
    desc: (s,n) => `${n} 에어컨 매립배관 수리·교체 전문 에어컨해결사. 냉매배관 누설·파손 당일 출장. ${s} 전 지역 방문.`,
    keywords: (s,n,ds) => `${s}에어컨배관,${s}에어컨매립배관,${n}에어컨배관수리,에어컨배관교체,냉매배관누설,${ds}`,
    svcCards: [
      {icon:'fa-stream', h:'배관 누설 점검', p:'냉매 배관 누설 정밀 진단'},
      {icon:'fa-tools',  h:'배관 수리·교체', p:'매립배관 수리 및 재시공'},
      {icon:'fa-clock',  h:'당일 출장', p:'배관 문제 당일 해결'},
    ],
    priceRows: [['배관 누설 점검','현장 안내'],['배관 수리','현장 진단 후 안내'],['배관 교체','현장 진단 후 안내'],['가스 재충전','7만원~']],
    faqs: [
      ['에어컨 가스가 자꾸 빠져요','배관 연결부 누설이 가장 흔한 원인입니다. 단순 충전만으로는 재발하므로 누설 부위를 찾아 수리 후 충전해야 합니다.'],
      ['매립배관 수리가 가능한가요','네, 가능합니다. 매립된 배관의 누설 위치를 파악하여 수리 또는 교체합니다. 벽 철거 없이 가능한 방법을 우선 시도합니다.'],
      ['배관 수리 비용이 얼마나 되나요','배관 상태와 범위에 따라 다릅니다. 현장 점검 후 정확한 비용을 사전에 안내드립니다.'],
      ['당일 출장이 가능한가요','네, 오전 접수 시 당일 방문을 원칙으로 합니다. 전화 상담 후 빠르게 일정을 잡아드립니다.'],
    ],
    ctaText: (s) => `${s} 에어컨 배관 문제, 오늘 바로 점검하세요`,
  },
  {
    slug: '위니아에어컨수리',
    title: (s) => `${s} 위니아 에어컨 수리`,
    h1: (s) => `<em>${s}</em> 위니아 에어컨 수리<br>당일 출장 전문`,
    desc: (s,n) => `${n} 위니아(딤채·대우) 에어컨 수리 전문 에어컨해결사. 위니아 전 기종 수리·가스충전 당일 출장. ${s} 전 지역.`,
    keywords: (s,n,ds) => `${s}위니아에어컨,${s}위니아에어컨수리,${n}위니아에어컨,위니아에어컨수리,대우에어컨수리,${ds}`,
    svcCards: [
      {icon:'fa-snowflake', h:'위니아 전 기종', p:'벽걸이·스탠드·시스템 모두 수리'},
      {icon:'fa-wind',      h:'가스충전', p:'위니아 냉매 충전 전문'},
      {icon:'fa-clock',     h:'당일 출장', p:'위니아 에어컨 당일 해결'},
    ],
    priceRows: [['위니아 점검 진단','현장 안내'],['가스충전','7만원~'],['부품 교체 수리','현장 진단 후 안내'],['전기부품 교체','현장 진단 후 안내']],
    faqs: [
      ['위니아 에어컨 수리가 가능한가요','네, 위니아(구 대우일렉) 전 기종 수리가 가능합니다. 벽걸이·스탠드·천장형 모두 대응합니다.'],
      ['위니아 에어컨 부품 구하기 어렵지 않나요','주요 부품은 재고를 보유하고 있으며, 특수 부품은 수급 후 방문합니다. 전화 상담 시 미리 확인해 드립니다.'],
      ['위니아 에어컨 수리 비용이 얼마나 되나요','고장 원인과 부품에 따라 다릅니다. 현장 진단 후 수리 전 비용을 먼저 안내드립니다.'],
      ['당일 출장이 가능한가요','네, 오전 접수 시 당일 방문을 원칙으로 합니다.'],
    ],
    ctaText: (s) => `${s} 위니아 에어컨, 오늘 바로 수리하세요`,
  },
  {
    slug: '창문형에어컨수리',
    title: (s) => `${s} 창문형 에어컨 수리`,
    h1: (s) => `<em>${s}</em> 창문형 에어컨 수리<br>당일 출장 전문`,
    desc: (s,n) => `${n} 창문형 에어컨 수리 전문 에어컨해결사. 창문형 에어컨 고장·가스충전·소음 당일 출장. ${s} 전 지역 방문.`,
    keywords: (s,n,ds) => `${s}창문형에어컨,${s}창문형에어컨수리,${n}창문형에어컨,창문형에어컨수리,창문형에어컨가스충전,${ds}`,
    svcCards: [
      {icon:'fa-window-maximize', h:'창문형 전문', p:'창문형 에어컨 전 기종 수리'},
      {icon:'fa-wind',            h:'가스충전', p:'창문형 냉매 충전 전문'},
      {icon:'fa-clock',           h:'당일 출장', p:'창문형 에어컨 당일 해결'},
    ],
    priceRows: [['창문형 점검 진단','현장 안내'],['가스충전','현장 진단 후 안내'],['부품 교체 수리','현장 진단 후 안내'],['소음·진동 수리','현장 진단 후 안내']],
    faqs: [
      ['창문형 에어컨 수리가 가능한가요','네, 창문형(윈도우) 에어컨 전 기종 수리가 가능합니다. 냉방불량·소음·전원불량 등 모든 증상 대응합니다.'],
      ['창문형 에어컨도 가스충전이 되나요','네, 가능합니다. 창문형 에어컨도 냉매가 부족하면 가스충전이 필요합니다. 현장에서 냉매 상태를 확인 후 진행합니다.'],
      ['창문형 에어컨 수리 비용이 얼마나 되나요','고장 원인에 따라 다르며, 현장 진단 후 수리 전 비용을 안내드립니다.'],
      ['당일 출장이 가능한가요','네, 오전 접수 시 당일 방문을 원칙으로 합니다.'],
    ],
    ctaText: (s) => `${s} 창문형 에어컨, 오늘 바로 수리하세요`,
  },
]

// ─── HTML 생성 함수 ───────────────────────────────────────────
function buildPage(region, kw) {
  const s = region.short
  const n = region.name
  const ds = region.dongs.join(',')
  const dongsText = region.dongs.join(' · ')
  const slug = `${s}-${kw.slug}`
  const url = `https://www.airconhelper.co.kr/area/${slug}`

  const title = `${kw.title(s)} 당일출장 | ${n} 전문 | 에어컨해결사`
  const desc  = kw.desc(s, n)
  const kwStr = kw.keywords(s, n, ds)
  const h1    = kw.h1(s)

  const svcCards = kw.svcCards.map(c =>
    `<div class="svc-card"><i class="fas ${c.icon}"></i><h3>${c.h}</h3><p>${c.p.replace('${s}', s)}</p></div>`
  ).join('')

  const priceRows = kw.priceRows.map(([svc, price]) =>
    `<tr><td>${svc}</td><td>${price}</td></tr>`
  ).join('')

  const faqItems = kw.faqs.map((f, i) => `<div class="faq-item${i===0?' open':''}">
      <button class="faq-q" onclick="this.parentElement.classList.toggle('open')">${f[0]}<i class="fas fa-chevron-down"></i></button>
      <div class="faq-a">${f[1]}</div>
    </div>`).join('')

  const dongSpans = region.dongs.map(d => `<span class="dong">${d}</span>`).join('')

  const faqSchema = JSON.stringify({
    "@context":"https://schema.org","@type":"FAQPage",
    "mainEntity": kw.faqs.map(f => ({
      "@type":"Question","name":f[0],
      "acceptedAnswer":{"@type":"Answer","text":f[1]}
    }))
  })
  const lbSchema = JSON.stringify({
    "@context":"https://schema.org","@type":"LocalBusiness",
    "@id":"https://www.airconhelper.co.kr/#localbusiness",
    "name":"에어컨해결사","url":"https://www.airconhelper.co.kr",
    "telephone":"010-2343-2966","description":desc,
    "priceRange":"$$","openingHours":"Mo-Su 08:00-21:00",
    "areaServed":n,
    "geo":{"@type":"GeoCoordinates","latitude":region.lat,"longitude":region.lng}
  })
  const bcSchema = JSON.stringify({
    "@context":"https://schema.org","@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"홈","item":"https://www.airconhelper.co.kr"},
      {"@type":"ListItem","position":2,"name":"서비스 지역","item":"https://www.airconhelper.co.kr/area"},
      {"@type":"ListItem","position":3,"name":`${s} ${kw.slug.replace(/-/g,' ')}`,"item":url}
    ]
  })

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title}</title>
  <meta name="description" content="${desc}"/>
  <meta name="keywords" content="${kwStr}"/>
  <meta name="robots" content="index,follow"/>
  <meta name="naver-site-verification" content="10e10edd1ef5ff973f1f9834637b9aa28cfe22f8"/>
  <meta name="google-site-verification" content="rRDWFJmypYsfPFXa2oQOMtR2dq_lcGIyJA6BdcsPl7w"/>
  <link rel="canonical" href="${url}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:locale" content="ko_KR"/>
  <meta property="og:site_name" content="에어컨해결사"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${desc}"/>
  <meta property="og:url" content="${url}"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <script type="application/ld+json">${lbSchema}</script>
  <script type="application/ld+json">${faqSchema}</script>
  <script type="application/ld+json">${bcSchema}</script>
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
  <a href="tel:010-2343-2966" class="nav-tel"><i class="fas fa-phone"></i> 010-2343-2966</a>
</nav>

<section class="hero">
  <nav class="bc" aria-label="breadcrumb">
    <a href="/">홈</a><span>›</span><a href="/area">서비스 지역</a><span>›</span><span>${s} ${kw.slug}</span>
  </nav>
  <h1>${h1}</h1>
  <p class="hero-sub">${n} 전 지역 방문 · 당일 출장 · 전문 기사 직접 방문</p>
  <p class="hero-dongs">${dongsText}</p>
  <a href="tel:010-2343-2966" class="cta"><i class="fas fa-phone"></i> 지금 바로 전화상담</a>
</section>

<div class="wrap">
  <h2 class="sec-title"><i class="fas fa-tools"></i>${s} ${kw.slug} 서비스</h2>
  <div class="svc-grid">${svcCards}</div>
</div>

<div class="white-sec">
  <div style="max-width:720px;margin:0 auto">
    <h2 class="sec-title"><i class="fas fa-list-ol"></i>출장 진행 순서</h2>
    <div class="steps">
      <div class="step"><div class="step-num">1</div><div><h4>전화 상담</h4><p>증상을 말씀해 주시면 예상 비용과 출장 시간을 안내드립니다.</p></div></div>
      <div class="step"><div class="step-num">2</div><div><h4>출장 방문</h4><p>${n} 전 지역 당일 출장. 전문 기사가 직접 방문합니다.</p></div></div>
      <div class="step"><div class="step-num">3</div><div><h4>현장 진단</h4><p>정확한 점검 후 비용 사전 안내. 동의 후 작업을 진행합니다.</p></div></div>
      <div class="step"><div class="step-num">4</div><div><h4>완료 및 테스트</h4><p>작업 완료 후 정상 작동 확인. 사후 A/S도 책임집니다.</p></div></div>
    </div>
  </div>
</div>

<div class="wrap">
  <h2 class="sec-title"><i class="fas fa-won-sign"></i>${s} 요금 안내</h2>
  <table class="price-tbl">
    <thead><tr><th>서비스</th><th>요금</th></tr></thead>
    <tbody>${priceRows}</tbody>
  </table>
  <p class="note">※ 기종·상태에 따라 달라질 수 있습니다. 방문 전 전화로 상담해 드립니다.</p>
</div>

<div class="white-sec">
  <div style="max-width:720px;margin:0 auto">
    <h2 class="sec-title"><i class="fas fa-map-marker-alt"></i>${s} 출장 가능 지역</h2>
    <div class="dong-wrap">${dongSpans}<span class="dong">${s} 전 지역</span></div>
  </div>
</div>

<div class="wrap">
  <h2 class="sec-title"><i class="fas fa-question-circle"></i>${s} ${kw.slug} 자주 묻는 질문</h2>
  <div class="faq-list">${faqItems}</div>
</div>

<section class="cta2">
  <h2>${kw.ctaText(s)}</h2>
  <p>전화 한 통으로 당일 출장 · 합리적인 가격 · 전문 기사 직접 방문</p>
  <a href="tel:010-2343-2966" class="cta2-btn"><i class="fas fa-phone"></i> 010-2343-2966</a>
</section>
<a href="/" class="back">← 에어컨해결사 메인으로 돌아가기</a>
</body>
</html>`
}

// ─── 실행 ─────────────────────────────────────────────────────
let created = 0
let skipped = 0

// 중복 지역 제거 (관악2 처리)
const uniqueRegions = REGIONS.filter((r, i, arr) =>
  arr.findIndex(x => x.short === r.short) === i
)

for (const region of uniqueRegions) {
  for (const kw of KEYWORDS) {
    const filename = `${region.short}-${kw.slug}.html`
    const filepath = path.join(OUT_DIR, filename)
    if (fs.existsSync(filepath)) {
      skipped++
      continue
    }
    const html = buildPage(region, kw)
    fs.writeFileSync(filepath, html, 'utf8')
    created++
    process.stdout.write(`✅ ${filename}\n`)
  }
}

console.log(`\n완료! 생성: ${created}개 / 건너뜀(기존): ${skipped}개`)
console.log(`전체 area 페이지: ${fs.readdirSync(OUT_DIR).length}개`)
