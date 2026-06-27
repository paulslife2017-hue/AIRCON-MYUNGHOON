#!/usr/bin/env python3
"""
SEO 내부 링크 구조 전면 구축 스크립트
1. 홈페이지 area-links 섹션 → 구/시별 동 단위 링크 허브 추가
2. 각 구/시 페이지 → 해당 동 목록 링크 자동 삽입
3. 각 동 페이지 → 홈/구 브레드크럼 링크 삽입
"""

import os
import re
import urllib.parse
from collections import defaultdict

AREA_DIR = '/home/user/webapp/public/area'
INDEX_PATH = '/home/user/webapp/public/index.html'

# ─── 파일명 파싱 ─────────────────────────────────────────────────────
files = os.listdir(AREA_DIR)

two_part = []   # 구/시 레벨
three_part = [] # 동 레벨

for f in files:
    name = f.replace('.html', '')
    dec = urllib.parse.unquote(name)
    parts = dec.split('-')
    if len(parts) == 2:
        two_part.append({'file': f, 'decoded': dec, 'region': parts[0], 'service': parts[1]})
    elif len(parts) == 3:
        three_part.append({'file': f, 'decoded': dec, 'region': parts[0], 'dong': parts[1], 'service': parts[2]})

print(f"구/시 페이지: {len(two_part)}개, 동 페이지: {len(three_part)}개")

# 구/시별 동 목록 (에어컨수리 기준으로 동 목록 추출)
dong_by_region = defaultdict(list)
for p in three_part:
    if p['service'] == '에어컨수리':
        dong_by_region[p['region']].append(p['dong'])

# 동별 서비스 목록
services_by_region_dong = defaultdict(list)
for p in three_part:
    key = (p['region'], p['dong'])
    services_by_region_dong[key].append(p['service'])

print(f"동 단위 지역: {sorted(dong_by_region.keys())}")

# ─── 서비스 색상 매핑 ───────────────────────────────────────────────
SVC_COLOR = {
    '에어컨수리':     {'bg': '#fff',    'border': '#E2E8F0', 'color': '#334155'},
    '에어컨청소':     {'bg': '#F0FDF4', 'border': '#BBF7D0', 'color': '#15803D'},
    '에어컨가스충전': {'bg': '#EFF6FF', 'border': '#BFDBFE', 'color': '#1D4ED8'},
    '에어컨점검':     {'bg': '#FAF5FF', 'border': '#DDD6FE', 'color': '#7C3AED'},
    '에어컨소음':     {'bg': '#FFF7ED', 'border': '#FED7AA', 'color': '#C2410C'},
    '에어컨안켜짐':   {'bg': '#FFF1F2', 'border': '#FECDD3', 'color': '#BE123C'},
}

def svc_style(svc):
    c = SVC_COLOR.get(svc, {'bg': '#F8FAFC', 'border': '#CBD5E1', 'color': '#475569'})
    return f"padding:8px 10px;background:{c['bg']};border:1px solid {c['border']};border-radius:6px;font-size:11px;color:{c['color']};text-decoration:none;text-align:center;display:block;"

# ─── 1. 홈페이지 area-links 섹션에 동 단위 링크 그룹 추가 ──────────

print("\n[1/3] 홈페이지 area-links에 동 단위 링크 허브 추가...")

with open(INDEX_PATH, 'r', encoding='utf-8') as f:
    index_html = f.read()

# 구/시별 동 링크 섹션 생성 (에어컨수리 + 에어컨청소 2개 서비스만, 공간 절약)
DONG_HUB_SECTIONS = []

# 순서: 검색량 많은 지역 우선
REGION_ORDER = [
    '남양주', '구리', '강동', '하남', '중랑', '동대문', '강북', '노원',
    '관악', '영등포', '광명', '안양', '성북', '구로', '금천'
]

