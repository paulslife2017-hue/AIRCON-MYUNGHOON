export type AreaService = 'repair' | 'clean'
export type AreaKeyword = 'repair' | 'gas' | 'check' | 'clean'

export interface AreaData {
  slug: string
  name: string
  shortName: string
  service: AreaService
  keyword: AreaKeyword
  dongs: string[]
  lat: number
  lng: number
}

// 수리 지역 15개
const REPAIR_REGIONS = [
  { name: '금천구',   shortName: '금천',   dongs: ['가산동','독산동','시흥동'],                      lat: 37.4564, lng: 126.8954 },
  { name: '관악구',   shortName: '관악',   dongs: ['신림동','봉천동','남현동'],                      lat: 37.4784, lng: 126.9516 },
  { name: '구로구',   shortName: '구로',   dongs: ['구로동','개봉동','오류동','항동'],               lat: 37.4954, lng: 126.8874 },
  { name: '영등포구', shortName: '영등포', dongs: ['영등포동','여의도동','당산동','양평동'],         lat: 37.5264, lng: 126.8963 },
  { name: '광명시',   shortName: '광명',   dongs: ['광명동','철산동','하안동','소하동'],             lat: 37.4786, lng: 126.8664 },
  { name: '안양시',   shortName: '안양',   dongs: ['안양동','비산동','관양동','평촌동','호계동'],   lat: 37.3943, lng: 126.9568 },
  { name: '남양주시', shortName: '남양주', dongs: ['화도읍','별내동','다산동','퇴계원읍'],           lat: 37.6360, lng: 127.2165 },
  { name: '구리시',   shortName: '구리',   dongs: ['인창동','교문동','수택동','토평동'],             lat: 37.5943, lng: 127.1296 },
  { name: '강동구',   shortName: '강동',   dongs: ['천호동','암사동','길동','명일동'],               lat: 37.5301, lng: 127.1238 },
  { name: '하남시',   shortName: '하남',   dongs: ['덕풍동','신장동','미사동','감이동'],             lat: 37.5397, lng: 127.2148 },
  { name: '중랑구',   shortName: '중랑',   dongs: ['묵동','신내동','망우동','면목동'],               lat: 37.6063, lng: 127.0925 },
  { name: '동대문구', shortName: '동대문', dongs: ['전농동','답십리동','장안동','회기동'],           lat: 37.5744, lng: 127.0397 },
  { name: '노원구',   shortName: '노원',   dongs: ['상계동','중계동','월계동','공릉동'],             lat: 37.6543, lng: 127.0568 },
  { name: '강북구',   shortName: '강북',   dongs: ['미아동','번동','수유동','우이동'],               lat: 37.6396, lng: 127.0257 },
  { name: '성북구',   shortName: '성북',   dongs: ['성북동','정릉동','길음동','돈암동'],             lat: 37.5894, lng: 127.0167 },
]

// 청소 지역 5개
const CLEAN_REGIONS = [
  { name: '영등포구', shortName: '영등포', dongs: ['영등포동','여의도동','당산동','양평동'], lat: 37.5264, lng: 126.8963 },
  { name: '동작구',   shortName: '동작',   dongs: ['사당동','노량진동','상도동','흑석동'],  lat: 37.5124, lng: 126.9394 },
  { name: '구로구',   shortName: '구로',   dongs: ['구로동','개봉동','오류동','항동'],      lat: 37.4954, lng: 126.8874 },
  { name: '금천구',   shortName: '금천',   dongs: ['가산동','독산동','시흥동'],             lat: 37.4564, lng: 126.8954 },
  { name: '관악구',   shortName: '관악',   dongs: ['신림동','봉천동','남현동'],             lat: 37.4784, lng: 126.9516 },
]

// 키워드 4종 정의
const REPAIR_KEYWORDS: { keyword: AreaKeyword; slugSuffix: string }[] = [
  { keyword: 'repair', slugSuffix: '에어컨수리'  },
  { keyword: 'gas',    slugSuffix: '에어컨가스충전' },
  { keyword: 'check',  slugSuffix: '에어컨점검'  },
  { keyword: 'clean',  slugSuffix: '냉매충전'    },
]

// 수리 지역 × 4키워드 = 60개
const repairAreas: AreaData[] = REPAIR_REGIONS.flatMap(r =>
  REPAIR_KEYWORDS.map(k => ({
    slug: `${r.shortName}-${k.slugSuffix}`,
    name: r.name,
    shortName: r.shortName,
    service: 'repair' as AreaService,
    keyword: k.keyword,
    dongs: r.dongs,
    lat: r.lat,
    lng: r.lng,
  }))
)

// 청소 지역 5개
const cleanAreas: AreaData[] = CLEAN_REGIONS.map(r => ({
  slug: `${r.shortName}-에어컨청소`,
  name: r.name,
  shortName: r.shortName,
  service: 'clean' as AreaService,
  keyword: 'clean' as AreaKeyword,
  dongs: r.dongs,
  lat: r.lat,
  lng: r.lng,
}))

export const AREAS: AreaData[] = [...repairAreas, ...cleanAreas]

export function getAreaBySlug(slug: string): AreaData | undefined {
  return AREAS.find(a => a.slug === slug)
}
