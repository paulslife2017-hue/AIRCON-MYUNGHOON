#!/usr/bin/env python3
"""
area 페이지 전체 재생성 스크립트 v2
개선 사항:
  1. 지역별 정확한 GEO 메타태그 (geo.region, geo.placename, geo.position, ICBM)
  2. FAQPage JSON-LD 서비스별 5개 FAQ
  3. 증상별 콘텐츠 섹션 (서비스별 차별화)
  4. priceRange / 가격 정보 완전 제거
  5. 네이버 플레이스 ID 연동 (place ID: 2053364866)
  6. 구글 리치스니펫 대응 강화
"""

import os
import urllib.parse
import json

OUT_DIR = '/home/user/webapp/public/area'

# 31개 지역 — GPS 좌표 추가 (위도, 경도)
REGIONS = [
    {'short':'금천', 'name':'금천구', 'region_code':'KR-11', 'place':'서울특별시 금천구',
     'lat':37.4570, 'lng':126.8956,
     'dongs':['가산동','독산동','시흥동'],
     'feature':'가산디지털단지와 독산·시흥동 주택가가 밀집한 금천구',
     'traffic':'지하철 1·7호선',
     'apt':'구축 아파트와 빌라 밀집 지역으로 에어컨 노후화 비율이 높습니다'},
    {'short':'구로', 'name':'구로구', 'region_code':'KR-11', 'place':'서울특별시 구로구',
     'lat':37.4955, 'lng':126.8875,
     'dongs':['구로동','개봉동','오류동','항동'],
     'feature':'구로디지털단지와 개봉·오류동 주거지가 혼재한 구로구',
     'traffic':'지하철 1·2·7호선',
     'apt':'다세대·빌라·오피스텔 등 다양한 주거 형태가 많습니다'},
    {'short':'강동', 'name':'강동구', 'region_code':'KR-11', 'place':'서울특별시 강동구',
     'lat':37.5301, 'lng':127.1238,
     'dongs':['천호동','암사동','길동','명일동'],
     'feature':'천호·암사동 상업지구와 명일·길동 주거단지가 공존하는 강동구',
     'traffic':'지하철 5·8·9호선',
     'apt':'30~40년 이상 구축 아파트 단지가 많아 에어컨 노후화 점검이 필요합니다'},
    {'short':'하남', 'name':'하남시', 'region_code':'KR-41', 'place':'경기도 하남시',
     'lat':37.5392, 'lng':127.2148,
     'dongs':['덕풍동','신장동','미사동','감이동'],
     'feature':'미사강변도시 신축 아파트와 덕풍·신장동 기성 주거지가 함께하는 하남시',
     'traffic':'지하철 5호선 연장선',
     'apt':'미사지구 신축 아파트부터 구도심 주택까지 다양한 에어컨 수리 수요가 있습니다'},
    {'short':'중랑', 'name':'중랑구', 'region_code':'KR-11', 'place':'서울특별시 중랑구',
     'lat':37.6063, 'lng':127.0927,
     'dongs':['묵동','신내동','망우동','면목동'],
     'feature':'신내동 신도시와 면목·망우동 주거 밀집 지역인 중랑구',
     'traffic':'지하철 7호선·경의중앙선',
     'apt':'중저가 빌라와 아파트가 많으며 여름철 에어컨 수리 접수가 집중됩니다'},
    {'short':'동대문', 'name':'동대문구', 'region_code':'KR-11', 'place':'서울특별시 동대문구',
     'lat':37.5744, 'lng':127.0396,
     'dongs':['전농동','답십리동','장안동','회기동'],
     'feature':'전농·답십리 재개발 지역과 장안동 상권이 활성화된 동대문구',
     'traffic':'지하철 1·2·5호선',
     'apt':'재개발·재건축 단지와 기존 주거지가 혼재해 신·구 에어컨 모두 수리합니다'},
    {'short':'노원', 'name':'노원구', 'region_code':'KR-11', 'place':'서울특별시 노원구',
     'lat':37.6542, 'lng':127.0568,
     'dongs':['상계동','중계동','월계동','공릉동'],
     'feature':'상계·중계동 대형 아파트 단지가 밀집한 서울 북부 최대 주거지 노원구',
     'traffic':'지하철 4·6·7호선',
     'apt':'1980~90년대 대단지 아파트가 많아 에어컨 교체·수리 수요가 꾸준합니다'},
    {'short':'강북', 'name':'강북구', 'region_code':'KR-11', 'place':'서울특별시 강북구',
     'lat':37.6396, 'lng':127.0255,
     'dongs':['미아동','번동','수유동','우이동'],
     'feature':'미아·수유동 주거 밀집 지역과 우이동 자연환경이 조화로운 강북구',
     'traffic':'지하철 4호선·우이신설선',
     'apt':'단독주택과 빌라 비율이 높아 에어컨 가스충전·수리 수요가 많습니다'},
    {'short':'관악', 'name':'관악구', 'region_code':'KR-11', 'place':'서울특별시 관악구',
     'lat':37.4784, 'lng':126.9516,
     'dongs':['신림동','봉천동','남현동'],
     'feature':'서울대 인근 신림·봉천동 주거·상업 복합 지역인 관악구',
     'traffic':'지하철 2호선·신림선',
     'apt':'원룸·빌라·고시원 등 다양한 주거 형태가 많아 소형 에어컨 수리도 전문입니다'},
    {'short':'영등포', 'name':'영등포구', 'region_code':'KR-11', 'place':'서울특별시 영등포구',
     'lat':37.5264, 'lng':126.8962,
     'dongs':['영등포동','여의도동','당산동','양평동'],
     'feature':'여의도 금융중심지와 영등포 상권, 당산동 주거지가 공존하는 영등포구',
     'traffic':'지하철 2·5·9호선',
     'apt':'고층 아파트와 상업용 건물이 많아 천장형·시스템 에어컨 수리도 가능합니다'},
    {'short':'광명', 'name':'광명시', 'region_code':'KR-41', 'place':'경기도 광명시',
     'lat':37.4786, 'lng':126.8644,
     'dongs':['광명동','철산동','하안동','소하동'],
     'feature':'KTX 광명역과 철산·하안동 아파트 단지가 발달한 경기 광명시',
     'traffic':'지하철 7호선·KTX',
     'apt':'1990~2000년대 중형 아파트 단지가 많아 에어컨 노후화 수리 수요가 높습니다'},
    {'short':'안양', 'name':'안양시', 'region_code':'KR-41', 'place':'경기도 안양시',
     'lat':37.3943, 'lng':126.9568,
     'dongs':['안양동','비산동','관양동','평촌동','호계동'],
     'feature':'평촌신도시와 안양 구도심이 함께하는 경기 안양시',
     'traffic':'지하철 1·4호선',
     'apt':'평촌 신도시 중형 아파트와 안양 구도심 빌라 등 다양한 주거지에 출장합니다'},
    {'short':'성북', 'name':'성북구', 'region_code':'KR-11', 'place':'서울특별시 성북구',
     'lat':37.5894, 'lng':127.0167,
     'dongs':['성북동','정릉동','길음동','돈암동'],
     'feature':'길음뉴타운과 정릉·성북동 주거지가 있는 성북구',
     'traffic':'지하철 4·6호선',
     'apt':'뉴타운 신축과 구축 단독주택이 혼재해 다양한 에어컨 기종 수리 경험이 풍부합니다'},
    {'short':'남양주', 'name':'남양주시', 'region_code':'KR-41', 'place':'경기도 남양주시',
     'lat':37.6360, 'lng':127.2165,
     'dongs':['화도읍','별내동','다산동','퇴계원읍'],
     'feature':'별내·다산 신도시와 화도·퇴계원 기성 주거지가 있는 남양주시',
     'traffic':'경의중앙선·경춘선',
     'apt':'다산신도시 신축 아파트와 기존 주거지 에어컨 수리 모두 당일 출장합니다'},
    {'short':'구리', 'name':'구리시', 'region_code':'KR-41', 'place':'경기도 구리시',
     'lat':37.5943, 'lng':127.1296,
     'dongs':['인창동','교문동','수택동','토평동'],
     'feature':'서울과 맞닿은 소도시로 인창·수택동 아파트 단지가 밀집한 구리시',
     'traffic':'지하철 8호선 별내선',
     'apt':'소규모 아파트와 주택이 많으며 빠른 출장으로 당일 수리를 원칙으로 합니다'},
    {'short':'송파', 'name':'송파구', 'region_code':'KR-11', 'place':'서울특별시 송파구',
     'lat':37.5145, 'lng':127.1059,
     'dongs':['잠실동','가락동','문정동','거여동'],
     'feature':'잠실 롯데월드와 문정법조단지, 가락시장이 있는 송파구',
     'traffic':'지하철 2·5·8·9호선',
     'apt':'잠실 재건축 대단지와 문정동 신축 아파트 등 고급 주거 단지에 전문 출장합니다'},
    {'short':'강남', 'name':'강남구', 'region_code':'KR-11', 'place':'서울특별시 강남구',
     'lat':37.5172, 'lng':127.0473,
     'dongs':['역삼동','삼성동','대치동','개포동'],
     'feature':'코엑스·대치학원가·역삼 오피스 밀집 지역인 강남구',
     'traffic':'지하철 2·3·9호선',
     'apt':'고급 아파트와 오피스 빌딩이 많아 시스템·천장형 에어컨 수리도 전문입니다'},
    {'short':'서초', 'name':'서초구', 'region_code':'KR-11', 'place':'서울특별시 서초구',
     'lat':37.4836, 'lng':127.0327,
     'dongs':['서초동','방배동','반포동','양재동'],
     'feature':'법원·검찰청과 반포 래미안, 방배동 주택가가 있는 서초구',
     'traffic':'지하철 2·3·4·9호선',
     'apt':'반포·잠원 고급 아파트 단지와 방배 단독주택가 에어컨 수리를 전문으로 합니다'},
    {'short':'마포', 'name':'마포구', 'region_code':'KR-11', 'place':'서울특별시 마포구',
     'lat':37.5638, 'lng':126.9084,
     'dongs':['합정동','망원동','상암동','공덕동'],
     'feature':'상암 DMC·홍대·합정 젊은이 거리가 공존하는 마포구',
     'traffic':'지하철 2·5·6호선',
     'apt':'상암 신축 아파트와 합정·망원 빌라·주택 등 다양한 주거 형태 에어컨 수리합니다'},
    {'short':'은평', 'name':'은평구', 'region_code':'KR-11', 'place':'서울특별시 은평구',
     'lat':37.6026, 'lng':126.9291,
     'dongs':['불광동','응암동','녹번동','진관동'],
     'feature':'은평뉴타운과 불광·응암동 주거 밀집 지역인 은평구',
     'traffic':'지하철 3·6호선·경의선',
     'apt':'은평뉴타운 신축 아파트와 구도심 빌라 에어컨 모두 당일 출장 수리합니다'},
    {'short':'서대문', 'name':'서대문구', 'region_code':'KR-11', 'place':'서울특별시 서대문구',
     'lat':37.5791, 'lng':126.9368,
     'dongs':['홍제동','홍은동','남가좌동','북가좌동'],
     'feature':'연세·이화여대 인근과 홍제·홍은동 주거지가 있는 서대문구',
     'traffic':'지하철 2·3·5호선',
     'apt':'다세대 주택과 빌라 비율이 높으며 대학가 원룸 에어컨 수리도 전문입니다'},
    {'short':'용산', 'name':'용산구', 'region_code':'KR-11', 'place':'서울특별시 용산구',
     'lat':37.5324, 'lng':126.9901,
     'dongs':['이태원동','한남동','청파동','효창동'],
     'feature':'이태원·한남동 고급 주거지와 청파·효창동 주택가인 용산구',
     'traffic':'지하철 1·4·6호선·경의중앙선',
     'apt':'한남동 고급 빌라와 이태원 주거지 에어컨은 신속하고 깔끔한 수리를 원칙으로 합니다'},
    {'short':'성동', 'name':'성동구', 'region_code':'KR-11', 'place':'서울특별시 성동구',
     'lat':37.5634, 'lng':127.0369,
     'dongs':['왕십리동','행당동','사근동','금호동'],
     'feature':'성수동 카페거리와 왕십리역 주변 재개발 지역인 성동구',
     'traffic':'지하철 2·5호선·경의중앙선',
     'apt':'성수·왕십리 재개발 신축 단지와 행당·금호동 기존 아파트 에어컨 수리합니다'},
    {'short':'도봉', 'name':'도봉구', 'region_code':'KR-11', 'place':'서울특별시 도봉구',
     'lat':37.6688, 'lng':127.0471,
     'dongs':['도봉동','방학동','쌍문동','창동'],
     'feature':'창동역세권 개발과 방학·쌍문동 주거 밀집 지역인 도봉구',
     'traffic':'지하철 1·4호선',
     'apt':'중저가 아파트와 빌라가 많아 합리적인 에어컨 수리 서비스를 제공합니다'},
    {'short':'양천', 'name':'양천구', 'region_code':'KR-11', 'place':'서울특별시 양천구',
     'lat':37.5170, 'lng':126.8665,
     'dongs':['신정동','목동','신월동'],
     'feature':'목동 학원가와 신정·신월동 아파트 단지가 있는 양천구',
     'traffic':'지하철 2·5·9호선',
     'apt':'목동 신시가지 중형 아파트 단지가 많으며 에어컨 유지보수 수요가 높은 지역입니다'},
    {'short':'강서', 'name':'강서구', 'region_code':'KR-11', 'place':'서울특별시 강서구',
     'lat':37.5509, 'lng':126.8496,
     'dongs':['화곡동','방화동','마곡동','염창동'],
     'feature':'마곡지구 기업도시와 화곡동 주거 밀집 지역인 강서구',
     'traffic':'지하철 5·9호선·공항철도',
     'apt':'마곡 신축 오피스텔·아파트와 화곡 빌라·주택 에어컨 수리 모두 당일 출장합니다'},
    {'short':'동작', 'name':'동작구', 'region_code':'KR-11', 'place':'서울특별시 동작구',
     'lat':37.5124, 'lng':126.9393,
     'dongs':['사당동','노량진동','상도동','흑석동'],
     'feature':'노량진 학원가와 사당·흑석동 주거지가 있는 동작구',
     'traffic':'지하철 2·4·7·9호선',
     'apt':'흑석뉴타운 신축 아파트와 노량진·상도동 빌라 에어컨 수리 전문으로 출장합니다'},
    {'short':'수원', 'name':'수원시', 'region_code':'KR-41', 'place':'경기도 수원시',
     'lat':37.2636, 'lng':127.0286,
     'dongs':['영통동','권선동','팔달동','장안동'],
     'feature':'삼성전자 본사와 광교신도시, 수원 구도심이 있는 경기 수원시',
     'traffic':'지하철 1호선·수인분당선',
     'apt':'광교 신도시 신축 아파트와 수원 구도심 아파트·빌라 에어컨 모두 출장 수리합니다'},
    {'short':'성남', 'name':'성남시', 'region_code':'KR-41', 'place':'경기도 성남시',
     'lat':37.4196, 'lng':127.1267,
     'dongs':['분당동','판교동','수정동','중원동'],
     'feature':'판교 IT벨리와 분당 신도시, 성남 구도심이 공존하는 성남시',
     'traffic':'지하철 8호선·수인분당선',
     'apt':'분당 신도시 아파트와 판교 오피스텔, 성남 구도심 주거지 에어컨 수리 경험이 풍부합니다'},
    {'short':'부천', 'name':'부천시', 'region_code':'KR-41', 'place':'경기도 부천시',
     'lat':37.5034, 'lng':126.7660,
     'dongs':['중동','상동','원미동','소사동'],
     'feature':'부천 중동신도시와 소사·원미동 기성 주거지가 있는 경기 부천시',
     'traffic':'지하철 1·7호선',
     'apt':'중동신도시 중형 아파트와 소사·원미동 빌라 에어컨 수리를 당일 출장으로 해결합니다'},
    {'short':'인천', 'name':'인천시', 'region_code':'KR-28', 'place':'인천광역시 부평구',
     'lat':37.5074, 'lng':126.7220,
     'dongs':['부평동','계산동','작전동','갈산동'],
     'feature':'부평 상권과 계산·작전동 주거 밀집 지역인 인천 부평구',
     'traffic':'지하철 1·7호선·인천1호선',
     'apt':'부평 재개발 신축 단지와 기성 아파트·빌라 에어컨 수리를 당일 빠르게 출장합니다'},
]

