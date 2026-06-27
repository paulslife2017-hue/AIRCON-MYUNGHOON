#!/usr/bin/env python3
"""
sitemap.xml 재생성 스크립트
- 기존 area 페이지 (403개) + 신규 동 단위 페이지 (672개) = 총 1,075개
"""

import os
import urllib.parse
from datetime import date

BASE_URL = "https://www.airconhelper.co.kr"
AREA_DIR = "/home/user/webapp/public/area"
SITEMAP_PATH = "/home/user/webapp/public/sitemap.xml"
TODAY = date.today().strftime("%Y-%m-%d")

# ── 1. 고정 URL (홈 + 서비스) ─────────────────────────────────
static_urls = [
    {"loc": BASE_URL, "priority": "1.0", "changefreq": "daily"},
    {"loc": f"{BASE_URL}/services/repair", "priority": "0.9", "changefreq": "weekly"},
    {"loc": f"{BASE_URL}/services/cleaning", "priority": "0.9", "changefreq": "weekly"},
    {"loc": f"{BASE_URL}/services/gas", "priority": "0.9", "changefreq": "weekly"},
]

# ── 2. area 페이지 전체 수집 ─────────────────────────────────
area_files = sorted(os.listdir(AREA_DIR))
area_urls = []

for fname in area_files:
    if not fname.endswith(".html"):
        continue
    slug = fname[:-5]  # .html 제거
    loc = f"{BASE_URL}/area/{slug}"
    # 동 단위 페이지 (퍼센트인코딩 길이 기준으로 구분)
    # 기존 구/시 레벨 → priority 0.85, 동 레벨 → priority 0.80
    decoded = urllib.parse.unquote(slug)
    parts = decoded.split("-")
    # 동 단위: "남양주-별내동-에어컨수리" → 3 parts
    # 구 레벨:  "남양주-에어컨수리" → 2 parts
    priority = "0.80" if len(parts) >= 3 else "0.85"
    area_urls.append({"loc": loc, "priority": priority, "changefreq": "weekly"})

# ── 3. XML 생성 ─────────────────────────────────────────────
lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

for u in static_urls:
    lines.append(f'  <url>')
    lines.append(f'    <loc>{u["loc"]}</loc>')
    lines.append(f'    <lastmod>{TODAY}</lastmod>')
    lines.append(f'    <changefreq>{u["changefreq"]}</changefreq>')
    lines.append(f'    <priority>{u["priority"]}</priority>')
    lines.append(f'  </url>')

for u in area_urls:
    lines.append(f'  <url>')
    lines.append(f'    <loc>{u["loc"]}</loc>')
    lines.append(f'    <lastmod>{TODAY}</lastmod>')
    lines.append(f'    <changefreq>{u["changefreq"]}</changefreq>')
    lines.append(f'    <priority>{u["priority"]}</priority>')
    lines.append(f'  </url>')

lines.append('</urlset>')

with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")

total = len(static_urls) + len(area_urls)
print(f"✅ sitemap.xml 업데이트 완료!")
print(f"  - 고정 URL: {len(static_urls)}개")
print(f"  - area 페이지: {len(area_urls)}개")
print(f"  - 총 URL: {total}개")
