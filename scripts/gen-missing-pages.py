#!/usr/bin/env python3
"""
누락된 90개 area 페이지 생성 스크립트
- 에어컨수리, 에어컨가스충전, 냉매충전, 에어컨점검, 에어컨청소
"""

import os
import urllib.parse

OUT_DIR = '/home/user/webapp/public/area'

# 지역 데이터 (gen-seo-pages.cjs 와 동일)
REGIONS = [
    {'short':'금천', 'name':'금천구', 'dongs':['가산동','독산동','시흥동'], 'feature':'가산디지털단지와 독산·시흥동 주택가가 밀집한 금천구', 'traffic':'지하철 1·7호선 이용 가능', 'apt':'구축 아파트와 빌라 밀집 지역으로 에어컨 노후화 비율이 높습니다'},
    {'short':'구로', 'name':'구로구', 'dongs':['구로동','개봉동','오류동','항동'], 'feature':'구로디지털단지와 개봉·오류동 주거지가 혼재한 구로구', 'traffic':'지하철 1·2·7호선 교차 운행', 'apt':'다세대·빌라·오피스텔 등 다양한 주거 형태가 많습니다'},
    {'short':'강동', 'name':'강동구', 'dongs':['천호동','암사동','길동','명일동'], 'feature':'천호·암사동 상업지구와 명일·길동 주거단지가 공존하는 강동구', 'traffic':'지하철 5·8·9호선 이용', 'apt':'30~40년 이상 구축 아파트 단지가 많아 에어컨 노후화 점검이 필요합니다'},
    {'short':'하남', 'name':'하남시', 'dongs':['덕풍동','신장동','미사동','감이동'], 'feature':'미사강변도시 신축 아파트와 덕풍·신장동 기성 주거지가 함께하는 하남시', 'traffic':'지하철 5호선 연장선 이용', 'apt':'미사지구 신축 아파트부터 구도심 주택까지 다양한 에어컨 수리 수요가 있습니다'},
    {'short':'중랑', 'name':'중랑구', 'dongs':['묵동','신내동','망우동','면목동'], 'feature':'신내동 신도시와 면목·망우동 주거 밀집 지역인 중랑구', 'traffic':'지하철 7호선·경의중앙선 이용', 'apt':'중저가 빌라와 아파트가 많으며 여름철 에어컨 수리 접수가 집중됩니다'},
    {'short':'동대문', 'name':'동대문구', 'dongs':['전농동','답십리동','장안동','회기동'], 'feature':'전농·답십리 재개발 지역과 장안동 상권이 활성화된 동대문구', 'traffic':'지하철 1·2·5호선 이용', 'apt':'재개발·재건축 단지와 기존 주거지가 혼재해 신·구 에어컨 모두 수리합니다'},
    {'short':'노원', 'name':'노원구', 'dongs':['상계동','중계동','월계동','공릉동'], 'feature':'상계·중계동 대형 아파트 단지가 밀집한 서울 북부 최대 주거지 노원구', 'traffic':'지하철 4·6·7호선 이용', 'apt':'1980~90년대 대단지 아파트가 많아 에어컨 교체·수리 수요가 꾸준합니다'},
    {'short':'강북', 'name':'강북구', 'dongs':['미아동','번동','수유동','우이동'], 'feature':'미아·수유동 주거 밀집 지역과 우이동 자연환경이 조화로운 강북구', 'traffic':'지하철 4호선·우이신설선 이용', 'apt':'단독주택과 빌라 비율이 높아 에어컨 가스충전·수리 수요가 많습니다'},
    {'short':'관악', 'name':'관악구', 'dongs':['신림동','봉천동','남현동'], 'feature':'서울대 인근 신림·봉천동 주거·상업 복합 지역인 관악구', 'traffic':'지하철 2호선·신림선 이용', 'apt':'원룸·빌라·고시원 등 다양한 주거 형태가 많아 소형 에어컨 수리도 전문입니다'},
    {'short':'영등포', 'name':'영등포구', 'dongs':['영등포동','여의도동','당산동','양평동'], 'feature':'여의도 금융중심지와 영등포 상권, 당산동 주거지가 공존하는 영등포구', 'traffic':'지하철 2·5·9호선 이용', 'apt':'고층 아파트와 상업용 건물이 많아 천장형·시스템 에어컨 수리도 가능합니다'},
    {'short':'광명', 'name':'광명시', 'dongs':['광명동','철산동','하안동','소하동'], 'feature':'KTX 광명역과 철산·하안동 아파트 단지가 발달한 경기 광명시', 'traffic':'지하철 7호선 이용, KTX 광명역', 'apt':'1990~2000년대 중형 아파트 단지가 많아 에어컨 노후화 수리 수요가 높습니다'},
    {'short':'안양', 'name':'안양시', 'dongs':['안양동','비산동','관양동','평촌동','호계동'], 'feature':'평촌신도시와 안양 구도심이 함께하는 경기 안양시', 'traffic':'지하철 1·4호선 이용', 'apt':'평촌 신도시 중형 아파트와 안양 구도심 빌라 등 다양한 주거지에 출장합니다'},
    {'short':'성북', 'name':'성북구', 'dongs':['성북동','정릉동','길음동','돈암동'], 'feature':'길음뉴타운과 정릉·성북동 주거지가 있는 성북구', 'traffic':'지하철 4·6호선 이용', 'apt':'뉴타운 신축과 구축 단독주택이 혼재해 다양한 에어컨 기종 수리 경험이 풍부합니다'},
    {'short':'남양주', 'name':'남양주시', 'dongs':['화도읍','별내동','다산동','퇴계원읍'], 'feature':'별내·다산 신도시와 화도·퇴계원 기성 주거지가 있는 남양주시', 'traffic':'경의중앙선·경춘선·GTX-B 예정', 'apt':'다산신도시 신축 아파트와 기존 주거지 에어컨 수리 모두 당일 출장합니다'},
    {'short':'구리', 'name':'구리시', 'dongs':['인창동','교문동','수택동','토평동'], 'feature':'서울과 맞닿은 소도시로 인창·수택동 아파트 단지가 밀집한 구리시', 'traffic':'지하철 8호선(별내선) 이용', 'apt':'소규모 아파트와 주택이 많으며 빠른 출장으로 당일 수리를 원칙으로 합니다'},
    {'short':'송파', 'name':'송파구', 'dongs':['잠실동','가락동','문정동','거여동'], 'feature':'잠실 롯데월드와 문정법조단지, 가락시장이 있는 송파구', 'traffic':'지하철 2·5·8·9호선 이용', 'apt':'잠실 재건축 대단지와 문정동 신축 아파트 등 고급 주거 단지에 전문 출장합니다'},
    {'short':'강남', 'name':'강남구', 'dongs':['역삼동','삼성동','대치동','개포동'], 'feature':'코엑스·대치학원가·역삼 오피스 밀집 지역인 강남구', 'traffic':'지하철 2·3·9호선 이용', 'apt':'고급 아파트와 오피스 빌딩이 많아 시스템·천장형 에어컨 수리도 전문입니다'},
    {'short':'서초', 'name':'서초구', 'dongs':['서초동','방배동','반포동','양재동'], 'feature':'법원·검찰청과 반포 래미안, 방배동 주택가가 있는 서초구', 'traffic':'지하철 2·3·4·9호선 이용', 'apt':'반포·잠원 고급 아파트 단지와 방배 단독주택가 에어컨 수리를 전문으로 합니다'},
    {'short':'마포', 'name':'마포구', 'dongs':['합정동','망원동','상암동','공덕동'], 'feature':'상암 DMC·홍대·합정 젊은이 거리가 공존하는 마포구', 'traffic':'지하철 2·5·6호선 이용', 'apt':'상암 신축 아파트와 합정·망원 빌라·주택 등 다양한 주거 형태 에어컨 수리합니다'},
    {'short':'은평', 'name':'은평구', 'dongs':['불광동','응암동','녹번동','진관동'], 'feature':'은평뉴타운과 불광·응암동 주거 밀집 지역인 은평구', 'traffic':'지하철 3·6호선·경의선 이용', 'apt':'은평뉴타운 신축 아파트와 구도심 빌라 에어컨 모두 당일 출장 수리합니다'},
    {'short':'서대문', 'name':'서대문구', 'dongs':['홍제동','홍은동','남가좌동','북가좌동'], 'feature':'연세·이화여대 인근과 홍제·홍은동 주거지가 있는 서대문구', 'traffic':'지하철 2·3·5호선 이용', 'apt':'다세대 주택과 빌라 비율이 높으며 대학가 원룸 에어컨 수리도 전문입니다'},
    {'short':'용산', 'name':'용산구', 'dongs':['이태원동','한남동','청파동','효창동'], 'feature':'이태원·한남동 고급 주거지와 청파·효창동 주택가인 용산구', 'traffic':'지하철 1·4·6호선·경의중앙선 이용', 'apt':'한남동 고급 빌라와 이태원 주거지 에어컨은 신속하고 깔끔한 수리를 원칙으로 합니다'},
    {'short':'성동', 'name':'성동구', 'dongs':['왕십리동','행당동','사근동','금호동'], 'feature':'성수동 카페거리와 왕십리역 주변 재개발 지역인 성동구', 'traffic':'지하철 2·5호선·경의중앙선 이용', 'apt':'성수·왕십리 재개발 신축 단지와 행당·금호동 기존 아파트 에어컨 수리합니다'},
    {'short':'도봉', 'name':'도봉구', 'dongs':['도봉동','방학동','쌍문동','창동'], 'feature':'창동역세권 개발과 방학·쌍문동 주거 밀집 지역인 도봉구', 'traffic':'지하철 1·4호선 이용', 'apt':'중저가 아파트와 빌라가 많아 합리적인 에어컨 수리 서비스를 제공합니다'},
    {'short':'양천', 'name':'양천구', 'dongs':['신정동','목동','신월동'], 'feature':'목동 학원가와 신정·신월동 아파트 단지가 있는 양천구', 'traffic':'지하철 2·5·9호선 이용', 'apt':'목동 신시가지 중형 아파트 단지가 많으며 에어컨 유지보수 수요가 높은 지역입니다'},
    {'short':'강서', 'name':'강서구', 'dongs':['화곡동','방화동','마곡동','염창동'], 'feature':'마곡지구 기업도시와 화곡동 주거 밀집 지역인 강서구', 'traffic':'지하철 5·9호선·공항철도 이용', 'apt':'마곡 신축 오피스텔·아파트와 화곡 빌라·주택 에어컨 수리 모두 당일 출장합니다'},
    {'short':'동작', 'name':'동작구', 'dongs':['사당동','노량진동','상도동','흑석동'], 'feature':'노량진 학원가와 사당·흑석동 주거지가 있는 동작구', 'traffic':'지하철 2·4·7·9호선 이용', 'apt':'흑석뉴타운 신축 아파트와 노량진·상도동 빌라 에어컨 수리 전문으로 출장합니다'},
    {'short':'수원', 'name':'수원시', 'dongs':['영통동','권선동','팔달동','장안동'], 'feature':'삼성전자 본사와 광교신도시, 수원 구도심이 있는 경기 수원시', 'traffic':'지하철 1호선·수인분당선 이용', 'apt':'광교 신도시 신축 아파트와 수원 구도심 아파트·빌라 에어컨 모두 출장 수리합니다'},
    {'short':'성남', 'name':'성남시', 'dongs':['분당동','판교동','수정동','중원동'], 'feature':'판교 IT벨리와 분당 신도시, 성남 구도심이 공존하는 성남시', 'traffic':'지하철 8호선·수인분당선 이용', 'apt':'분당 신도시 아파트와 판교 오피스텔, 성남 구도심 주거지 에어컨 수리 경험이 풍부합니다'},
    {'short':'부천', 'name':'부천시', 'dongs':['중동','상동','원미동','소사동'], 'feature':'부천 중동신도시와 소사·원미동 기성 주거지가 있는 경기 부천시', 'traffic':'지하철 1·7호선 이용', 'apt':'중동신도시 중형 아파트와 소사·원미동 빌라 에어컨 수리를 당일 출장으로 해결합니다'},
    {'short':'인천', 'name':'인천시', 'dongs':['부평동','계산동','작전동','갈산동'], 'feature':'부평 상권과 계산·작전동 주거 밀집 지역인 인천 부평구', 'traffic':'지하철 1·7호선·인천1호선 이용', 'apt':'부평 재개발 신축 단지와 기성 아파트·빌라 에어컨 수리를 당일 빠르게 출장합니다'},
]