# 서비스별 FAQ (5개씩, 가격 내용 없음)
SERVICE_FAQ = {
    '에어컨수리': [
        ('강남 에어컨 수리 당일 출장이 가능한가요?',
         '네, 오전 접수 시 당일 방문을 원칙으로 합니다. 강남구 전 지역(역삼동·삼성동·대치동·개포동 포함) 당일 출장이 가능합니다. 전화 주시면 출장 가능 시간을 바로 안내드립니다.'),
        ('에어컨 수리 시 어떤 브랜드도 가능한가요?',
         '삼성·LG·캐리어·위니아·코웨이·다이킨 등 모든 브랜드를 수리합니다. 벽걸이·스탠드형·시스템에어컨·창문형 등 기종에 관계없이 출장 가능합니다.'),
        ('수리 후 A/S는 어떻게 되나요?',
         '작업 완료 후 정상 작동을 현장에서 확인하며, 수리 부위에 대한 사후 A/S를 책임집니다. 이상 발생 시 재출장으로 해결해 드립니다.'),
        ('에어컨 수리 전 비용을 미리 알 수 있나요?',
         '전화 상담 시 증상을 말씀해 주시면 예상 비용 범위를 안내드립니다. 현장 도착 후 정확한 점검을 통해 비용을 먼저 안내하고, 고객 동의 후 작업을 시작합니다.'),
        ('에어컨에서 물이 떨어지는 증상도 수리 가능한가요?',
         '네, 배수 불량·드레인 막힘·냉매 부족 등 다양한 원인으로 물이 떨어질 수 있습니다. 현장에서 정확한 원인을 진단하고 당일 해결해 드립니다.'),
    ],
    '에어컨가스충전': [
        ('가스충전이 필요한 증상은 무엇인가요?',
         '에어컨을 켰을 때 찬바람이 안 나오거나 냉방 효율이 눈에 띄게 떨어진 경우, 실내기에 성에(결빙)가 생기는 경우 냉매 부족을 의심할 수 있습니다. 전화 주시면 증상 확인 후 안내드립니다.'),
        ('가스충전 당일 출장이 가능한가요?',
         '네, 오전 접수 시 당일 방문을 원칙으로 합니다. R-32·R-410A·R-22 등 모든 냉매 규격에 대응하며 현장에서 즉시 충전 작업이 가능합니다.'),
        ('냉매 누설 점검도 같이 해주나요?',
         '충전 전 냉매 누설 여부를 무료로 점검합니다. 누설이 있을 경우 원인 부위를 찾아 수리 후 충전하므로 반복 충전 없이 근본적으로 해결됩니다.'),
        ('모든 브랜드 에어컨에 가스충전이 가능한가요?',
         '삼성·LG·캐리어·위니아·코웨이·다이킨 등 국내외 모든 브랜드에 가스충전 서비스를 제공합니다. 벽걸이·스탠드형·시스템에어컨 모두 가능합니다.'),
        ('가스충전 후 효과가 바로 나타나나요?',
         '충전 완료 후 현장에서 냉방 상태를 직접 확인합니다. 냉매 부족이 원인이었다면 충전 즉시 찬바람이 회복됩니다. 다른 원인이 복합된 경우 추가 점검을 안내드립니다.'),
    ],
    '냉매충전': [
        ('냉매충전과 가스충전은 같은 서비스인가요?',
         '네, 에어컨 냉매(가스)를 보충하는 동일한 서비스입니다. 냉매는 에어컨이 찬바람을 만드는 핵심 물질로, 부족하면 냉방 효율이 크게 저하됩니다.'),
        ('어떤 종류의 냉매를 충전하나요?',
         'R-32, R-410A, R-22(구형) 등 모든 규격의 냉매를 취급합니다. 에어컨 모델에 맞는 적합한 냉매를 사용하므로 안심하셔도 됩니다.'),
        ('냉매충전 후 냉방이 안 되면 어떻게 하나요?',
         '냉매 충전 후에도 냉방이 개선되지 않는 경우 다른 원인(압축기 이상·전기 계통 이상 등)일 수 있습니다. 현장에서 추가 진단 후 정확한 원인과 해결 방법을 안내드립니다.'),
        ('냉매 누설이 있으면 계속 충전해야 하나요?',
         '아닙니다. 누설 원인을 먼저 수리한 뒤 충전해야 합니다. 출장 시 누설 점검을 먼저 시행하고, 누설 부위를 수리한 후 냉매를 충전하므로 반복 충전이 필요하지 않습니다.'),
        ('냉매충전 당일 출장이 가능한가요?',
         '오전 접수 시 당일 방문이 원칙입니다. 전화 상담 후 출장 시간을 조율해 드리며, 긴급한 경우 빠른 출장을 최대한 지원합니다.'),
    ],
    '에어컨점검': [
        ('에어컨 점검은 언제 받는 게 좋나요?',
         '여름 성수기(6~8월) 전인 5~6월 초에 미리 받으시면 좋습니다. 점검을 통해 냉매 부족·실외기 이상·전기 계통 문제를 사전에 발견해 고장을 예방할 수 있습니다.'),
        ('에어컨 점검에서 어떤 항목을 확인하나요?',
         '냉매(가스) 양 확인, 실외기 작동 상태, 전기 계통 안전 점검, 필터 상태, 배수 상태, 냉방 온도 측정 등 에어컨 전 부위를 종합 점검합니다.'),
        ('점검 후 이상이 발견되면 바로 수리도 가능한가요?',
         '네, 점검 중 이상이 발견되면 현장에서 바로 수리·가스충전·청소 등을 진행할 수 있습니다. 다만 부품 교체가 필요한 경우 부품 조달 후 재방문할 수 있습니다.'),
        ('점검 후 이상이 없으면 어떻게 되나요?',
         '이상이 없음을 현장에서 확인하고 정상 작동 상태를 알려드립니다. 다음 점검 권장 시기와 관리 요령도 안내해 드립니다.'),
        ('에어컨 점검 당일 출장이 가능한가요?',
         '오전 접수 시 당일 방문을 원칙으로 합니다. 성수기에는 예약이 빠를 수 있으므로 미리 연락 주시면 원하는 날짜에 방문 일정을 잡아 드립니다.'),
    ],
    '에어컨청소': [
        ('에어컨 청소는 얼마나 자주 해야 하나요?',
         '일반 가정용은 1~2년에 1회, 사용 빈도가 높은 경우 매년 여름 전 1회 권장합니다. 오래된 에어컨일수록 필터·열교환기에 먼지·곰팡이가 쌓여 냉방 효율이 떨어집니다.'),
        ('분해 청소와 일반 청소의 차이는 무엇인가요?',
         '일반 청소는 필터만 세척하는 방식이고, 분해 청소는 실내기 커버를 열고 열교환기·팬·배수판까지 고압 세척하는 방식입니다. 곰팡이 냄새 제거에는 분해 세척이 효과적입니다.'),
        ('에어컨 청소 후 냄새가 없어지나요?',
         '분해 세척 후 항균 코팅 처리까지 하면 곰팡이·세균으로 인한 냄새가 대부분 제거됩니다. 작업 완료 후 현장에서 작동 확인 및 냄새 상태를 확인해 드립니다.'),
        ('시스템에어컨(천장형) 청소도 가능한가요?',
         '네, 벽걸이·스탠드·시스템(천장형·4방향) 등 모든 기종 분해 청소가 가능합니다. 천장형 에어컨의 경우 사다리 작업이 필요하며, 전문 기사가 안전하게 진행합니다.'),
        ('에어컨 청소 당일 출장이 가능한가요?',
         '오전 접수 시 당일 방문을 원칙으로 합니다. 성수기(7~8월)에는 예약이 몰릴 수 있어 미리 연락 주시면 빠른 일정 배정이 가능합니다.'),
    ],
}

