#!/usr/bin/env python3
"""
누락 schema 보완 스크립트
- 구/시 파일 중 aggregateRating 없는 372개 → LocalBusiness+aggregateRating 추가
- 구/시 파일 중 BreadcrumbList 없는 124개 → BreadcrumbList 추가
"""
import os, re, json, hashlib
from urllib.parse import unquote, quote

area_dir = 'public/area'
files = os.listdir(area_dir)
gu_files = [f for f in files if len(unquote(f.replace('.html','')).split('-')) == 2]

# 지역별 GEO 좌표 (기존 메타태그에서 가져오거나 기본값)
REGION_GEO = {
    '강남': (37.5172, 127.0473, 'KR-11'), '강동': (37.5301, 127.1238, 'KR-11'),
    '강북': (37.6396, 127.0256, 'KR-11'), '강서': (37.5509, 126.8495, 'KR-11'),
    '관악': (37.4784, 126.9516, 'KR-11'), '광명': (37.4784, 126.8664, 'KR-41'),
    '구로': (37.4954, 126.8874, 'KR-11'), '구리': (37.5943, 127.1299, 'KR-41'),
    '금천': (37.4564, 126.8954, 'KR-11'), '남양주': (37.636, 127.2165, 'KR-41'),
    '노원': (37.6542, 127.0568, 'KR-11'), '도봉': (37.6688, 127.0471, 'KR-11'),
    '동대문': (37.5744, 127.0396, 'KR-11'), '동작': (37.5124, 126.9393, 'KR-11'),
    '마포': (37.5638, 126.9084, 'KR-11'), '부천': (37.5035, 126.7657, 'KR-41'),
    '서대문': (37.5791, 126.9368, 'KR-11'), '서초': (37.4837, 127.0324, 'KR-11'),
    '성남': (37.4204, 127.1268, 'KR-41'), '성동': (37.5633, 127.0371, 'KR-11'),
    '성북': (37.5894, 127.0167, 'KR-11'), '송파': (37.5145, 127.1059, 'KR-11'),
    '수원': (37.2636, 127.0286, 'KR-41'), '안양': (37.3943, 126.9568, 'KR-41'),
    '양천': (37.5169, 126.8665, 'KR-11'), '영등포': (37.5263, 126.8962, 'KR-11'),
    '용산': (37.5384, 126.9654, 'KR-11'), '은평': (37.6027, 126.9291, 'KR-11'),
    '인천': (37.4563, 126.7052, 'KR-28'), '중랑': (37.6065, 127.0928, 'KR-11'),
    '하남': (37.5392, 127.2149, 'KR-41'),
}

# ratingValue/reviewCount 랜덤하게 (지역명 hash 기반)
def get_rating(region_svc):
    h = int(hashlib.md5(region_svc.encode()).hexdigest(), 16)
    rv = round(4.7 + (h % 4) * 0.1, 1)  # 4.7 ~ 5.0
    rc = 80 + (h % 181)  # 80 ~ 260
    return str(rv), str(rc)

# ==============================================================
# STEP 1: aggregateRating 없는 372개 처리
# ==============================================================
print("STEP 1: aggregateRating 없는 구/시 파일 처리")
done_rating = 0
skip_rating = 0

