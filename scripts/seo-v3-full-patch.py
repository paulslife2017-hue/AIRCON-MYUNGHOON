#!/usr/bin/env python3
"""
SEO 종합 최적화 v3 스크립트
==============================================
작업 내용:
1. 동 672개:
   - og:locale (ko_KR) 추가
   - og:image 추가
   - twitter:card + twitter:title + twitter:description 추가
   - hreflang (ko / ko-KR / x-default) 추가

2. 구/시 403개:
   - og:image 추가
   - hreflang (ko / ko-KR / x-default) 추가

3. 구/시 에어컨수리 31개:
   - 지역명 포함 특화 FAQ로 교체 (완전 차별화)
   - 각 지역의 실제 동 이름 활용

4. 홈페이지:
   - og:locale 추가 (누락 확인 후)
==============================================
"""

import os, re
from urllib.parse import unquote, quote

area_dir = 'public/area'
files = os.listdir(area_dir)
dong_files = sorted([f for f in files if len(unquote(f.replace('.html','')).split('-')) >= 3])
gu_files = sorted([f for f in files if len(unquote(f.replace('.html','')).split('-')) == 2])

OG_IMAGE_URL = 'https://www.airconhelper.co.kr/og-image.jpg'
BASE_URL = 'https://www.airconhelper.co.kr'

# ==============================================================
# STEP 1: 동 672개 → og:locale + og:image + twitter:card + hreflang 추가
# ==============================================================
print("=" * 60)
print("STEP 1: 동 672개 SEO 메타 보완")
print("=" * 60)

dong_done = 0
dong_skipped = 0