# 서비스 정의 (priceRange 제거)
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
        'symptom_title': '이런 증상이면 에어컨 수리가 필요합니다',
        'symptoms': [
            ('fa-snowflake','찬바람이 안 나와요','에어컨을 켰는데 뜨겁거나 미지근한 바람만 나오는 경우 냉매 부족 또는 압축기 이상일 수 있습니다.'),
            ('fa-volume-up','소음이 심해요','실내기·실외기에서 금속 소리, 덜컹거림, 진동음 등 이상 소음이 발생하면 부품 결함 신호입니다.'),
            ('fa-tint','물이 떨어져요','에어컨 아래나 벽면에 물이 흘러내리면 배수 불량 또는 냉매 부족일 수 있습니다.'),
            ('fa-power-off','전원이 안 켜져요','리모컨을 눌러도 반응이 없거나 켜지다가 꺼지는 경우 전기 계통 점검이 필요합니다.'),
        ],
        'extra_list': [
            {'icon':'fa-tools','title':'수리 범위','desc':'벽걸이·스탠드·시스템·창문형 전 기종'},
            {'icon':'fa-check-circle','title':'작업 방식','desc':'현장 점검 후 원인 설명, 동의 후 작업 진행'},
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
        'symptom_title': '이런 증상이면 가스충전이 필요합니다',
        'symptoms': [
            ('fa-thermometer-empty','찬바람이 안 나와요','에어컨을 켰는데 시원하지 않거나 미지근한 바람이 나오는 경우 냉매 부족일 가능성이 높습니다.'),
            ('fa-snowflake','실내기에 성에가 생겨요','냉매가 부족하면 실내기 열교환기에 성에(결빙)가 생기고 냉방 효율이 크게 떨어집니다.'),
            ('fa-chart-line','전기요금이 갑자기 늘었어요','냉매 부족 시 에어컨이 목표 온도에 도달하지 못해 계속 가동되며 전력 소비가 증가합니다.'),
            ('fa-search','냄새 없이 냉방만 안 돼요','냄새나 소음 없이 냉방 효율만 저하된 경우 냉매 누설로 인한 부족이 가장 흔한 원인입니다.'),
        ],
        'extra_list': [
            {'icon':'fa-tint','title':'냉매 종류','desc':'R-32·R-410A·R-22 전 냉매 취급'},
            {'icon':'fa-search','title':'누설 점검','desc':'충전 전 냉매 누설 여부 무료 점검 시행'},
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
        'symptom_title': '냉매충전이 필요한 증상입니다',
        'symptoms': [
            ('fa-thermometer-empty','냉방이 약해졌어요','작년보다 냉방이 약해진 느낌이라면 자연 감소 또는 미세 누설로 냉매가 부족해진 것입니다.'),
            ('fa-snowflake','실내기 배관이 차갑지 않아요','정상적인 에어컨은 냉매 배관이 차갑게 유지됩니다. 배관이 미지근하다면 냉매 부족 신호입니다.'),
            ('fa-clock','목표 온도에 도달이 느려요','설정 온도까지 내려가는 시간이 이전보다 현저히 길어졌다면 냉매 보충이 필요합니다.'),
            ('fa-bolt','실외기가 과하게 가동돼요','냉매 부족 시 실외기가 계속 풀가동 상태가 되며 소비전력이 늘어납니다.'),
        ],
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
        'symptom_title': '이런 상황이라면 점검을 권장합니다',
        'symptoms': [
            ('fa-calendar-alt','2년 이상 점검 안 했어요','에어컨은 2년에 1회 이상 전문 점검을 받으면 수명이 크게 늘어납니다. 사전 점검으로 여름철 고장을 예방합니다.'),
            ('fa-thermometer-half','냉방 효율이 예전 같지 않아요','냉방 효율 저하는 냉매 부족, 필터 막힘, 실외기 이상 등 다양한 원인이 있습니다. 종합 점검으로 정확한 원인을 파악합니다.'),
            ('fa-exclamation-triangle','이상한 냄새가 가끔 나요','곰팡이·먼지 냄새는 청소가 필요하고, 화학적 냄새는 전기 계통 이상 신호일 수 있어 점검이 필요합니다.'),
            ('fa-volume-up','가끔 소음이 발생해요','간헐적인 이상 소음은 부품 마모의 초기 신호일 수 있습니다. 방치하면 큰 수리로 이어질 수 있어 조기 점검이 중요합니다.'),
        ],
        'extra_list': [
            {'icon':'fa-clipboard-check','title':'종합 점검 항목','desc':'냉매량·전기계통·실외기·필터·배수 전체 확인'},
            {'icon':'fa-thermometer-half','title':'냉방 효율 측정','desc':'냉방 효율 저하 원인 사전 발견 및 안내'},
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
        'symptom_title': '이런 증상이라면 에어컨 청소가 필요합니다',
        'symptoms': [
            ('fa-wind','켤 때 퀴퀴한 냄새가 나요','에어컨 작동 시 나는 곰팡이·먼지 냄새는 열교환기와 팬에 쌓인 오염물이 원인입니다. 분해 세척으로 해결됩니다.'),
            ('fa-allergies','알레르기 증상이 심해졌어요','에어컨 내부 먼지·곰팡이 포자가 공기 중으로 퍼지면 알레르기·비염을 악화시킬 수 있습니다.'),
            ('fa-snowflake','냉방 효율이 떨어졌어요','필터와 열교환기에 먼지가 쌓이면 냉기 흐름이 방해되어 냉방 효율이 저하됩니다. 청소만으로도 효율이 회복됩니다.'),
            ('fa-tint','물이 자주 떨어져요','배수판에 오염물이 쌓이면 배수가 막혀 물이 떨어집니다. 분해 청소 시 배수판도 함께 세척합니다.'),
        ],
        'extra_list': [
            {'icon':'fa-broom','title':'분해 세척','desc':'필터·열교환기·배수판 완전 분해 세척'},
            {'icon':'fa-leaf','title':'항균 처리','desc':'항균 코팅 처리로 곰팡이·세균 재발 방지'},
        ]
    },
}


def make_faq_json(short, svc_slug):
    """FAQPage JSON-LD 생성 — 지역명을 FAQ에 치환"""
    faqs = SERVICE_FAQ.get(svc_slug, [])
    items = []
    for q, a in faqs:
        # 첫 번째 FAQ의 Q에 지역명 삽입
        q_local = q.replace('강남', short) if '강남' in q else q
        items.append({
            "@type": "Question",
            "name": q_local,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": a.replace('강남구', f'{short}').replace('강남 전 지역', f'{short} 전 지역').replace('역삼동·삼성동·대치동·개포동 포함', '')
            }
        })
    return json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": items}, ensure_ascii=False)