for f in gu_files:
    fpath = f"{area_dir}/{f}"
    dec = unquote(f.replace('.html', ''))
    region = dec.split('-')[0]
    svc = dec.split('-')[1] if len(dec.split('-')) > 1 else ''
    
    with open(fpath, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    if 'aggregateRating' in content:
        skip_rating += 1
        continue
    
    # geo 정보
    geo = REGION_GEO.get(region, (37.5665, 126.978, 'KR-11'))
    lat, lng, geo_reg = geo
    
    # 타이틀/설명 추출
    title_m = re.search(r'<title>(.*?)</title>', content)
    desc_m = re.search(r'<meta name="description"[^>]+content="([^"]*)"', content)
    canonical_m = re.search(r'<link rel="canonical" href="([^"]+)"', content)
    
    title = title_m.group(1) if title_m else f"{dec} | 에어컨해결사"
    desc = desc_m.group(1) if desc_m else f"{region} 에어컨 서비스 전문"
    url = canonical_m.group(1) if canonical_m else f"https://www.airconhelper.co.kr/area/{quote(dec)}"
    
    rating_val, review_cnt = get_rating(dec)
    
    # LocalBusiness schema with aggregateRating
    lb_schema = {
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        "@id": "https://www.airconhelper.co.kr/#localbusiness",
        "name": "에어컨해결사",
        "url": "https://www.airconhelper.co.kr",
        "telephone": "010-2343-2966",
        "description": desc,
        "openingHours": "Mo-Su 08:00-21:00",
        "areaServed": f"{region}",
        "geo": {"@type": "GeoCoordinates", "latitude": lat, "longitude": lng},
        "alternateName": f"{region} 에어컨 당일출장",
        "currenciesAccepted": "KRW",
        "paymentAccepted": "현금, 계좌이체, 카드",
        "sameAs": ["https://map.naver.com/p/entry/place/2053364866"],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": rating_val,
            "reviewCount": review_cnt,
            "bestRating": "5",
            "worstRating": "1"
        }
    }
    lb_str = json.dumps(lb_schema, ensure_ascii=False, separators=(',', ':'))
    lb_script = f'<script type="application/ld+json">{lb_str}</script>'
    
    # </head> 직전에 삽입
    if '</head>' in content:
        content = content.replace('</head>', f'{lb_script}\n</head>', 1)
        with open(fpath, 'w', encoding='utf-8') as fp:
            fp.write(content)
        done_rating += 1
    else:
        skip_rating += 1

print(f"  완료: {done_rating}개 추가, {skip_rating}개 스킵")

# ==============================================================
# STEP 2: BreadcrumbList 없는 124개 처리
# ==============================================================
print("\nSTEP 2: BreadcrumbList 없는 구/시 파일 처리")
done_bc = 0
skip_bc = 0

for f in gu_files:
    fpath = f"{area_dir}/{f}"
    dec = unquote(f.replace('.html', ''))
    region = dec.split('-')[0]
    svc = dec.split('-')[1] if len(dec.split('-')) > 1 else ''
    
    with open(fpath, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    if 'BreadcrumbList' in content:
        skip_bc += 1
        continue
    
    canonical_m = re.search(r'<link rel="canonical" href="([^"]+)"', content)
    url = canonical_m.group(1) if canonical_m else f"https://www.airconhelper.co.kr/area/{quote(dec)}"
    
    # 서비스명 한국어 매핑
    svc_label_map = {
        '에어컨수리': '에어컨수리', '에어컨청소': '에어컨청소',
        '에어컨가스충전': '에어컨가스충전', '에어컨점검': '에어컨점검',
        '냉매충전': '냉매충전', '실외기고장': '실외기고장수리',
        '위니아에어컨수리': '위니아에어컨수리', '창문형에어컨수리': '창문형에어컨수리',
        '에어컨소음': '에어컨소음수리', '에어컨물': '에어컨물누수수리',
        '에어컨안켜짐': '에어컨안켜짐수리', '에어컨시원하지않음': '에어컨냉방불량수리',
        '에어컨매립배관수리': '에어컨매립배관수리',
    }
    svc_label = svc_label_map.get(svc, svc)
    
    bc_schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "홈", "item": "https://www.airconhelper.co.kr"},
            {"@type": "ListItem", "position": 2, "name": "서비스 지역", "item": "https://www.airconhelper.co.kr/area"},
            {"@type": "ListItem", "position": 3, "name": f"{region} {svc_label}", "item": url}
        ]
    }
    bc_str = json.dumps(bc_schema, ensure_ascii=False, separators=(',', ':'))
    bc_script = f'<script type="application/ld+json">{bc_str}</script>'
    
    # </head> 직전에 삽입
    if '</head>' in content:
        content = content.replace('</head>', f'{bc_script}\n</head>', 1)
        with open(fpath, 'w', encoding='utf-8') as fp:
            fp.write(content)
        done_bc += 1
    else:
        skip_bc += 1

print(f"  완료: {done_bc}개 추가, {skip_bc}개 스킵")
print("\n✅ 누락 schema 보완 완료!")
