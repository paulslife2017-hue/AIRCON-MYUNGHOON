#!/usr/bin/env python3
"""
기존 8종 slug 파일(에어컨소음/실외기고장 등) 패치 스크립트
- priceRange 제거
- geo.region/geo.placename/geo.position/ICBM 메타태그 추가
- 증상 카드 섹션 삽입 (기존 구조 활용)
- 네이버 플레이스 sameAs 링크 추가
- naver-site-verification 통일
"""

import os, re, urllib.parse, json

OUT_DIR = '/home/user/webapp/public/area'

# 31개 지역 좌표 맵
REGION_GEO = {
    '금천': ('KR-11', '서울특별시 금천구',   37.4570, 126.8956),
    '구로': ('KR-11', '서울특별시 구로구',   37.4955, 126.8875),
    '강동': ('KR-11', '서울특별시 강동구',   37.5301, 127.1238),
    '하남': ('KR-41', '경기도 하남시',       37.5392, 127.2148),
    '중랑': ('KR-11', '서울특별시 중랑구',   37.6063, 127.0927),
    '동대문': ('KR-11', '서울특별시 동대문구', 37.5744, 127.0396),
    '노원': ('KR-11', '서울특별시 노원구',   37.6542, 127.0568),
    '강북': ('KR-11', '서울특별시 강북구',   37.6396, 127.0255),
    '관악': ('KR-11', '서울특별시 관악구',   37.4784, 126.9516),
    '영등포': ('KR-11', '서울특별시 영등포구', 37.5264, 126.8962),
    '광명': ('KR-41', '경기도 광명시',       37.4786, 126.8644),
    '안양': ('KR-41', '경기도 안양시',       37.3943, 126.9568),
    '성북': ('KR-11', '서울특별시 성북구',   37.5894, 127.0167),
    '남양주': ('KR-41', '경기도 남양주시',   37.6360, 127.2165),
    '구리': ('KR-41', '경기도 구리시',       37.5943, 127.1296),
    '송파': ('KR-11', '서울특별시 송파구',   37.5145, 127.1059),
    '강남': ('KR-11', '서울특별시 강남구',   37.5172, 127.0473),
    '서초': ('KR-11', '서울특별시 서초구',   37.4836, 127.0327),
    '마포': ('KR-11', '서울특별시 마포구',   37.5638, 126.9084),
    '은평': ('KR-11', '서울특별시 은평구',   37.6026, 126.9291),
    '서대문': ('KR-11', '서울특별시 서대문구', 37.5791, 126.9368),
    '용산': ('KR-11', '서울특별시 용산구',   37.5324, 126.9901),
    '성동': ('KR-11', '서울특별시 성동구',   37.5634, 127.0369),
    '도봉': ('KR-11', '서울특별시 도봉구',   37.6688, 127.0471),
    '양천': ('KR-11', '서울특별시 양천구',   37.5170, 126.8665),
    '강서': ('KR-11', '서울특별시 강서구',   37.5509, 126.8496),
    '동작': ('KR-11', '서울특별시 동작구',   37.5124, 126.9393),
    '수원': ('KR-41', '경기도 수원시',       37.2636, 127.0286),
    '성남': ('KR-41', '경기도 성남시',       37.4196, 127.1267),
    '부천': ('KR-41', '경기도 부천시',       37.5034, 126.7660),
    '인천': ('KR-28', '인천광역시 부평구',   37.5074, 126.7220),
}

# 재생성 대상이 아닌 기존 slug
NEW_SERVICES = {'에어컨수리', '에어컨가스충전', '냉매충전', '에어컨점검', '에어컨청소'}

patched = 0
skipped = 0

for fname in os.listdir(OUT_DIR):
    if not fname.endswith('.html'):
        continue
    decoded = urllib.parse.unquote(fname.replace('.html', ''))
    if '-' not in decoded:
        continue
    short, svc = decoded.split('-', 1)
    if svc in NEW_SERVICES:
        continue  # 이미 재생성됨

    if short not in REGION_GEO:
        skipped += 1
        continue

    region_code, place_name, lat, lng = REGION_GEO[short]
    fpath = os.path.join(OUT_DIR, fname)

    with open(fpath, encoding='utf-8') as f:
        html = f.read()

    original = html

    # 1) priceRange 제거 (JSON-LD 내)
    html = re.sub(r',?\s*"priceRange"\s*:\s*"\$\$"', '', html)

    # 2) naver-site-verification 통일
    html = re.sub(
        r'<meta name="naver-site-verification" content="[^"]*"/>',
        '<meta name="naver-site-verification" content="7cf89f83fa8bddb6b6d5a8e2d4b0e1b5c9d3f7a4"/>',
        html
    )

    # 3) GEO 메타태그 삽입 (google-site-verification 바로 뒤에)
    geo_block = f'''  <!-- GEO 메타태그 (네이버/구글 위치 최적화) -->
  <meta name="geo.region" content="{region_code}"/>
  <meta name="geo.placename" content="{place_name}"/>
  <meta name="geo.position" content="{lat};{lng}"/>
  <meta name="ICBM" content="{lat}, {lng}"/>
  <meta name="classification" content="에어컨수리, 가전제품수리, 에어컨청소, 에어컨가스충전"/>
  <meta name="subject" content="{short} 에어컨 {svc} 당일출장 전문"/>'''

    if 'geo.region' not in html:
        html = re.sub(
            r'(<meta name="google-site-verification"[^/]*/>\s*)',
            r'\1' + geo_block + '\n  ',
            html
        )

    # 4) sameAs 네이버 플레이스 추가 (JSON-LD HomeAndConstructionBusiness)
    if '2053364866' not in html:
        html = re.sub(
            r'("paymentAccepted"\s*:\s*"[^"]*")',
            r'\1, "sameAs": ["https://map.naver.com/p/entry/place/2053364866"]',
            html
        )

    # 5) max-video-preview 추가 (robots 메타에)
    html = html.replace(
        'max-image-preview:large"',
        'max-image-preview:large, max-video-preview:-1"'
    )

    if html != original:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(html)
        patched += 1
    else:
        skipped += 1

print(f"✅ 패치 완료: {patched}개")
print(f"⏭️  스킵: {skipped}개")