for region in REGION_ORDER:
    dongs = sorted(dong_by_region.get(region, []))
    if not dongs:
        continue
    
    region_enc = urllib.parse.quote(region)
    
    # 구/시 페이지 링크들 (에어컨수리)
    region_link_enc = urllib.parse.quote(f"{region}-에어컨수리")
    
    dong_links_html = []
    for dong in dongs:
        slug = urllib.parse.quote(f"{region}-{dong}-에어컨수리")
        dong_links_html.append(
            f'<a href="/area/{slug}" style="{svc_style("에어컨수리")}">{dong} 에어컨수리</a>'
        )
        slug2 = urllib.parse.quote(f"{region}-{dong}-에어컨청소")
        dong_links_html.append(
            f'<a href="/area/{slug2}" style="{svc_style("에어컨청소")}">{dong} 에어컨청소</a>'
        )
    
    section = f'''
      <!-- {region} 동 단위 링크 -->
      <div style="margin-top:28px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <a href="/area/{urllib.parse.quote(region + '-에어컨수리')}" style="font-size:14px;font-weight:700;color:#1E40AF;text-decoration:none;">📍 {region} 에어컨수리</a>
          <span style="font-size:11px;color:#64748B;">동 단위 바로가기</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px;">
          {''.join(dong_links_html)}
        </div>
      </div>'''
    DONG_HUB_SECTIONS.append(section)

DONG_HUB_HTML = ''.join(DONG_HUB_SECTIONS)

# index.html의 area-links 섹션 끝 </div></div></section> 앞에 삽입
OLD_MARKER = '      </div>\n    </div>\n  </section>\n\n  <!-- FOOTER -->'
NEW_MARKER = f'''      </div>

      <!-- 동 단위 지역별 링크 허브 (SEO 내부링크) -->
      <div style="margin-top:40px;border-top:2px solid #E2E8F0;padding-top:36px;">
        <div style="font-size:13px;font-weight:700;color:#475569;margin-bottom:4px;"><i class="fas fa-th-list"></i> 동(洞) 단위 상세 지역</div>
        <p style="font-size:12px;color:#94A3B8;margin:0 0 8px;">에어컨 수리 출장 지역을 동 단위로 검색하실 수 있습니다</p>
        {DONG_HUB_HTML}
      </div>
    </div>
  </section>

  <!-- FOOTER -->'''

if OLD_MARKER in index_html:
    index_html = index_html.replace(OLD_MARKER, NEW_MARKER)
    with open(INDEX_PATH, 'w', encoding='utf-8') as f:
        f.write(index_html)
    print(f"  ✅ 홈페이지 동 단위 링크 허브 추가 완료 ({len(REGION_ORDER)}개 지역)")
else:
    print("  ⚠️ 마커를 찾을 수 없음, 수동 확인 필요")
    print(f"  찾는 패턴: {repr(OLD_MARKER[:50])}")

# ─── 2. 구/시 페이지 → 해당 동 목록 링크 삽입 ──────────────────────

print("\n[2/3] 구/시 페이지에 동 단위 링크 삽입...")

REGION_FULL_NAME = {
    '남양주': '남양주시', '구리': '구리시', '강동': '강동구', '하남': '하남시',
    '중랑': '중랑구', '동대문': '동대문구', '강북': '강북구', '노원': '노원구',
    '관악': '관악구', '영등포': '영등포구', '광명': '광명시', '안양': '안양시',
    '성북': '성북구', '구로': '구로구', '금천': '금천구',
    # 기존 구/시 (동 페이지 없는 것들도 포함)
    '강남': '강남구', '강서': '강서구', '도봉': '도봉구', '동작': '동작구',
    '마포': '마포구', '부천': '부천시', '서대문': '서대문구', '서초': '서초구',
    '성남': '성남시', '성동': '성동구', '송파': '송파구', '수원': '수원시',
    '양천': '양천구', '용산': '용산구', '은평': '은평구', '인천': '인천광역시',
}

SVC_DISPLAY = {
    '에어컨수리': '에어컨수리',
    '에어컨청소': '에어컨청소',
    '에어컨가스충전': '가스충전',
    '에어컨점검': '점검',
    '에어컨소음': '소음수리',
    '에어컨안켜짐': '안켜짐수리',
    '냉매충전': '냉매충전',
    '실외기고장': '실외기수리',
    '에어컨물': '물떨어짐',
    '에어컨시원하지않음': '냉방불량',
    '에어컨매립배관수리': '배관수리',
    '위니아에어컨수리': '위니아수리',
    '창문형에어컨수리': '창문형수리',
}