def make_page(region, svc_slug, svc):
    short = region['short']
    name = region['name']
    dongs = region['dongs']
    feature = region['feature']
    traffic = region['traffic']
    apt = region['apt']
    lat = region['lat']
    lng = region['lng']
    region_code = region['region_code']
    place_name = region['place']

    slug_combined = f"{short}-{svc_slug}"
    encoded = urllib.parse.quote(slug_combined)
    canonical = f"https://www.airconhelper.co.kr/area/{encoded}"

    title = svc['title_fmt'].format(short=short, name=name)
    desc = svc['desc_fmt'].format(short=short, name=name)
    h1_1 = svc['h1_line1']
    h1_2 = svc['h1_line2']
    hero_sub = svc['hero_sub']
    rating = svc['rating']
    reviews = svc['reviews']
    cta2_h = svc['cta2_h']
    symptom_title = svc['symptom_title']
    symptoms = svc['symptoms']

    # 증상 카드 HTML
    symptom_cards = '\n'.join([
        f'''    <div class="sym-card">
      <i class="fas {icon} sym-icon"></i>
      <h3 class="sym-title">{stitle}</h3>
      <p class="sym-desc">{sdesc}</p>
    </div>'''
        for icon, stitle, sdesc in symptoms
    ])

    # FAQ 아코디언 HTML
    faqs = SERVICE_FAQ.get(svc_slug, [])
    faq_items_html = ''
    for i, (q, a) in enumerate(faqs):
        q_local = q.replace('강남', short) if '강남' in q else q
        a_local = a.replace('강남구', name).replace('강남 전 지역', f'{short} 전 지역').replace('역삼동·삼성동·대치동·개포동 포함', '')
        faq_items_html += f'''
    <div class="faq-item">
      <h3 class="faq-q"><i class="fas fa-question-circle"></i> {q_local}</h3>
      <p class="faq-a">{a_local}</p>
    </div>'''

    # JSON-LD
    ld_business = {
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        "@id": "https://www.airconhelper.co.kr/#localbusiness",
        "name": "에어컨해결사",
        "url": "https://www.airconhelper.co.kr",
        "telephone": "010-2343-2966",
        "description": desc,
        "openingHours": "Mo-Su 08:00-21:00",
        "areaServed": name,
        "alternateName": f"{short} {svc_slug} 당일출장",
        "currenciesAccepted": "KRW",
        "paymentAccepted": "현금, 계좌이체, 카드",
        "sameAs": ["https://map.naver.com/p/entry/place/2053364866"],
        "address": {
            "@type": "PostalAddress",
            "addressRegion": place_name.split()[0],
            "addressLocality": name,
            "addressCountry": "KR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": lat,
            "longitude": lng
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": rating,
            "reviewCount": reviews,
            "bestRating": "5",
            "worstRating": "1"
        }
    }

    ld_breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "홈", "item": "https://www.airconhelper.co.kr"},
            {"@type": "ListItem", "position": 2, "name": "서비스 지역", "item": "https://www.airconhelper.co.kr/area"},
            {"@type": "ListItem", "position": 3, "name": f"{short} {svc_slug}", "item": canonical}
        ]
    }

    faq_json = make_faq_json(short, svc_slug)

    # 내부 링크
    same_region_links = []
    for other_slug in SERVICES:
        if other_slug != svc_slug:
            other_enc = urllib.parse.quote(f"{short}-{other_slug}")
            same_region_links.append(
                f'<a href="/area/{other_enc}" class="rel-link">{short} {other_slug}</a>'
            )

    other_regions = [r for r in REGIONS if r['short'] != short][:5]
    same_svc_links = []
    for other_r in other_regions:
        other_enc = urllib.parse.quote(f"{other_r['short']}-{svc_slug}")
        same_svc_links.append(
            f'<a href="/area/{other_enc}" class="rel-link">{other_r["short"]} {svc_slug}</a>'
        )

    dong_tags = ''.join([f'<span class="dong">{d}</span>' for d in dongs])
    dongs_str = ' · '.join(dongs)
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
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"/>
  <meta name="keywords" content="{short} 에어컨수리, {short} 에어컨청소, {short} 에어컨가스충전, {name} 에어컨, 당일출장 에어컨"/>
  <meta name="author" content="에어컨해결사"/>
  <meta name="google-site-verification" content="rRDWFJmypYsfPFXa2oQOMtR2dq_lcGIyJA6BdcsPl7w"/>
  <meta name="naver-site-verification" content="7cf89f83fa8bddb6b6d5a8e2d4b0e1b5c9d3f7a4"/>
  <!-- GEO 메타태그 (네이버/구글 위치 최적화) -->
  <meta name="geo.region" content="{region_code}"/>
  <meta name="geo.placename" content="{place_name}"/>
  <meta name="geo.position" content="{lat};{lng}"/>
  <meta name="ICBM" content="{lat}, {lng}"/>
  <meta name="classification" content="에어컨수리, 가전제품수리, 에어컨청소, 에어컨가스충전"/>
  <meta name="subject" content="{short} 에어컨 {svc_slug} 당일출장 전문"/>
  <link rel="canonical" href="{canonical}"/>
  <!-- Open Graph -->
  <meta property="og:title" content="{title}"/>
  <meta property="og:description" content="{desc}"/>
  <meta property="og:url" content="{canonical}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:locale" content="ko_KR"/>
  <meta property="og:site_name" content="에어컨해결사"/>
  <meta property="og:image" content="https://www.airconhelper.co.kr/og-image.jpg"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="{title}"/>
  <meta name="twitter:description" content="{desc}"/>
  <!-- JSON-LD 구조화 데이터 -->
  <script type="application/ld+json">{json.dumps(ld_business, ensure_ascii=False)}</script>
  <script type="application/ld+json">{json.dumps(ld_breadcrumb, ensure_ascii=False)}</script>
  <script type="application/ld+json">{faq_json}</script>
  <!-- 폰트 & 아이콘 -->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;800&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
  <style>
    *{{box-sizing:border-box;margin:0;padding:0}}
    :root{{--p:#0057FF;--pk:#00C2FF;--dark:#0A0F1E;--sub:#5A6380;--bg:#F7F9FF;--r:14px}}
    body{{font-family:'Noto Sans KR',sans-serif;background:var(--bg);color:#1A1F35;line-height:1.6}}
    /* 네비 */
    .nav{{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(10,15,30,.95);backdrop-filter:blur(12px);padding:0 20px;height:60px;display:flex;align-items:center;justify-content:space-between}}
    .nav-logo{{color:#fff;font-weight:800;font-size:17px;text-decoration:none}}.nav-logo span{{color:var(--pk)}}
    .nav-tel{{color:#fff;font-weight:700;font-size:14px;text-decoration:none;background:var(--p);padding:7px 14px;border-radius:8px}}
    /* 히어로 */
    .hero{{background:linear-gradient(135deg,#0A0F1E,#0d1f4a,#0057FF);padding:96px 20px 52px;text-align:center}}
    .bc{{display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:16px;font-size:12px;color:rgba(255,255,255,.45)}}
    .bc a{{color:rgba(255,255,255,.45);text-decoration:none}}
    h1{{font-size:clamp(24px,5vw,40px);font-weight:800;color:#fff;margin-bottom:10px;line-height:1.3}}
    h1 em{{color:var(--pk);font-style:normal}}
    .hero-sub{{font-size:15px;color:rgba(255,255,255,.65);margin-bottom:24px}}
    .cta{{display:inline-flex;align-items:center;gap:8px;background:#fff;color:var(--p);font-size:17px;font-weight:800;padding:14px 32px;border-radius:50px;text-decoration:none}}
    /* 레이아웃 */
    .wrap{{padding:48px 20px;max-width:720px;margin:0 auto}}
    .sec-title{{font-size:18px;font-weight:800;margin-bottom:18px;padding-bottom:10px;border-bottom:3px solid var(--p)}}
    .sec-title i{{color:var(--p);margin-right:7px}}
    .white-sec{{background:#fff;padding:48px 20px}}
    /* 지역 특징 */
    .region-info{{background:#F7F9FF;border-radius:var(--r);padding:20px 22px;border-left:4px solid var(--p)}}
    .region-desc{{font-size:14px;color:#1A1F35;line-height:1.8;margin-bottom:14px}}
    .region-list{{list-style:none;display:flex;flex-direction:column;gap:8px}}
    .region-list li{{font-size:13px;color:var(--sub);display:flex;align-items:flex-start;gap:8px;line-height:1.6}}
    .region-list li i{{color:var(--p);font-size:13px;margin-top:2px;flex-shrink:0}}
    .region-list strong{{color:#1A1F35}}
    /* 증상 그리드 */
    .sym-grid{{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}}
    @media(max-width:480px){{.sym-grid{{grid-template-columns:1fr}}}}
    .sym-card{{background:#fff;border-radius:var(--r);padding:18px 16px;box-shadow:0 3px 12px rgba(0,87,255,.08);border-top:3px solid var(--p)}}
    .sym-icon{{color:var(--p);font-size:22px;margin-bottom:8px;display:block}}
    .sym-title{{font-size:14px;font-weight:700;margin-bottom:6px;color:#1A1F35}}
    .sym-desc{{font-size:12px;color:var(--sub);line-height:1.7}}
    /* 스텝 */
    .steps{{display:flex;flex-direction:column;gap:12px}}
    .step{{display:flex;align-items:flex-start;gap:14px;background:#fff;border-radius:var(--r);padding:16px;box-shadow:0 3px 12px rgba(0,0,0,.05)}}
    .step-num{{width:32px;height:32px;border-radius:50%;background:var(--p);color:#fff;font-weight:800;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}}
    .step h4{{font-size:14px;font-weight:700;margin-bottom:3px}}
    .step p{{font-size:12px;color:var(--sub)}}
    /* 지역 동태그 */
    .dong-wrap{{display:flex;flex-wrap:wrap;gap:8px}}
    .dong{{background:#E8F0FF;color:var(--p);padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600}}
    /* FAQ */
    .faq-list{{display:flex;flex-direction:column;gap:14px}}
    .faq-item{{background:#fff;border-radius:var(--r);padding:18px 20px;box-shadow:0 2px 10px rgba(0,0,0,.06)}}
    .faq-q{{font-size:14px;font-weight:700;color:#1A1F35;margin-bottom:8px;line-height:1.5}}
    .faq-q i{{color:var(--p);margin-right:6px}}
    .faq-a{{font-size:13px;color:var(--sub);line-height:1.8;padding-left:22px}}
    /* CTA2 */
    .cta2{{background:linear-gradient(135deg,var(--dark),#0d1f4a);padding:52px 20px;text-align:center}}
    .cta2 h2{{font-size:clamp(20px,4vw,30px);font-weight:800;color:#fff;margin-bottom:8px}}
    .cta2 p{{color:rgba(255,255,255,.55);font-size:14px;margin-bottom:24px}}
    .cta2-btn{{display:inline-flex;align-items:center;gap:8px;background:var(--p);color:#fff;font-size:17px;font-weight:800;padding:15px 36px;border-radius:50px;text-decoration:none}}
    /* 관련 링크 */
    .rel-sec{{background:#F7F9FF;padding:32px 20px}}
    .rel-inner{{max-width:720px;margin:0 auto}}
    .rel-label{{font-size:13px;font-weight:700;color:#333;margin-bottom:10px}}
    .rel-group{{margin-bottom:14px}}
    .rel-group strong{{font-size:12px;color:#888;display:block;margin-bottom:6px}}
    .rel-link{{display:inline-block;padding:6px 13px;margin:3px;background:#fff;color:var(--p);border-radius:6px;font-size:13px;text-decoration:none;border:1px solid #dde6ff;transition:background .15s}}
    .rel-link:hover{{background:#e8f0ff}}
    .back{{display:block;text-align:center;padding:20px;font-size:13px;color:var(--sub);text-decoration:none}}
  </style>
</head>
<body>
<nav class="nav">
  <a href="/" class="nav-logo">에어컨<span>해결사</span></a>
  <a href="tel:010-2343-2966" class="nav-tel"><i class="fas fa-phone"></i> 010-2343-2966</a>
</nav>

<!-- 히어로 -->
<section class="hero">
  <nav class="bc" aria-label="breadcrumb">
    <a href="/">홈</a><span>›</span><a href="/area">서비스 지역</a><span>›</span><span>{short} {svc_slug}</span>
  </nav>
  <h1><em>{short}</em> {h1_1}<br>{h1_2}</h1>
  <p class="hero-sub">{name} {hero_sub}</p>
  <a href="tel:010-2343-2966" class="cta"><i class="fas fa-phone"></i> 지금 바로 전화상담</a>
</section>

<!-- 지역 특징 -->
<div class="white-sec">
  <div style="max-width:720px;margin:0 auto">
    <h2 class="sec-title"><i class="fas fa-info-circle"></i>{name} 에어컨 서비스 특징</h2>
    <div class="region-info">
      <p class="region-desc">{feature}은 여름철 에어컨 수요가 높은 지역입니다. {apt}</p>
      <ul class="region-list">
        <li><i class="fas fa-subway"></i> <strong>교통</strong>: {traffic} 이용으로 부품 조달이 빠릅니다</li>
        <li><i class="fas fa-map-marker-alt"></i> <strong>출장 범위</strong>: {dongs_str} 전 지역 당일 출장</li>
        <li><i class="fas fa-clock"></i> <strong>출장 시간</strong>: 오전 접수 시 당일 방문 원칙</li>
{extra_li}
      </ul>
    </div>
  </div>
</div>

<!-- 증상별 섹션 -->
<div class="wrap">
  <h2 class="sec-title"><i class="fas fa-exclamation-circle"></i>{symptom_title}</h2>
  <div class="sym-grid">
{symptom_cards}
  </div>
</div>

<!-- 진행 순서 -->
<div class="white-sec">
  <div style="max-width:720px;margin:0 auto">
    <h2 class="sec-title"><i class="fas fa-list-ol"></i>출장 진행 순서</h2>
    <div class="steps">
      <div class="step"><div class="step-num">1</div><div><h4>전화 상담</h4><p>증상을 말씀해 주시면 예상 방문 시간을 안내드립니다.</p></div></div>
      <div class="step"><div class="step-num">2</div><div><h4>출장 방문</h4><p>{name} 전 지역 당일 출장. 전문 기사가 직접 방문합니다.</p></div></div>
      <div class="step"><div class="step-num">3</div><div><h4>현장 진단</h4><p>정확한 점검 후 작업 내용을 설명드립니다. 동의 후 작업 진행합니다.</p></div></div>
      <div class="step"><div class="step-num">4</div><div><h4>완료 및 테스트</h4><p>작업 완료 후 정상 작동 확인. 사후 A/S도 책임집니다.</p></div></div>
    </div>
  </div>
</div>

<!-- 출장 가능 지역 -->
<div class="wrap">
  <h2 class="sec-title"><i class="fas fa-map-marker-alt"></i>{short} 출장 가능 지역</h2>
  <div class="dong-wrap">{dong_tags}<span class="dong">{short} 전 지역</span></div>
</div>

<!-- FAQ -->
<div class="white-sec">
  <div style="max-width:720px;margin:0 auto">
    <h2 class="sec-title"><i class="fas fa-question-circle"></i>자주 묻는 질문 (FAQ)</h2>
    <div class="faq-list">{faq_items_html}
    </div>
  </div>
</div>

<!-- CTA -->
<section class="cta2">
  <h2>{short} {cta2_h}</h2>
  <p>전화 한 통으로 당일 출장 · 전문 기사 직접 방문</p>
  <a href="tel:010-2343-2966" class="cta2-btn"><i class="fas fa-phone"></i> 010-2343-2966</a>
</section>
<a href="/" class="back">← 에어컨해결사 메인으로 돌아가기</a>

<!-- 관련 서비스 링크 -->
<section class="rel-sec">
  <div class="rel-inner">
    <p class="rel-label">관련 서비스 페이지</p>
    <div class="rel-group">
      <strong>{short} 다른 서비스</strong>
      {''.join(same_region_links)}
    </div>
    <div class="rel-group">
      <strong>{svc_slug} 다른 지역</strong>
      {''.join(same_svc_links)}
    </div>
  </div>
</section>
</body>
</html>"""
    return html


# 전체 재생성 (모든 파일 덮어쓰기)
generated = 0
for region in REGIONS:
    short = region['short']
    for svc_slug, svc in SERVICES.items():
        slug_combined = f"{short}-{svc_slug}"
        encoded = urllib.parse.quote(slug_combined)
        fname = f"{encoded}.html"
        fpath = os.path.join(OUT_DIR, fname)
        html = make_page(region, svc_slug, svc)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(html)
        generated += 1

print(f"✅ 총 {generated}개 페이지 재생성 완료")