# 서비스 정의
SERVICES = {
    '에어컨수리': {
        'title_fmt': '{short} 에어컨 수리 당일출장 | {name} 전문 | 에어컨해결사',
        'desc_fmt': '{name} 에어컨 수리 전문 에어컨해결사. 모든 브랜드·기종 당일 출장 수리. {short} 전 지역 방문.',
        'h1_line1': '에어컨수리',
        'h1_line2': '당일 출장 전문',
        'hero_sub': '전 지역 방문 · 당일 출장 · 전문 기사 직접 방문',
        'icon': 'fa-wrench',
        'rating': '4.9', 'reviews': '312',
        'cta2_h': '에어컨수리, 오늘 바로 해결하세요',
        'extra_list': [
            {'icon':'fa-tools','title':'수리 범위','desc':'벽걸이·스탠드·시스템·창문형 전 기종'},
            {'icon':'fa-check-circle','title':'사전 안내','desc':'정확한 점검 후 비용 사전 안내'},
        ]
    },
    '에어컨가스충전': {
        'title_fmt': '{short} 에어컨 가스충전 당일출장 | {name} 전문 | 에어컨해결사',
        'desc_fmt': '{name} 에어컨 가스충전(냉매 보충) 전문 에어컨해결사. 찬바람 안 나올 때 당일 출장. {short} 전 지역 방문.',
        'h1_line1': '에어컨 가스충전',
        'h1_line2': '냉매 보충 당일 출장',
        'hero_sub': '찬바람 안 나올 때 · 냉방 불량 · 당일 출장 가스 보충',
        'icon': 'fa-tint',
        'rating': '4.8', 'reviews': '276',
        'cta2_h': '에어컨 가스충전, 오늘 바로 해결하세요',
        'extra_list': [
            {'icon':'fa-tint','title':'냉매 보충','desc':'R-32·R-410A·R-22 전 냉매 취급'},
            {'icon':'fa-search','title':'누설 점검','desc':'충전 전 냉매 누설 여부 무료 점검'},
        ]
    },
    '냉매충전': {
        'title_fmt': '{short} 에어컨 냉매충전 당일출장 | {name} 전문 | 에어컨해결사',
        'desc_fmt': '{name} 에어컨 냉매충전 전문 에어컨해결사. 냉매 누설 점검·보충 당일 출장. {short} 전 지역 방문.',
        'h1_line1': '에어컨 냉매충전',
        'h1_line2': '가스 보충 당일 출장',
        'hero_sub': '냉방 효율 저하 · 냉매 부족 · 당일 출장 보충',
        'icon': 'fa-wind',
        'rating': '4.8', 'reviews': '248',
        'cta2_h': '에어컨 냉매충전, 오늘 바로 해결하세요',
        'extra_list': [
            {'icon':'fa-wind','title':'냉매 종류','desc':'R-32·R-410A·R-22 모든 냉매 보충 가능'},
            {'icon':'fa-search','title':'누설 점검','desc':'냉매 누설 원인 진단 및 무료 점검'},
        ]
    },
    '에어컨점검': {
        'title_fmt': '{short} 에어컨 점검 당일출장 | {name} 전문 | 에어컨해결사',
        'desc_fmt': '{name} 에어컨 점검 전문 에어컨해결사. 냉매량·전기계통·실외기 종합 점검. {short} 전 지역 방문.',
        'h1_line1': '에어컨 점검',
        'h1_line2': '종합 점검 당일 출장',
        'hero_sub': '여름 대비 점검 · 냉방 효율 확인 · 당일 출장 점검',
        'icon': 'fa-clipboard-check',
        'rating': '4.9', 'reviews': '198',
        'cta2_h': '에어컨 점검, 오늘 바로 받아보세요',
        'extra_list': [
            {'icon':'fa-clipboard-check','title':'종합 점검','desc':'냉매량·전기계통·실외기 전체 확인'},
            {'icon':'fa-thermometer-half','title':'냉방 효율','desc':'냉방 효율 저하 원인 사전 발견'},
        ]
    },
    '에어컨청소': {
        'title_fmt': '{short} 에어컨 청소 당일출장 | {name} 전문 | 에어컨해결사',
        'desc_fmt': '{name} 에어컨 청소 전문 에어컨해결사. 필터·열교환기·배수판 분해 세척. {short} 전 지역 방문.',
        'h1_line1': '에어컨 청소',
        'h1_line2': '분해 세척 당일 출장',
        'hero_sub': '냄새·곰팡이 제거 · 분해 세척 · 당일 출장 청소',
        'icon': 'fa-broom',
        'rating': '4.9', 'reviews': '334',
        'cta2_h': '에어컨 청소, 오늘 바로 예약하세요',
        'extra_list': [
            {'icon':'fa-broom','title':'분해 세척','desc':'필터·열교환기·배수판 완전 분해 세척'},
            {'icon':'fa-leaf','title':'살균 처리','desc':'항균 코팅 처리로 곰팡이 재발 방지'},
        ]
    },
}