updated_count = 0
skip_count = 0

for p in two_part:
    region = p['region']
    service = p['service']
    filepath = os.path.join(AREA_DIR, p['file'])
    
    dongs = sorted(dong_by_region.get(region, []))
    if not dongs:
        skip_count += 1
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 이미 삽입된 경우 스킵
    if 'dong-links-section' in content:
        skip_count += 1
        continue
    
    full_name = REGION_FULL_NAME.get(region, f"{region}")
    
    # 동 링크 생성
    dong_rows = []
    for dong in dongs:
        # 해당 동의 서비스들
        dong_svcs = services_by_region_dong.get((region, dong), ['에어컨수리'])
        svc_links = []
        for svc in ['에어컨수리', '에어컨청소', '에어컨가스충전', '에어컨점검']:
            if svc in dong_svcs:
                slug = urllib.parse.quote(f"{region}-{dong}-{svc}")
                disp = SVC_DISPLAY.get(svc, svc)
                c = SVC_COLOR.get(svc, {'bg': '#F8FAFC', 'border': '#CBD5E1', 'color': '#475569'})
                svc_links.append(
                    f'<a href="/area/{slug}" style="display:inline-block;margin:2px;padding:4px 8px;background:{c["bg"]};border:1px solid {c["border"]};border-radius:4px;font-size:11px;color:{c["color"]};text-decoration:none;">{disp}</a>'
                )
        
        dong_rows.append(f'''
          <div style="padding:10px 12px;background:#fff;border:1px solid #E2E8F0;border-radius:8px;">
            <div style="font-size:13px;font-weight:600;color:#1E293B;margin-bottom:4px;">📍 {dong}</div>
            <div>{''.join(svc_links)}</div>
          </div>''')
    
    dong_section = f'''
  <!-- dong-links-section -->
  <section style="background:#F8FAFC;padding:40px 0;border-top:1px solid #E2E8F0;">
    <div style="max-width:960px;margin:0 auto;padding:0 16px;">
      <h2 style="font-size:18px;font-weight:700;color:#1E293B;margin-bottom:6px;">
        <i class="fas fa-map-marker-alt" style="color:#2563EB;"></i> {full_name} 동 단위 에어컨 서비스
      </h2>
      <p style="font-size:13px;color:#64748B;margin-bottom:20px;">{full_name} 각 동별 에어컨 수리·청소·가스충전·점검 전문 출장 서비스</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;">
        {''.join(dong_rows)}
      </div>
      <div style="margin-top:16px;text-align:center;">
        <a href="/" style="display:inline-block;padding:10px 24px;background:#2563EB;color:#fff;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">
          ← 전체 지역 보기
        </a>
      </div>
    </div>
  </section>'''
    
    # </body> 직전에 삽입
    if '</body>' in content:
        content = content.replace('</body>', dong_section + '\n</body>')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        updated_count += 1
    
print(f"  ✅ 구/시 페이지 업데이트: {updated_count}개, 스킵: {skip_count}개")

# ─── 3. 동 페이지 → 홈/구 브레드크럼 링크 삽입 ─────────────────────

print("\n[3/3] 동 페이지에 브레드크럼 + 홈/구 내부링크 삽입...")

updated_dong = 0
skip_dong = 0