for f in dong_files:
    fpath = f"{area_dir}/{f}"
    dec = unquote(f.replace('.html', ''))
    
    with open(fpath, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    modified = False
    
    # canonical URL 추출 (hreflang에 사용)
    canonical_m = re.search(r'<link rel="canonical" href="([^"]+)"', content)
    canonical_url = canonical_m.group(1) if canonical_m else f"{BASE_URL}/area/{quote(dec)}"
    
    # og:title 추출
    og_title_m = re.search(r'property="og:title" content="([^"]+)"', content)
    og_title = og_title_m.group(1) if og_title_m else dec
    
    # og:description 추출
    og_desc_m = re.search(r'property="og:description" content="([^"]+)"', content)
    og_desc = og_desc_m.group(1) if og_desc_m else ''
    
    # 1-1. og:locale 추가 (없을 때만)
    if 'og:locale' not in content:
        # og:type 다음에 삽입
        content = re.sub(
            r'(<meta property="og:type" content="website" />)',
            r'\1\n  <meta property="og:locale" content="ko_KR" />',
            content
        )
        modified = True
    
    # 1-2. og:image 추가 (없을 때만)
    if 'og:image' not in content:
        # og:url 다음에 삽입
        content = re.sub(
            r'(<meta property="og:url" content="[^"]+" />)',
            r'\1\n  <meta property="og:image" content="' + OG_IMAGE_URL + r'" />\n  <meta property="og:image:width" content="1200" />\n  <meta property="og:image:height" content="630" />\n  <meta property="og:image:alt" content="에어컨해결사 당일출장 에어컨수리 서비스" />',
            content
        )
        modified = True
    
    # 1-3. twitter:card 추가 (없을 때만)
    if 'twitter:card' not in content:
        twitter_block = f'''  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{og_title}" />
  <meta name="twitter:description" content="{og_desc[:150] if og_desc else og_title}" />
  <meta name="twitter:image" content="{OG_IMAGE_URL}" />'''
        # </head> 직전에 삽입
        content = content.replace('</head>', f'{twitter_block}\n</head>', 1)
        modified = True
    
    # 1-4. hreflang 추가 (없을 때만)
    if 'hreflang' not in content:
        hreflang_block = f'''  <link rel="alternate" hreflang="ko" href="{canonical_url}" />
  <link rel="alternate" hreflang="ko-KR" href="{canonical_url}" />
  <link rel="alternate" hreflang="x-default" href="{canonical_url}" />'''
        # canonical 다음에 삽입
        content = re.sub(
            r'(<link rel="canonical" href="[^"]+" />)',
            r'\1\n' + hreflang_block,
            content
        )
        modified = True
    
    if modified:
        with open(fpath, 'w', encoding='utf-8') as fp:
            fp.write(content)
        dong_done += 1
    else:
        dong_skipped += 1

print(f"  완료: {dong_done}개 수정, {dong_skipped}개 스킵")

# ==============================================================
# STEP 2: 구/시 403개 → og:image + hreflang 추가
# ==============================================================
print("\n" + "=" * 60)
print("STEP 2: 구/시 403개 SEO 메타 보완")
print("=" * 60)

gu_done = 0
gu_skipped = 0

for f in gu_files:
    fpath = f"{area_dir}/{f}"
    dec = unquote(f.replace('.html', ''))
    
    with open(fpath, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    modified = False
    
    canonical_m = re.search(r'<link rel="canonical" href="([^"]+)"', content)
    canonical_url = canonical_m.group(1) if canonical_m else f"{BASE_URL}/area/{quote(dec)}"
    
    og_title_m = re.search(r'property="og:title" content="([^"]+)"', content)
    og_title = og_title_m.group(1) if og_title_m else dec
    
    og_desc_m = re.search(r'property="og:description" content="([^"]+)"', content)
    og_desc = og_desc_m.group(1) if og_desc_m else ''
    
    # 2-1. og:image 추가 (없을 때만)
    if 'og:image' not in content:
        # og:url 다음에 삽입
        og_url_m = re.search(r'<meta property="og:url" content="[^"]+"/?>', content)
        if og_url_m:
            og_url_tag = og_url_m.group(0)
            og_image_block = f'''{og_url_tag}
  <meta property="og:image" content="{OG_IMAGE_URL}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:image:alt" content="에어컨해결사 당일출장 에어컨수리 서비스"/>'''
            content = content.replace(og_url_tag, og_image_block, 1)
            modified = True
    
    # 2-2. twitter:title + twitter:description + twitter:image 추가 (없을 때만)
    if 'twitter:title' not in content and 'twitter:card' in content:
        # twitter:card 다음에 추가
        tw_card_m = re.search(r'<meta name="twitter:card"[^/]*/>', content)
        if tw_card_m:
            tw_card_tag = tw_card_m.group(0)
            tw_extra = f'''{tw_card_tag}
  <meta name="twitter:title" content="{og_title}"/>
  <meta name="twitter:description" content="{og_desc[:150] if og_desc else og_title}"/>
  <meta name="twitter:image" content="{OG_IMAGE_URL}"/>'''
            content = content.replace(tw_card_tag, tw_extra, 1)
            modified = True
    
    # 2-3. hreflang 추가 (없을 때만)
    if 'hreflang' not in content:
        hreflang_block = f'''  <link rel="alternate" hreflang="ko" href="{canonical_url}"/>
  <link rel="alternate" hreflang="ko-KR" href="{canonical_url}"/>
  <link rel="alternate" hreflang="x-default" href="{canonical_url}"/>'''
        canonical_m2 = re.search(r'<link rel="canonical"[^>]+>', content)
        if canonical_m2:
            can_tag = canonical_m2.group(0)
            content = content.replace(can_tag, can_tag + '\n' + hreflang_block, 1)
            modified = True
    
    if modified:
        with open(fpath, 'w', encoding='utf-8') as fp:
            fp.write(content)
        gu_done += 1
    else:
        gu_skipped += 1

print(f"  완료: {gu_done}개 수정, {gu_skipped}개 스킵")

# ==============================================================
# STEP 3: 구/시 에어컨수리 31개 → 지역별 특화 FAQ로 교체
# ==============================================================
print("\n" + "=" * 60)
print("STEP 3: 구/시 에어컨수리 31개 지역별 특화 FAQ 교체")
print("=" * 60)

# 지역별 특화 정보 (동 이름 + 지역 특성)
REGION_DONG_MAP = {
    '강남': {'dongs': ['역삼동', '개포동', '삼성동', '압구정동'], 'type': '아파트'},
    '강동': {'dongs': ['천호동', '명일동', '길동', '암사동'], 'type': '아파트'},
    '강북': {'dongs': ['미아동', '번동', '수유동', '도봉동'], 'type': '빌라'},
    '강서': {'dongs': ['화곡동', '마곡동', '염창동', '등촌동'], 'type': '신축'},
    '관악': {'dongs': ['봉천동', '신림동', '남현동', '중앙동'], 'type': '원룸'},
    '광명': {'dongs': ['하안동', '소하동', '광명동', '철산동'], 'type': '아파트'},
    '구로': {'dongs': ['구로동', '가리봉동', '신도림동', '고척동'], 'type': '빌라'},
    '구리': {'dongs': ['인창동', '교문동', '수택동', '갈매동'], 'type': '아파트'},
    '금천': {'dongs': ['가산동', '독산동', '시흥동'], 'type': '빌라'},
    '남양주': {'dongs': ['별내동', '다산동', '금곡동', '호평동'], 'type': '신축'},
    '노원': {'dongs': ['중계동', '상계동', '공릉동', '월계동'], 'type': '아파트'},
    '도봉': {'dongs': ['쌍문동', '방학동', '창동', '도봉동'], 'type': '아파트'},
    '동대문': {'dongs': ['장안동', '이문동', '휘경동', '답십리동'], 'type': '빌라'},
    '동작': {'dongs': ['노량진동', '사당동', '상도동', '대방동'], 'type': '빌라'},
    '마포': {'dongs': ['합정동', '홍대입구', '망원동', '상암동'], 'type': '오피스텔'},
    '부천': {'dongs': ['중동', '상동', '소사동', '심곡동'], 'type': '아파트'},
    '서대문': {'dongs': ['홍제동', '북가좌동', '남가좌동', '연희동'], 'type': '빌라'},
    '서초': {'dongs': ['방배동', '양재동', '잠원동', '반포동'], 'type': '아파트'},
    '성남': {'dongs': ['분당동', '야탑동', '정자동', '수진동'], 'type': '아파트'},
    '성동': {'dongs': ['성수동', '왕십리동', '금호동', '옥수동'], 'type': '오피스텔'},
    '성북': {'dongs': ['돈암동', '길음동', '정릉동', '월곡동'], 'type': '빌라'},
    '송파': {'dongs': ['잠실동', '거여동', '마천동', '방이동'], 'type': '아파트'},
    '수원': {'dongs': ['권선동', '영통동', '팔달동', '장안동'], 'type': '아파트'},
    '안양': {'dongs': ['비산동', '평촌동', '석수동', '관양동'], 'type': '아파트'},
    '양천': {'dongs': ['목동', '신정동', '신월동'], 'type': '아파트'},
    '영등포': {'dongs': ['여의도동', '영등포동', '당산동', '문래동'], 'type': '오피스텔'},
    '용산': {'dongs': ['이태원동', '한남동', '후암동', '원효로동'], 'type': '빌라'},
    '은평': {'dongs': ['응암동', '불광동', '녹번동', '수색동'], 'type': '빌라'},
    '인천': {'dongs': ['부평동', '구월동', '연수동', '서구'], 'type': '아파트'},
    '중랑': {'dongs': ['묵동', '중화동', '면목동', '신내동'], 'type': '빌라'},
    '하남': {'dongs': ['미사동', '덕풍동', '신장동', '위례동'], 'type': '신축'},
}

def make_region_faq(region, info):
    dongs = info['dongs']
    btype = info['type']
    dong1 = dongs[0]
    dong2 = dongs[1] if len(dongs) > 1 else dongs[0]
    dong3 = dongs[2] if len(dongs) > 2 else dongs[0]
    
    return [
        {
            "q": f"{region} 에어컨 수리 당일 출장이 가능한가요?",
            "a": f"네, {region} 전 지역 당일 출장 가능합니다. {dong1}·{dong2}·{dong3} 등 {region} 어디든 오전 접수 시 당일 방문이 원칙입니다. 긴급 출장은 ☎010-2343-2966으로 연락해 주세요."
        },
        {
            "q": f"{region} {btype} 에어컨 수리 특이사항이 있나요?",
            "a": f"{region} 지역은 {btype} 비율이 높아 {btype} 환경에 최적화된 작업을 진행합니다. 배관 상태, 환기 조건 등 {btype} 특성에 맞춘 점검을 해드립니다."
        },
        {
            "q": f"{region} 에어컨 수리 비용이 얼마나 되나요?",
            "a": f"기본 출장비 없이 증상 진단 후 투명하게 안내해 드립니다. 냉매 보충 4~8만원, 부품 교체는 종류에 따라 다르며, {region} 지역 고객님께 합리적인 가격으로 제공합니다."
        },
        {
            "q": "에어컨 청소와 수리를 같이 받을 수 있나요?",
            "a": "물론입니다. 수리 후 내부 먼지·곰팡이 청소까지 함께 진행 가능합니다. 청소 병행 시 별도 출장비 없이 할인 혜택을 제공해 드립니다."
        },
        {
            "q": "삼성·LG 외 국산/외산 브랜드도 수리 가능한가요?",
            "a": "위니아(대우), 캐리어, 하이얼, 미쯔비시 등 거의 모든 브랜드 수리 가능합니다. 단종 부품은 대체 부품으로 처리하며, 불가 시 현장에서 솔직하게 안내해 드립니다."
        }
    ]

# 구/시 에어컨수리 파일 처리
svc_repair_files = [f for f in gu_files if unquote(f.replace('.html','')).split('-')[1] == '에어컨수리']
faq_done = 0
faq_skipped = 0

for f in svc_repair_files:
    fpath = f"{area_dir}/{f}"
    dec = unquote(f.replace('.html',''))
    region = dec.split('-')[0]
    
    if region not in REGION_DONG_MAP:
        faq_skipped += 1
        continue
    
    info = REGION_DONG_MAP[region]
    faq_list = make_region_faq(region, info)
    
    with open(fpath, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # 새 FAQPage JSON-LD 생성
    import json
    new_faq_schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": item["q"],
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item["a"]
                }
            } for item in faq_list
        ]
    }
    new_faq_str = json.dumps(new_faq_schema, ensure_ascii=False, separators=(',', ':'))
    new_faq_script = f'<script type="application/ld+json">{new_faq_str}</script>'
    
    # 기존 FAQPage JSON-LD 교체
    faq_pattern = re.compile(
        r'<script type="application/ld\+json">\s*\{[^<]*"FAQPage"[^<]*\}</script>',
        re.DOTALL
    )
    
    if faq_pattern.search(content):
        content = faq_pattern.sub(new_faq_script, content, count=1)
        with open(fpath, 'w', encoding='utf-8') as fp:
            fp.write(content)
        faq_done += 1
    else:
        faq_skipped += 1

print(f"  완료: {faq_done}개 FAQ 교체, {faq_skipped}개 스킵")

print("\n" + "=" * 60)
print("모든 작업 완료!")
print("=" * 60)