# 이미 존재하는 파일 목록
existing = set()
for f in os.listdir(OUT_DIR):
    decoded = urllib.parse.unquote(f.replace('.html', ''))
    existing.add(decoded)

def make_dong_html(dongs):
    parts = [f'<span class="dong">{d}</span>' for d in dongs]
    return ''.join(parts)

def make_page(region, svc_slug, svc):
    short = region['short']
    name = region['name']
    dongs = region['dongs']
    feature = region['feature']
    traffic = region['traffic']
    apt = region['apt']
    
    slug_combined = f"{short}-{svc_slug}"
    encoded = urllib.parse.quote(slug_combined)
    canonical = f"https://www.airconhelper.co.kr/area/{encoded}"
    
    title = svc['title_fmt'].format(short=short, name=name)
    desc = svc['desc_fmt'].format(short=short, name=name)
    h1_1 = svc['h1_line1']
    h1_2 = svc['h1_line2']
    hero_sub = svc['hero_sub']
    icon = svc['icon']
    rating = svc['rating']
    reviews = svc['reviews']
    cta2_h = svc['cta2_h']

    # 내부 링크: 같은 지역 다른 서비스
    same_region_links = []
    for other_slug, other_svc in SERVICES.items():
        if other_slug != svc_slug:
            other_label = other_slug.replace('에어컨', f'{short} ')
            other_enc = urllib.parse.quote(f"{short}-{other_slug}")
            same_region_links.append(f'<a href="/area/{other_enc}" style="display:inline-block;padding:6px 12px;margin:4px;background:#F0F4FF;color:#0057FF;border-radius:6px;font-size:13px;text-decoration:none;">{short} {other_slug}</a>')
    
    # 내부 링크: 같은 서비스 다른 지역 (최대 5개)
    other_regions = [r for r in REGIONS if r['short'] != short][:5]
    same_svc_links = []
    for other_r in other_regions:
        other_enc = urllib.parse.quote(f"{other_r['short']}-{svc_slug}")
        same_svc_links.append(f'<a href="/area/{other_enc}" style="display:inline-block;padding:6px 12px;margin:4px;background:#F0F4FF;color:#0057FF;border-radius:6px;font-size:13px;text-decoration:none;">{other_r["short"]} {svc_slug}</a>')

    dong_tags = make_dong_html(dongs)
    dongs_str = ' · '.join(dongs)
    
    # extra_list HTML
    extra_li = '\n'.join([
        f'        <li><i class="fas {e["icon"]}"></i> <strong>{e["title"]}</strong>: {e["desc"]}</li>'
        for e in svc['extra_list']
    ])

    html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>{title}</title>
  <meta name="description" content="{desc}"/>
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large"/>
  <meta name="google-site-verification" content="rRDWFJmypYsfPFXa2oQOMtR2dq_lcGIyJA6BdcsPl7w"/>
  <link rel="canonical" href="{canonical}"/>
  <meta property="og:title" content="{title}"/>
  <meta property="og:description" content="{desc}"/>
  <meta property="og:url" content="{canonical}"/>
  <script type="application/ld+json">{{"@context": "https://schema.org", "@type": "HomeAndConstructionBusiness", "@id": "https://www.airconhelper.co.kr/#localbusiness", "name": "에어컨해결사", "url": "https://www.airconhelper.co.kr", "telephone": "010-2343-2966", "description": "{desc}", "priceRange": "$$", "openingHours": "Mo-Su 08:00-21:00", "areaServed": "{name}", "alternateName": "{short} {svc_slug} 당일출장", "currenciesAccepted": "KRW", "paymentAccepted": "현금, 계좌이체, 카드", "aggregateRating": {{"@type": "AggregateRating", "ratingValue": "{rating}", "reviewCount": "{reviews}", "bestRating": "5", "worstRating": "1"}}}}</script>
  <script type="application/ld+json">{{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{{"@type":"ListItem","position":1,"name":"홈","item":"https://www.airconhelper.co.kr"}},{{"@type":"ListItem","position":2,"name":"서비스 지역","item":"https://www.airconhelper.co.kr/area"}},{{"@type":"ListItem","position":3,"name":"{short} {svc_slug}","item":"{canonical}"}}]}}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;800&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
  <style>
    *{{box-sizing:border-box;margin:0;padding:0}}
    :root{{--p:#0057FF;--pk:#00C2FF;--dark:#0A0F1E;--sub:#5A6380;--bg:#F7F9FF;--r:14px}}
    body{{font-family:'Noto Sans KR',sans-serif;background:var(--bg);color:#1A1F35;line-height:1.6}}
    .nav{{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(10,15,30,.95);backdrop-filter:blur(12px);padding:0 20px;height:60px;display:flex;align-items:center;justify-content:space-between}}
    .nav-logo{{color:#fff;font-weight:800;font-size:17px;text-decoration:none}}.nav-logo span{{color:var(--pk)}}
    .nav-tel{{color:#fff;font-weight:700;font-size:14px;text-decoration:none;background:var(--p);padding:7px 14px;border-radius:8px}}
    .hero{{background:linear-gradient(135deg,#0A0F1E,#0d1f4a,#0057FF);padding:96px 20px 52px;text-align:center}}
    .bc{{display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:16px;font-size:12px;color:rgba(255,255,255,.45)}}
    .bc a{{color:rgba(255,255,255,.45);text-decoration:none}}
    h1{{font-size:clamp(24px,5vw,40px);font-weight:800;color:#fff;margin-bottom:10px;line-height:1.3}}
    h1 em{{color:var(--pk);font-style:normal}}
    .hero-sub{{font-size:15px;color:rgba(255,255,255,.65);margin-bottom:24px}}
    .cta{{display:inline-flex;align-items:center;gap:8px;background:#fff;color:var(--p);font-size:17px;font-weight:800;padding:14px 32px;border-radius:50px;text-decoration:none}}
    .wrap{{padding:48px 20px;max-width:720px;margin:0 auto}}
    .sec-title{{font-size:18px;font-weight:800;margin-bottom:18px;padding-bottom:10px;border-bottom:3px solid var(--p)}}
    .sec-title i{{color:var(--p);margin-right:7px}}
    .white-sec{{background:#fff;padding:48px 20px}}
    .region-info{{background:#F7F9FF;border-radius:var(--r);padding:20px 22px;border-left:4px solid var(--p)}}
    .region-desc{{font-size:14px;color:#1A1F35;line-height:1.8;margin-bottom:14px}}
    .region-list{{list-style:none;display:flex;flex-direction:column;gap:8px}}
    .region-list li{{font-size:13px;color:var(--sub);display:flex;align-items:flex-start;gap:8px;line-height:1.6}}
    .region-list li i{{color:var(--p);font-size:13px;margin-top:2px;flex-shrink:0}}
    .region-list strong{{color:#1A1F35}}
    .dong-wrap{{display:flex;flex-wrap:wrap;gap:8px}}
    .dong{{background:#E8F0FF;color:var(--p);padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600}}
    .steps{{display:flex;flex-direction:column;gap:12px}}
    .step{{display:flex;align-items:flex-start;gap:14px;background:#fff;border-radius:var(--r);padding:16px;box-shadow:0 3px 12px rgba(0,0,0,.05)}}
    .step-num{{width:32px;height:32px;border-radius:50%;background:var(--p);color:#fff;font-weight:800;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}}
    .step h4{{font-size:14px;font-weight:700;margin-bottom:3px}}
    .step p{{font-size:12px;color:var(--sub)}}
    .cta2{{background:linear-gradient(135deg,var(--dark),#0d1f4a);padding:52px 20px;text-align:center}}
    .cta2 h2{{font-size:clamp(20px,4vw,30px);font-weight:800;color:#fff;margin-bottom:8px}}
    .cta2 p{{color:rgba(255,255,255,.55);font-size:14px;margin-bottom:24px}}
    .cta2-btn{{display:inline-flex;align-items:center;gap:8px;background:var(--p);color:#fff;font-size:17px;font-weight:800;padding:15px 36px;border-radius:50px;text-decoration:none}}
    .back{{display:block;text-align:center;padding:20px;font-size:13px;color:var(--sub);text-decoration:none}}
  </style>
</head>
<body>
<nav class="nav">
  <a href="/" class="nav-logo">에어컨<span>해결사</span></a>
  <a href="tel:010-2343-2966" class="nav-tel"><i class="fas fa-phone"></i> 010-2343-2966</a>
</nav>
<section class="hero">
  <nav class="bc" aria-label="breadcrumb">
    <a href="/">홈</a><span>›</span><a href="/area">서비스 지역</a><span>›</span><span>{short} {svc_slug}</span>
  </nav>
  <h1><em>{short}</em> {h1_1}<br>{h1_2}</h1>
  <p class="hero-sub">{name} {hero_sub}</p>
  <a href="tel:010-2343-2966" class="cta"><i class="fas fa-phone"></i> 지금 바로 전화상담</a>
</section>
<div class="white-sec">
  <div style="max-width:720px;margin:0 auto">
    <h2 class="sec-title"><i class="fas fa-info-circle"></i>{name} 에어컨 서비스 특징</h2>
    <div class="region-info">
      <p class="region-desc">{feature}은 여름철 에어컨 수요가 높은 지역입니다. {apt}</p>
      <ul class="region-list">
        <li><i class="fas fa-subway"></i> <strong>교통</strong>: {traffic}으로 부품 조달이 빠릅니다</li>
        <li><i class="fas fa-map-marker-alt"></i> <strong>출장 범위</strong>: {dongs_str} 전 지역 당일 출장</li>
        <li><i class="fas fa-clock"></i> <strong>출장 시간</strong>: 오전 접수 시 당일 방문 원칙</li>
{extra_li}
      </ul>
    </div>
  </div>
</div>
<div class="wrap">
  <h2 class="sec-title"><i class="fas fa-list-ol"></i>출장 진행 순서</h2>
  <div class="steps">
    <div class="step"><div class="step-num">1</div><div><h4>전화 상담</h4><p>증상을 말씀해 주시면 예상 비용과 출장 시간을 안내드립니다.</p></div></div>
    <div class="step"><div class="step-num">2</div><div><h4>출장 방문</h4><p>{name} 전 지역 당일 출장. 전문 기사가 직접 방문합니다.</p></div></div>
    <div class="step"><div class="step-num">3</div><div><h4>현장 진단</h4><p>정확한 점검 후 비용 사전 안내. 동의 후 작업을 진행합니다.</p></div></div>
    <div class="step"><div class="step-num">4</div><div><h4>완료 및 테스트</h4><p>작업 완료 후 정상 작동 확인. 사후 A/S도 책임집니다.</p></div></div>
  </div>
</div>
<div class="white-sec">
  <div style="max-width:720px;margin:0 auto">
    <h2 class="sec-title"><i class="fas fa-map-marker-alt"></i>{short} 출장 가능 지역</h2>
    <div class="dong-wrap">{dong_tags}<span class="dong">{short} 전 지역</span></div>
  </div>
</div>
<section class="cta2">
  <h2>{short} {cta2_h}</h2>
  <p>전화 한 통으로 당일 출장 · 합리적인 가격 · 전문 기사 직접 방문</p>
  <a href="tel:010-2343-2966" class="cta2-btn"><i class="fas fa-phone"></i> 010-2343-2966</a>
</section>
<a href="/" class="back">← 에어컨해결사 메인으로 돌아가기</a>

  <!-- INTERNAL LINKS -->
  <section style="background:#F7F9FF;padding:32px 0;">
    <div style="max-width:860px;margin:0 auto;padding:0 20px;">
      <p style="font-size:13px;font-weight:700;color:#333;margin-bottom:12px;">관련 서비스 페이지</p>
      <div style="margin-bottom:8px;"><strong style="font-size:13px;color:#555;">{short} 다른 서비스</strong><br>{''.join(same_region_links)}</div>
      <div><strong style="font-size:13px;color:#555;">{svc_slug} 다른 지역</strong><br>{''.join(same_svc_links)}</div>
    </div>
  </section>
</body>
</html>"""
    return html


# 누락된 페이지 생성
generated = 0
for region in REGIONS:
    short = region['short']
    for svc_slug, svc in SERVICES.items():
        slug_combined = f"{short}-{svc_slug}"
        if slug_combined not in existing:
            encoded = urllib.parse.quote(slug_combined)
            fname = f"{encoded}.html"
            fpath = os.path.join(OUT_DIR, fname)
            html = make_page(region, svc_slug, svc)
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"✅ 생성: {slug_combined}")
            generated += 1

print(f"\n총 {generated}개 페이지 생성 완료")