for p in three_part:
    region = p['region']
    dong = p['dong']
    service = p['service']
    filepath = os.path.join(AREA_DIR, p['file'])
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 이미 삽입된 경우 스킵
    if 'breadcrumb-nav-dong' in content:
        skip_dong += 1
        continue
    
    full_name = REGION_FULL_NAME.get(region, region)
    region_slug = urllib.parse.quote(f"{region}-에어컨수리")
    
    # 같은 동의 다른 서비스 링크들
    dong_svcs = services_by_region_dong.get((region, dong), [])
    related_links = []
    for svc in ['에어컨수리', '에어컨청소', '에어컨가스충전', '에어컨점검', '에어컨소음', '에어컨안켜짐']:
        if svc in dong_svcs and svc != service:
            slug = urllib.parse.quote(f"{region}-{dong}-{svc}")
            disp = SVC_DISPLAY.get(svc, svc)
            c = SVC_COLOR.get(svc, {'bg': '#F8FAFC', 'border': '#CBD5E1', 'color': '#475569'})
            related_links.append(
                f'<a href="/area/{slug}" style="display:inline-block;padding:6px 12px;background:{c["bg"]};border:1px solid {c["border"]};border-radius:6px;font-size:12px;color:{c["color"]};text-decoration:none;">{dong} {disp}</a>'
            )
    
    # 같은 구/시의 다른 동 링크 (최대 5개)
    other_dongs = [d for d in sorted(dong_by_region.get(region, []))[:6] if d != dong][:5]
    other_dong_links = []
    for od in other_dongs:
        slug = urllib.parse.quote(f"{region}-{od}-에어컨수리")
        other_dong_links.append(
            f'<a href="/area/{slug}" style="display:inline-block;padding:5px 10px;background:#fff;border:1px solid #E2E8F0;border-radius:5px;font-size:11px;color:#334155;text-decoration:none;">📍 {od}</a>'
        )
    
    breadcrumb_section = f'''
  <!-- breadcrumb-nav-dong -->
  <nav style="background:#F1F5F9;border-bottom:1px solid #E2E8F0;padding:10px 0;" aria-label="breadcrumb">
    <div style="max-width:960px;margin:0 auto;padding:0 16px;font-size:12px;color:#64748B;">
      <a href="/" style="color:#2563EB;text-decoration:none;">홈</a>
      <span style="margin:0 6px;">›</span>
      <a href="/area/{region_slug}" style="color:#2563EB;text-decoration:none;">{full_name} 에어컨수리</a>
      <span style="margin:0 6px;">›</span>
      <span style="color:#1E293B;font-weight:600;">{dong} {service}</span>
    </div>
  </nav>'''
    
    related_section = f'''
  <!-- internal-links-dong -->
  <section style="background:#F8FAFC;padding:28px 0;border-top:1px solid #E2E8F0;">
    <div style="max-width:960px;margin:0 auto;padding:0 16px;">
      <div style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:700;color:#475569;margin-bottom:8px;">🔧 {dong} 다른 에어컨 서비스</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          {''.join(related_links) if related_links else f'<span style="font-size:12px;color:#94A3B8;">서비스 링크 준비 중</span>'}
        </div>
      </div>
      {f"""<div style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:700;color:#475569;margin-bottom:8px;">📍 {full_name} 주변 지역 에어컨수리</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          {''.join(other_dong_links)}
        </div>
      </div>""" if other_dong_links else ''}
      <div style="display:flex;gap:10px;margin-top:16px;">
        <a href="/" style="display:inline-block;padding:8px 20px;background:#2563EB;color:#fff;border-radius:7px;font-size:12px;font-weight:600;text-decoration:none;">← 홈으로</a>
        <a href="/area/{region_slug}" style="display:inline-block;padding:8px 20px;background:#fff;border:1px solid #2563EB;color:#2563EB;border-radius:7px;font-size:12px;font-weight:600;text-decoration:none;">{full_name} 에어컨수리 전체보기</a>
      </div>
    </div>
  </section>'''
    
    # <body> 태그 직후에 브레드크럼 삽입
    if '<body' in content:
        # body 태그 찾아서 직후 삽입
        body_match = re.search(r'<body[^>]*>', content)
        if body_match:
            insert_pos = body_match.end()
            content = content[:insert_pos] + breadcrumb_section + content[insert_pos:]
    
    # </body> 직전에 관련 링크 삽입
    if '</body>' in content:
        content = content.replace('</body>', related_section + '\n</body>')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        updated_dong += 1
    
print(f"  ✅ 동 페이지 업데이트: {updated_dong}개, 스킵: {skip_dong}개")

print(f"\n{'='*60}")
print(f"SEO 내부 링크 구조 구축 완료!")
print(f"  - 홈페이지: 동 단위 링크 허브 추가")
print(f"  - 구/시 페이지: {updated_count}개 업데이트")
print(f"  - 동 페이지: {updated_dong}개 업데이트")
print(f"{'='*60}")
