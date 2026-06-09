/**
 * generate-sitemap.mjs
 * public/sitemap.xml 을 자동 생성합니다.
 * - 홈 + /area 목록 페이지 (2개)
 * - 65개 지역 페이지
 * = 총 67개 URL
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_PATH = path.resolve(__dirname, '../public/sitemap.xml')
const BASE_URL = 'https://www.airconhelper.co.kr'
const TODAY = new Date().toISOString().split('T')[0]

// ─────────────────────────────────────────
// 지역 슬러그 목록 (areas.ts 와 동일)
// ─────────────────────────────────────────
const REPAIR_REGIONS = [
  { shortName: '금천' },
  { shortName: '관악' },
  { shortName: '구로' },
  { shortName: '영등포' },
  { shortName: '광명' },
  { shortName: '안양' },
  { shortName: '남양주' },
  { shortName: '구리' },
  { shortName: '강동' },
  { shortName: '하남' },
  { shortName: '중랑' },
  { shortName: '동대문' },
  { shortName: '노원' },
  { shortName: '강북' },
  { shortName: '성북' },
]

const REPAIR_KEYWORDS = ['에어컨수리', '에어컨가스충전', '에어컨점검', '냉매충전']

const CLEAN_REGIONS = [
  { shortName: '영등포' },
  { shortName: '동작' },
  { shortName: '구로' },
  { shortName: '금천' },
  { shortName: '관악' },
]

// 슬러그 배열 생성
const repairSlugs = REPAIR_REGIONS.flatMap(r =>
  REPAIR_KEYWORDS.map(k => `${r.shortName}-${k}`)
)
const cleanSlugs = CLEAN_REGIONS.map(r => `${r.shortName}-에어컨청소`)
const areaSlugs = [...repairSlugs, ...cleanSlugs]

// ─────────────────────────────────────────
// XML 생성
// ─────────────────────────────────────────
const staticUrls = [
  { loc: `${BASE_URL}/`,      priority: '1.0', changefreq: 'weekly' },
  { loc: `${BASE_URL}/area`,  priority: '0.8', changefreq: 'weekly' },
]

const areaUrls = areaSlugs.map(slug => ({
  loc: `${BASE_URL}/area/${slug}`,
  priority: '0.9',
  changefreq: 'monthly',
}))

const allUrls = [...staticUrls, ...areaUrls]

const xmlParts = allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`)

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlParts.join('\n')}
</urlset>`

fs.writeFileSync(OUT_PATH, xml, 'utf8')
console.log(`✅ sitemap.xml 생성 완료: ${allUrls.length}개 URL`)
console.log(`📁 경로: ${OUT_PATH}`)
