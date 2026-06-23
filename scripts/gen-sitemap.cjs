const fs = require('fs')
const path = require('path')

const BASE = 'https://www.airconhelper.co.kr'
const today = new Date().toISOString().split('T')[0]
const AREA_DIR = path.join(__dirname, '../public/area')

// 고정 URL
const staticUrls = [
  { loc: BASE,         priority: '1.0', changefreq: 'weekly'  },
  { loc: `${BASE}/area`, priority: '0.7', changefreq: 'monthly' },
]

// area 페이지 전체 읽기
const areaFiles = fs.readdirSync(AREA_DIR).filter(f => f.endsWith('.html'))
const areaUrls = areaFiles.map(f => {
  const slug = f.replace('.html', '')
  // 핵심 파워링크 지역+키워드는 priority 높게
  const isPL = /^(금천|구로|강동|하남|중랑|동대문|노원|강북)/.test(slug)
  return {
    loc: `${BASE}/area/${slug}`,
    priority: isPL ? '0.9' : '0.8',
    changefreq: 'monthly'
  }
})

const allUrls = [...staticUrls, ...areaUrls]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), xml, 'utf8')
console.log(`sitemap.xml 생성 완료: ${allUrls.length}개 URL`)
