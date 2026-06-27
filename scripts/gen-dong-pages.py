#!/usr/bin/env python3
"""
동(洞) 단위 area 페이지 대량 생성 스크립트
- 15개 구/시 × 112개 동 × 6개 서비스 = 672개 페이지
- 상위노출 최적화: 풍부한 콘텐츠, FAQ, JSON-LD, GEO 메타태그, 키워드 자연 삽입
"""

import os
import urllib.parse

OUT_DIR = '/home/user/webapp/public/area'
os.makedirs(OUT_DIR, exist_ok=True)

# ─── 15개 구/시 + 동 목록 + GPS 좌표 ───────────────────────────────
REGIONS = [
    {
        'short': '남양주', 'name': '남양주시', 'region_code': 'KR-41',
        'place': '경기도 남양주시', 'lat': 37.6360, 'lng': 127.2165,
        'feature': '별내·다산신도시 신축 아파트와 구도심이 함께하는 남양주시',
        'traffic': '지하철 4·8호선 연장, 경춘선',
        'dongs': [
            {'name': '별내동', 'lat': 37.6427, 'lng': 127.1351, 'feature': '별내신도시 신축 아파트 밀집'},
            {'name': '다산동', 'lat': 37.5989, 'lng': 127.1897, 'feature': '다산신도시 대단지 아파트'},
            {'name': '금곡동', 'lat': 37.6462, 'lng': 127.1894, 'feature': '구도심 주택·빌라 혼재'},
            {'name': '양정동', 'lat': 37.6301, 'lng': 127.2035, 'feature': '주거·상업 복합 지역'},
            {'name': '평내동', 'lat': 37.6521, 'lng': 127.2184, 'feature': '중소형 아파트 단지'},
            {'name': '호평동', 'lat': 37.6598, 'lng': 127.2237, 'feature': '호평·평내 택지개발지구'},
            {'name': '오남읍', 'lat': 37.6892, 'lng': 127.1987, 'feature': '전원주택·단독주택 지역'},
            {'name': '진접읍', 'lat': 37.7201, 'lng': 127.2014, 'feature': '진접 택지지구 아파트'},
            {'name': '와부읍', 'lat': 37.5847, 'lng': 127.2201, 'feature': '팔당·덕소 주거지'},
            {'name': '조안면', 'lat': 37.5534, 'lng': 127.3201, 'feature': '전원·주거 혼합 지역'},
        ]
    },
    {
        'short': '구리', 'name': '구리시', 'region_code': 'KR-41',
        'place': '경기도 구리시', 'lat': 37.5943, 'lng': 127.1296,
        'feature': '인창·교문동 아파트 단지가 밀집한 구리시',
        'traffic': '지하철 8호선, 경의중앙선',
        'dongs': [
            {'name': '인창동', 'lat': 37.5987, 'lng': 127.1401, 'feature': '대형 아파트 단지 밀집'},
            {'name': '교문동', 'lat': 37.5941, 'lng': 127.1298, 'feature': '상업·주거 복합 지역'},
            {'name': '수택동', 'lat': 37.5876, 'lng': 127.1352, 'feature': '구도심 빌라·주택 밀집'},
            {'name': '사노동', 'lat': 37.6054, 'lng': 127.1287, 'feature': '신축·구축 아파트 혼재'},
            {'name': '갈매동', 'lat': 37.6198, 'lng': 127.1201, 'feature': '갈매택지지구 신축 아파트'},
            {'name': '동구동', 'lat': 37.5912, 'lng': 127.1412, 'feature': '주거 밀집 지역'},
            {'name': '원수동', 'lat': 37.5834, 'lng': 127.1298, 'feature': '단독주택·빌라 혼재'},
            {'name': '토평동', 'lat': 37.6012, 'lng': 127.1189, 'feature': '아파트 밀집 신주거지'},
        ]
    },
    {
        'short': '강동', 'name': '강동구', 'region_code': 'KR-11',
        'place': '서울특별시 강동구', 'lat': 37.5301, 'lng': 127.1238,
        'feature': '천호·암사동 상업지구와 고덕·명일동 주거단지가 공존하는 강동구',
        'traffic': '지하철 5·8·9호선',
        'dongs': [
            {'name': '천호동', 'lat': 37.5386, 'lng': 127.1238, 'feature': '천호역 상권 및 주거 밀집'},
            {'name': '성내동', 'lat': 37.5298, 'lng': 127.1154, 'feature': '올림픽공원 인근 주거지'},
            {'name': '길동', 'lat': 37.5356, 'lng': 127.1354, 'feature': '중형 아파트 단지 밀집'},
            {'name': '둔촌동', 'lat': 37.5201, 'lng': 127.1301, 'feature': '둔촌주공 재건축 지역'},
            {'name': '암사동', 'lat': 37.5519, 'lng': 127.1298, 'feature': '암사 한강변 주거 단지'},
            {'name': '명일동', 'lat': 37.5465, 'lng': 127.1412, 'feature': '고급 주거지·학원가'},
            {'name': '고덕동', 'lat': 37.5534, 'lng': 127.1534, 'feature': '고덕강일공공주택지구'},
            {'name': '상일동', 'lat': 37.5521, 'lng': 127.1634, 'feature': '신축 대단지 아파트'},
            {'name': '강일동', 'lat': 37.5598, 'lng': 127.1712, 'feature': '강일리버파크 신축 단지'},
            {'name': '풍납동', 'lat': 37.5267, 'lng': 127.1098, 'feature': '한강변 아파트 밀집'},
        ]
    },
    {
        'short': '하남', 'name': '하남시', 'region_code': 'KR-41',
        'place': '경기도 하남시', 'lat': 37.5392, 'lng': 127.2148,
        'feature': '미사강변도시 신축과 덕풍·신장 구도심이 공존하는 하남시',
        'traffic': '지하철 5호선 연장선',
        'dongs': [
            {'name': '미사동', 'lat': 37.5523, 'lng': 127.2012, 'feature': '미사강변도시 대규모 신축'},
            {'name': '풍산동', 'lat': 37.5412, 'lng': 127.2198, 'feature': '신규 아파트 택지 지역'},
            {'name': '덕풍동', 'lat': 37.5301, 'lng': 127.2198, 'feature': '구도심 상업·주거 복합'},
            {'name': '신장동', 'lat': 37.5387, 'lng': 127.2087, 'feature': '하남 구도심 주거 밀집'},
            {'name': '창우동', 'lat': 37.5198, 'lng': 127.2145, 'feature': '단독주택·빌라 혼재'},
            {'name': '감일동', 'lat': 37.5067, 'lng': 127.1934, 'feature': '감일지구 신축 아파트'},
            {'name': '감북동', 'lat': 37.4989, 'lng': 127.1889, 'feature': '신규 택지지구'},
            {'name': '초일동', 'lat': 37.5145, 'lng': 127.2301, 'feature': '전원·주거 혼합 지역'},
        ]
    },
    {
        'short': '중랑', 'name': '중랑구', 'region_code': 'KR-11',
        'place': '서울특별시 중랑구', 'lat': 37.6063, 'lng': 127.0927,
        'feature': '신내동 신도시와 면목·망우동 주거 밀집 지역인 중랑구',
        'traffic': '지하철 7호선·경의중앙선',
        'dongs': [
            {'name': '면목동', 'lat': 37.5912, 'lng': 127.0923, 'feature': '최대 주거 밀집 지역'},
            {'name': '상봉동', 'lat': 37.5978, 'lng': 127.0845, 'feature': '상봉역 상업·주거 복합'},
            {'name': '중화동', 'lat': 37.6012, 'lng': 127.0834, 'feature': '주거·상업 혼재 지역'},
            {'name': '묵동', 'lat': 37.6198, 'lng': 127.0923, 'feature': '아파트 단지 밀집'},
            {'name': '망우동', 'lat': 37.6145, 'lng': 127.1012, 'feature': '구축 주택·아파트 혼재'},
            {'name': '신내동', 'lat': 37.6234, 'lng': 127.1045, 'feature': '신내택지지구 신축 아파트'},
        ]
    },
    {
        'short': '동대문', 'name': '동대문구', 'region_code': 'KR-11',
        'place': '서울특별시 동대문구', 'lat': 37.5744, 'lng': 127.0396,
        'feature': '전농·답십리 재개발 지역과 장안동 상권이 활성화된 동대문구',
        'traffic': '지하철 1·2·5호선',
        'dongs': [
            {'name': '전농동', 'lat': 37.5812, 'lng': 127.0523, 'feature': '재개발·신축 아파트 증가'},
            {'name': '답십리동', 'lat': 37.5698, 'lng': 127.0534, 'feature': '재건축 활발한 주거지'},
            {'name': '장안동', 'lat': 37.5756, 'lng': 127.0612, 'feature': '장안평 상업·주거 복합'},
            {'name': '청량리동', 'lat': 37.5801, 'lng': 127.0467, 'feature': '청량리역 대형 상권'},
            {'name': '회기동', 'lat': 37.5889, 'lng': 127.0534, 'feature': '대학가·원룸 밀집'},
            {'name': '휘경동', 'lat': 37.5823, 'lng': 127.0578, 'feature': '주거 밀집 지역'},
            {'name': '이문동', 'lat': 37.5934, 'lng': 127.0589, 'feature': '이문·휘경 재개발 지역'},
            {'name': '용두동', 'lat': 37.5745, 'lng': 127.0412, 'feature': '신축 주거 개발 활발'},
            {'name': '제기동', 'lat': 37.5823, 'lng': 127.0389, 'feature': '경동시장 인근 상권'},
        ]
    },
    {
        'short': '노원', 'name': '노원구', 'region_code': 'KR-11',
        'place': '서울특별시 노원구', 'lat': 37.6542, 'lng': 127.0568,
        'feature': '상계·중계동 대형 아파트 단지가 밀집한 서울 북부 최대 주거지',
        'traffic': '지하철 4·6·7호선',
        'dongs': [
            {'name': '상계동', 'lat': 37.6601, 'lng': 127.0634, 'feature': '서울 최대 주공 아파트 단지'},
            {'name': '중계동', 'lat': 37.6489, 'lng': 127.0701, 'feature': '학원가·아파트 밀집'},
            {'name': '하계동', 'lat': 37.6367, 'lng': 127.0645, 'feature': '중소형 아파트 단지'},
            {'name': '공릉동', 'lat': 37.6312, 'lng': 127.0734, 'feature': '서울과기대 인근 주거지'},
            {'name': '월계동', 'lat': 37.6234, 'lng': 127.0523, 'feature': '구축 아파트·빌라 혼재'},
            {'name': '창동', 'lat': 37.6523, 'lng': 127.0478, 'feature': '창동역 상업·주거 복합'},
        ]
    },
    {
        'short': '강북', 'name': '강북구', 'region_code': 'KR-11',
        'place': '서울특별시 강북구', 'lat': 37.6396, 'lng': 127.0255,
        'feature': '미아·수유동 주거 밀집과 우이동 자연환경이 조화로운 강북구',
        'traffic': '지하철 4호선·우이신설선',
        'dongs': [
            {'name': '번동', 'lat': 37.6423, 'lng': 127.0312, 'feature': '빌라·단독주택 밀집'},
            {'name': '수유동', 'lat': 37.6489, 'lng': 127.0234, 'feature': '수유역 상권·주거 복합'},
            {'name': '미아동', 'lat': 37.6345, 'lng': 127.0312, 'feature': '미아사거리 상업·주거'},
            {'name': '우이동', 'lat': 37.6601, 'lng': 127.0145, 'feature': '북한산 인근 전원주택'},
        ]
    },
    {
        'short': '성북', 'name': '성북구', 'region_code': 'KR-11',
        'place': '서울특별시 성북구', 'lat': 37.5894, 'lng': 127.0167,
        'feature': '길음·장위 뉴타운과 성북·정릉 주거지가 공존하는 성북구',
        'traffic': '지하철 4·6호선',
        'dongs': [
            {'name': '성북동', 'lat': 37.5934, 'lng': 127.0067, 'feature': '고급 주거·문화시설 밀집'},
            {'name': '정릉동', 'lat': 37.6012, 'lng': 127.0045, 'feature': '산자락 주거·단독주택'},
            {'name': '길음동', 'lat': 37.6045, 'lng': 127.0234, 'feature': '길음뉴타운 대단지 아파트'},
            {'name': '종암동', 'lat': 37.5967, 'lng': 127.0289, 'feature': '아파트·빌라 혼재 주거지'},
            {'name': '돈암동', 'lat': 37.5912, 'lng': 127.0234, 'feature': '성신여대 인근 상권'},
            {'name': '동선동', 'lat': 37.5878, 'lng': 127.0156, 'feature': '주거·상업 복합 지역'},
            {'name': '안암동', 'lat': 37.5856, 'lng': 127.0289, 'feature': '고려대 인근 원룸·주거'},
            {'name': '보문동', 'lat': 37.5823, 'lng': 127.0178, 'feature': '소규모 주택·빌라 밀집'},
            {'name': '삼선동', 'lat': 37.5867, 'lng': 127.0123, 'feature': '혜화·동대문 인근 주거'},
            {'name': '장위동', 'lat': 37.6089, 'lng': 127.0345, 'feature': '장위뉴타운 재개발 진행 중'},
            {'name': '석관동', 'lat': 37.6134, 'lng': 127.0412, 'feature': '아파트 단지 밀집'},
        ]
    },
    {
        'short': '금천', 'name': '금천구', 'region_code': 'KR-11',
        'place': '서울특별시 금천구', 'lat': 37.4570, 'lng': 126.8956,
        'feature': '가산디지털단지와 독산·시흥동 주택가가 밀집한 금천구',
        'traffic': '지하철 1·7호선',
        'dongs': [
            {'name': '가산동', 'lat': 37.4789, 'lng': 126.8823, 'feature': '가산디지털단지 상업·주거 혼재'},
            {'name': '독산동', 'lat': 37.4623, 'lng': 126.8956, 'feature': '빌라·아파트 주거 밀집'},
            {'name': '시흥동', 'lat': 37.4498, 'lng': 126.9012, 'feature': '구축 주택·빌라 다수'},
        ]
    },
    {
        'short': '관악', 'name': '관악구', 'region_code': 'KR-11',
        'place': '서울특별시 관악구', 'lat': 37.4784, 'lng': 126.9516,
        'feature': '서울대 인근 신림·봉천동 주거·상업 복합 지역인 관악구',
        'traffic': '지하철 2호선·신림선',
        'dongs': [
            {'name': '신림동', 'lat': 37.4845, 'lng': 126.9298, 'feature': '원룸·고시원·빌라 대규모 밀집'},
            {'name': '봉천동', 'lat': 37.4867, 'lng': 126.9512, 'feature': '봉천뉴타운·아파트 단지'},
            {'name': '남현동', 'lat': 37.4756, 'lng': 126.9701, 'feature': '서초구 인접 주거 지역'},
        ]
    },
    {
        'short': '구로', 'name': '구로구', 'region_code': 'KR-11',
        'place': '서울특별시 구로구', 'lat': 37.4955, 'lng': 126.8875,
        'feature': '구로디지털단지와 개봉·오류동 주거지가 혼재한 구로구',
        'traffic': '지하철 1·2·7호선',
        'dongs': [
            {'name': '구로동', 'lat': 37.5045, 'lng': 126.8845, 'feature': '구로디지털단지 상업·주거'},
            {'name': '가리봉동', 'lat': 37.4934, 'lng': 126.8812, 'feature': '다세대·빌라 밀집 지역'},
            {'name': '고척동', 'lat': 37.4989, 'lng': 126.8634, 'feature': '고척돔 인근 주거지'},
            {'name': '개봉동', 'lat': 37.4923, 'lng': 126.8523, 'feature': '아파트·빌라 혼재 주거'},
            {'name': '오류동', 'lat': 37.4878, 'lng': 126.8423, 'feature': '중소형 아파트 밀집'},
            {'name': '궁동', 'lat': 37.4945, 'lng': 126.8312, 'feature': '단독주택·빌라 혼재'},
            {'name': '항동', 'lat': 37.4901, 'lng': 126.8212, 'feature': '항동 택지지구 신축'},
            {'name': '신도림동', 'lat': 37.5089, 'lng': 126.8912, 'feature': '신도림역 대형 상권·주거'},
        ]
    },
    {
        'short': '영등포', 'name': '영등포구', 'region_code': 'KR-11',
        'place': '서울특별시 영등포구', 'lat': 37.5264, 'lng': 126.8962,
        'feature': '여의도 금융중심지와 영등포 상권, 당산동 주거지가 공존하는 영등포구',
        'traffic': '지하철 2·5·9호선',
        'dongs': [
            {'name': '영등포동', 'lat': 37.5256, 'lng': 126.9012, 'feature': '영등포 전통 상권 중심'},
            {'name': '여의도동', 'lat': 37.5219, 'lng': 126.9245, 'feature': '금융·방송 밀집 업무지구'},
            {'name': '당산동', 'lat': 37.5334, 'lng': 126.9012, 'feature': '당산역 인근 주거·상업'},
            {'name': '문래동', 'lat': 37.5167, 'lng': 126.8967, 'feature': '문래 예술촌·주거 혼재'},
            {'name': '양평동', 'lat': 37.5267, 'lng': 126.8845, 'feature': '아파트·주거 밀집 지역'},
            {'name': '신길동', 'lat': 37.5112, 'lng': 126.9045, 'feature': '신길뉴타운 재개발 진행'},
            {'name': '대림동', 'lat': 37.4978, 'lng': 126.8967, 'feature': '다문화 상권·빌라 밀집'},
            {'name': '도림동', 'lat': 37.5089, 'lng': 126.9089, 'feature': '주거·상업 복합 지역'},
        ]
    },
    {
        'short': '광명', 'name': '광명시', 'region_code': 'KR-41',
        'place': '경기도 광명시', 'lat': 37.4789, 'lng': 126.8645,
        'feature': '철산·하안동 아파트 단지와 소하동 신도시가 공존하는 광명시',
        'traffic': '지하철 7호선',
        'dongs': [
            {'name': '광명동', 'lat': 37.4789, 'lng': 126.8623, 'feature': '광명시 구도심 상업·주거'},
            {'name': '철산동', 'lat': 37.4823, 'lng': 126.8712, 'feature': '철산역 대형 아파트 단지'},
            {'name': '하안동', 'lat': 37.4701, 'lng': 126.8545, 'feature': '하안 주공·중소형 아파트'},
            {'name': '소하동', 'lat': 37.4634, 'lng': 126.8434, 'feature': '광명역세권 신도시 개발'},
            {'name': '노온사동', 'lat': 37.4512, 'lng': 126.8323, 'feature': '단독주택·전원주거 지역'},
            {'name': '일직동', 'lat': 37.4434, 'lng': 126.8234, 'feature': 'KTX 광명역 인근 개발지'},
            {'name': '가학동', 'lat': 37.4389, 'lng': 126.8156, 'feature': '개발 예정 주거 지역'},
            {'name': '옥길동', 'lat': 37.4312, 'lng': 126.8245, 'feature': '옥길지구 신축 아파트'},
        ]
    },
    {
        'short': '안양', 'name': '안양시', 'region_code': 'KR-41',
        'place': '경기도 안양시', 'lat': 37.3943, 'lng': 126.9568,
        'feature': '평촌신도시와 만안·석수동 기성 주거지가 공존하는 안양시',
        'traffic': '지하철 1·4호선',
        'dongs': [
            {'name': '안양동', 'lat': 37.3978, 'lng': 126.9534, 'feature': '안양 구도심 상업·주거'},
            {'name': '만안동', 'lat': 37.4012, 'lng': 126.9423, 'feature': '만안구 주거 밀집 지역'},
            {'name': '석수동', 'lat': 37.4134, 'lng': 126.9312, 'feature': '석수역 인근 아파트 단지'},
            {'name': '박달동', 'lat': 37.4023, 'lng': 126.9201, 'feature': '빌라·단독주택 혼재'},
            {'name': '비산동', 'lat': 37.3912, 'lng': 126.9534, 'feature': '비산·인덕원 주거단지'},
            {'name': '관양동', 'lat': 37.3856, 'lng': 126.9623, 'feature': '인덕원역 인근 아파트'},
            {'name': '평촌동', 'lat': 37.3923, 'lng': 126.9712, 'feature': '평촌신도시 대단지 아파트'},
            {'name': '호계동', 'lat': 37.3867, 'lng': 126.9845, 'feature': '호계동 아파트 밀집'},
            {'name': '부림동', 'lat': 37.3801, 'lng': 126.9567, 'feature': '평촌 학원가 인근 주거'},
            {'name': '귀인동', 'lat': 37.3789, 'lng': 126.9489, 'feature': '소규모 아파트·빌라 혼재'},
        ]
    },
]

# ─── 서비스 정의 ───────────────────────────────────────────────────
SERVICES = [
    {
        'slug': '에어컨수리',
        'title': '에어컨수리',
        'desc': '에어컨 고장·냉매 누설·실외기 이상 등 모든 에어컨 수리',
        'keywords': '에어컨수리,에어컨고장,에어컨냉매충전,에어컨가스,에어컨냉매,에어컨안켜짐,에어컨전원안켜짐,실외기고장,에어컨실외기안돌아감,에어컨소음,에어컨물떨어짐,에어컨바람안나옴,에어컨시원하지않음,에어컨성에,에어컨얼음,에어컨매립배관수리,에어컨배관,에어컨드레인,에어컨배수펌프,삼성에어컨수리,LG에어컨수리,대우에어컨수리,위니아에어컨수리,시스템에어컨수리,창문형에어컨수리',
        'symptoms': [
            ('찬바람이 안 나와요', '에어컨을 켜도 시원하지 않거나 미지근한 바람만 나오는 경우, 냉매 부족이나 실외기 문제일 수 있습니다. 즉시 점검이 필요합니다.'),
            ('에어컨이 안 켜져요', '전원 버튼을 눌러도 반응이 없거나 리모컨이 먹히지 않는 경우, 전원부·기판 고장이거나 실외기 차단기 문제일 수 있습니다.'),
            ('실외기에서 소음이 나요', '실외기에서 덜컹거리는 소리나 웅웅거리는 소음이 나면 팬 모터 불량이나 이물질 끼임 등의 문제로 수리가 필요합니다.'),
            ('배관에 성에·얼음이 껴요', '실내기 배관이나 실외기 주변에 성에가 끼는 경우 냉매 부족이나 필터 막힘이 원인입니다. 방치하면 압축기 손상으로 이어질 수 있습니다.'),
        ],
        'faqs': [
            ('에어컨 수리 비용은 어느 정도인가요?', '고장 원인에 따라 다릅니다. 냉매 충전은 6~15만원대, 기판·팬 모터 교체는 부품비 포함 10~30만원대입니다. 방문 점검 후 정확한 견적을 안내드립니다. 출장비는 작업 진행 시 별도 청구 없습니다.'),
            ('당일 수리가 가능한가요?', '네, 오전에 연락 주시면 당일 오후 방문이 가능한 경우가 많습니다. 성수기(7~8월)에는 대기가 발생할 수 있어 빠른 연락을 권장드립니다.'),
            ('삼성·LG 등 모든 브랜드 수리 가능한가요?', '삼성, LG, 캐리어, 대우, 위니아, 캐리어, 미쓰비시 등 국내외 모든 브랜드 수리가 가능합니다. 벽걸이·스탠드·시스템·창문형 등 모든 기종 대응합니다.'),
            ('수리 후 AS 보장이 되나요?', '작업 완료 후 일정 기간 AS를 보장해드립니다. 동일 증상 재발 시 재방문하여 확인해드립니다.'),
            ('냉매 충전만 해도 해결이 되나요?', '냉매 부족이 원인이라면 충전으로 해결됩니다. 단, 냉매가 새는 누설이 있는 경우 수리 없이 충전만 하면 다시 부족해집니다. 누설 부위 수리 후 충전이 근본적인 해결책입니다.'),
        ]
    },
    {
        'slug': '에어컨청소',
        'title': '에어컨청소',
        'desc': '분해 세척·필터 청소·내부 곰팡이 제거 전문 에어컨 청소',
        'keywords': '에어컨청소,삼성에어컨청소,벽걸이에어컨셀프청소,에어컨냄새,에어컨필터청소,에어컨분해청소,시스템에어컨청소,에어컨곰팡이,에어컨세척,에어컨냄새제거',
        'symptoms': [
            ('켤 때 퀴퀴한 냄새가 나요', '에어컨 내부에 곰팡이나 세균이 번식하면 가동 시 퀴퀴하고 역한 냄새가 납니다. 특히 오랫동안 사용하지 않다가 처음 켰을 때 심하게 납니다.'),
            ('냉방이 예전보다 약해졌어요', '필터와 열교환기(증발기)에 먼지가 쌓이면 냉방 효율이 크게 떨어집니다. 전기요금은 그대로이거나 올라가는데 시원함은 줄어드는 경우 청소가 필요합니다.'),
            ('1년 이상 청소를 안 했어요', '에어컨 내부는 눈에 보이지 않는 곳에 먼지·곰팡이가 쌓입니다. 건강을 위해 연 1회 이상 전문 분해 청소를 권장합니다.'),
            ('에어컨에서 물이 떨어져요', '드레인 호스나 드레인 팬이 오염되면 물이 넘쳐 실내로 떨어집니다. 청소와 함께 드레인 점검이 필요합니다.'),
        ],
        'faqs': [
            ('에어컨 분해 청소와 일반 청소 차이가 뭔가요?', '일반 청소는 필터와 외관만 닦는 것이고, 분해 청소는 커버를 열어 내부 열교환기(증발기)와 팬, 드레인 팬까지 꼼꼼하게 세척하는 작업입니다. 냄새 제거와 냉방 효율 회복에는 분해 청소가 필수입니다.'),
            ('청소 후 바로 사용할 수 있나요?', '세척 후 30분 이상 건조 및 환기를 하신 후 사용을 권장합니다. 청소 직후 냉방 성능이 향상된 것을 바로 느끼실 수 있습니다.'),
            ('어린이·반려동물이 있어도 괜찮은 세제를 쓰나요?', '네, 인체에 무해한 친환경 세척제를 사용합니다. 어린이와 반려동물이 있는 가정도 안심하고 이용하실 수 있습니다.'),
            ('청소 주기는 얼마나 되나요?', '일반 가정집은 연 1회, 반려동물이 있거나 먼지가 많은 환경이라면 연 2회를 권장합니다. 여름 본격 사용 전(5~6월) 청소가 가장 효과적입니다.'),
            ('시스템(천장형) 에어컨도 청소 가능한가요?', '네, 벽걸이·스탠드·시스템(천장형·4방향) 등 모든 기종 청소 가능합니다. 사무실·상가 시스템 에어컨도 전문적으로 처리합니다.'),
        ]
    },
    {
        'slug': '에어컨가스충전',
        'title': '에어컨가스충전',
        'desc': '냉매 가스 누설 점검·보충·충전 전문 서비스',
        'keywords': '에어컨가스충전,에어컨냉매충전,에어컨가스충전비용,에어컨냉매보충,에어컨가스보충,에어컨냉매가스,에어컨가스,에어컨냉매,냉매보충,에어컨냉매충전가격,에어컨가스충전비용',
        'symptoms': [
            ('바람은 나오는데 시원하지 않아요', '냉매(가스)가 부족하면 압축기가 작동해도 냉방이 제대로 되지 않습니다. 바람은 나오지만 미지근한 경우 냉매 점검이 우선입니다.'),
            ('배관에 성에가 끼어 있어요', '냉매 부족으로 증발기 온도가 과도하게 낮아지면 배관에 성에·얼음이 생깁니다. 이 상태로 계속 사용하면 압축기가 손상될 수 있습니다.'),
            ('전기요금이 갑자기 올랐어요', '냉매가 부족하면 설정 온도를 맞추기 위해 압축기가 과부하로 작동하면서 전기를 더 소모합니다. 가스충전 후 전기요금이 정상화됩니다.'),
            ('실외기가 멈추거나 자꾸 꺼져요', '냉매 부족 시 압축기 과열 방지를 위해 실외기가 자동으로 멈추는 경우가 있습니다. 냉매 충전으로 해결 가능합니다.'),
        ],
        'faqs': [
            ('에어컨 냉매는 주기적으로 충전해야 하나요?', '정상적인 에어컨은 냉매가 자연 소모되지 않습니다. 냉매가 부족하다면 어딘가에서 누설이 되고 있다는 신호입니다. 단순 충전보다 누설 부위 먼저 확인 후 수리하는 것이 올바른 방법입니다.'),
            ('냉매 종류가 다양한데 어떤 걸 쓰나요?', '에어컨 모델에 따라 R-22, R-410A, R-32, R-410A 등 냉매 종류가 다릅니다. 저희는 모든 냉매 종류를 취급하며, 에어컨에 맞는 냉매를 정확하게 충전합니다.'),
            ('충전 후 얼마나 지속되나요?', '누설이 없는 경우 한번 충전하면 에어컨 수명이 다할 때까지 지속됩니다. 1~2년 후 다시 부족해진다면 누설 수리가 필요합니다.'),
            ('냉매 충전만 해도 되나요, 수리도 해야 하나요?', '누설이 없고 단순 부족이라면 충전만으로 해결됩니다. 하지만 배관 연결부나 서비스 밸브에서 누설이 감지되면 수리 후 충전이 근본 해결책입니다.'),
            ('충전 작업 시간은 얼마나 걸리나요?', '냉매 압력 측정 및 누설 점검 포함 보통 30분~1시간 정도 소요됩니다. 누설 수리가 추가되면 더 시간이 걸릴 수 있습니다.'),
        ]
    },
    {
        'slug': '에어컨점검',
        'title': '에어컨점검',
        'desc': '냉매 압력·전기 계통·실외기·필터 등 에어컨 전체 정밀 점검',
        'keywords': '에어컨점검,에어컨정기점검,에어컨여름전점검,에어컨상태확인,에어컨진단,에어컨예방점검,에어컨관리,에어컨전기세',
        'symptoms': [
            ('여름 전에 미리 확인하고 싶어요', '에어컨 고장은 가장 더운 날에 발생합니다. 성수기(7~8월) 전 5~6월에 미리 점검받으시면 기다림 없이 시원한 여름을 보낼 수 있습니다.'),
            ('오래된 에어컨인데 이상이 없는지 확인하고 싶어요', '10년 이상된 에어컨은 냉매 누설, 기판 노후화, 팬 모터 마모 등 여러 문제가 잠재해 있을 수 있습니다. 정밀 점검으로 사전에 확인하세요.'),
            ('전기요금이 너무 많이 나와요', '에어컨 냉방 효율이 떨어지면 같은 온도를 유지하기 위해 더 많은 전력을 소모합니다. 점검을 통해 효율 저하 원인을 찾아드립니다.'),
            ('이사 후 재설치했는데 확인하고 싶어요', '이사 시 에어컨 이전설치 과정에서 냉매가 손실되거나 배관 연결이 불완전할 수 있습니다. 재설치 후 점검을 받으시는 것을 권장합니다.'),
        ],
        'faqs': [
            ('점검 항목에는 어떤 것이 포함되나요?', '냉매 압력 측정, 누설 여부 확인, 전기 계통 점검, 필터·열교환기 오염도 확인, 실외기 팬·압축기 작동 상태, 드레인 호스 점검 등을 종합적으로 확인합니다.'),
            ('점검만 받아도 되나요, 꼭 수리해야 하나요?', '점검 결과 이상이 없으면 점검비만 청구됩니다. 문제가 발견된 경우에는 설명드린 후 동의하시면 수리를 진행합니다. 강요 없이 투명하게 안내드립니다.'),
            ('점검은 얼마나 걸리나요?', '기본 점검은 30분~1시간 정도 소요됩니다. 에어컨 대수와 상태에 따라 달라질 수 있습니다.'),
            ('점검 후 수리 견적도 알려주나요?', '네, 점검 과정에서 문제가 발견되면 현장에서 바로 수리 견적을 안내드립니다. 당일 수리 진행도 가능합니다.'),
            ('여름 전 점검이 왜 중요한가요?', '에어컨 수리 업체는 7~8월 성수기에 예약이 몰립니다. 5~6월에 미리 점검받으면 대기 없이 빠르게 처리되고, 수리가 필요한 경우에도 성수기 전에 해결할 수 있습니다.'),
        ]
    },
    {
        'slug': '에어컨냉매충전',
        'title': '에어컨냉매충전',
        'desc': '에어컨 냉매(가스) 부족 진단·누설 수리·냉매 충전 전문',
        'keywords': '에어컨냉매충전,에어컨냉매,에어컨냉매가스,에어컨냉매보충,냉매보충,에어컨냉매충전가격,에어컨냉매충전비용,에어컨가스,에어컨가스충전비용,에어컨가스보충',
        'symptoms': [
            ('에어컨이 시원하지 않아요', '냉매(냉각가스)가 부족하면 냉방 효과가 크게 떨어집니다. 바람은 나오지만 시원하지 않은 경우 냉매 점검이 필요합니다.'),
            ('배관에 서리가 낍니다', '냉매 부족으로 증발기 온도가 비정상적으로 낮아지면 배관에 서리·얼음이 생깁니다. 이 상태를 방치하면 압축기 고장으로 이어집니다.'),
            ('전기는 많이 나오는데 효과가 없어요', '냉매 부족 시 압축기가 과부하 상태로 작동해 전기를 더 소모하지만 냉방 효과는 줄어듭니다.'),
            ('실외기 연결 배관에 이슬이 없어요', '정상 작동 중인 에어컨의 굵은 배관에는 이슬이 맺혀야 합니다. 이슬이 없거나 매우 건조하면 냉매 부족 신호입니다.'),
        ],
        'faqs': [
            ('냉매충전과 가스충전은 같은 말인가요?', '네, 같은 작업입니다. 에어컨 냉매는 냉각가스(가스)라고도 불리며, 냉매충전=가스충전입니다. 냉매는 에어컨이 시원한 바람을 만들어내는 핵심 물질입니다.'),
            ('냉매 충전 비용은 얼마인가요?', '냉매 종류(R-22, R-410A, R-32 등)와 에어컨 평형에 따라 다릅니다. 방문 점검 후 정확한 견적을 안내드립니다. 누설 수리가 함께 필요한 경우 추가될 수 있습니다.'),
            ('냉매를 충전하면 바로 시원해지나요?', '네, 냉매 충전 완료 후 20~30분 시운전하면 냉방이 정상으로 돌아오는 것을 바로 확인하실 수 있습니다.'),
            ('냉매 누설이 있는지 어떻게 확인하나요?', '전자식 냉매 누설 감지기로 배관 연결부, 서비스 밸브, 실내기 주변을 정밀 점검합니다. 육안으로 확인되지 않는 미세 누설도 탐지 가능합니다.'),
            ('냉매 충전 후 또 부족해지면 어쩌나요?', '냉매가 다시 부족해진다면 어딘가에서 새고 있다는 의미입니다. 누설 부위 수리 없이 충전만 반복하는 것은 임시방편입니다. 저희는 누설 확인 후 수리까지 함께 진행합니다.'),
        ]
    },
    {
        'slug': '에어컨고장',
        'title': '에어컨고장',
        'desc': '에어컨 갑작스러운 고장·이상 증상 긴급 출장 수리',
        'keywords': '에어컨고장,에어컨고장수리,에어컨갑자기꺼짐,에어컨안켜짐,에어컨전원안켜짐,에어컨실외기안돌아감,에어컨소음,에어컨물떨어짐,에어컨바람안나옴,에어컨시원하지않음,에어컨이상,에어컨긴급수리,에어컨응급,실외기소음,에어컨드레인,시스템에어컨누수,시스템에어컨누설수리,에어컨매립배관',
        'symptoms': [
            ('에어컨이 갑자기 꺼졌어요', '작동 중 갑자기 꺼지는 경우 차단기 트립, 과열 보호 작동, 기판 이상 등이 원인일 수 있습니다. 긴급 출장으로 신속하게 확인합니다.'),
            ('리모컨이 전혀 안 먹혀요', '리모컨 배터리 교체 후에도 반응이 없다면 수신부 불량이나 기판 문제일 수 있습니다. 현장에서 원인을 파악하고 수리합니다.'),
            ('에어컨에서 물이 쏟아져요', '드레인 호스 막힘이나 드레인 팬 균열로 물이 실내로 쏟아지는 경우, 가구와 전자제품을 보호하기 위해 즉시 출장이 필요합니다.'),
            ('실외기에서 큰 소음이 나요', '갑자기 커진 실외기 소음은 팬 모터 이상, 압축기 문제, 이물질 유입 등이 원인입니다. 방치하면 더 큰 고장으로 이어질 수 있습니다.'),
        ],
        'faqs': [
            ('에어컨 고장 시 긴급 당일 출장이 가능한가요?', '네, 오전 중 연락 주시면 당일 방문이 가능한 경우가 많습니다. 성수기 여름철에도 최대한 빠른 출장을 위해 노력합니다.'),
            ('에어컨 고장 원인을 전화로 알 수 있나요?', '전화 상담으로 어느 정도 원인을 추정할 수 있지만 정확한 진단은 현장 점검이 필요합니다. 불필요한 부품 교체 없이 정확한 원인 파악 후 수리합니다.'),
            ('고장 수리 후 같은 문제가 재발하면 어떻게 하나요?', '수리 후 동일 증상 재발 시 재방문하여 다시 확인합니다. 작업에 대한 책임감을 갖고 서비스합니다.'),
            ('에어컨 고장인지 단순 설정 문제인지 어떻게 아나요?', '우선 차단기 확인, 필터 청소, 실외기 주변 환기 공간 확보 등 기본 확인을 해보세요. 그래도 해결되지 않으면 전문 수리가 필요합니다.'),
            ('오래된 에어컨은 수리보다 교체가 나을까요?', '10년 이상 된 에어컨은 수리비와 교체비를 비교해보는 것이 좋습니다. 저희가 현장에서 상태를 보고 객관적으로 조언드립니다.'),
        ]
    },
]

# ─── HTML 생성 함수 ────────────────────────────────────────────────
def make_page(region, dong, service):
    r_short  = region['short']      # 안양
    r_name   = region['name']       # 안양시
    r_place  = region['place']      # 경기도 안양시
    r_code   = region['region_code']
    r_lat    = region['lat']
    r_lng    = region['lng']
    r_feat   = region['feature']
    r_traffic= region['traffic']

    d_name   = dong['name']         # 석수동
    d_lat    = dong['lat']
    d_lng    = dong['lng']
    d_feat   = dong['feature']

    svc_slug = service['slug']      # 에어컨수리
    svc_title= service['title']
    svc_desc = service['desc']
    svc_kw   = service['keywords']
    symptoms = service['symptoms']
    faqs     = service['faqs']

    phone = '010-2343-2966'
    brand = '에어컨해결사'
    site  = 'https://www.airconhelper.co.kr'

    # 파일명
    slug_raw = f"{r_short}-{d_name}-{svc_slug}"
    encoded  = urllib.parse.quote(slug_raw)
    url      = f"{site}/area/{encoded}"

    page_title    = f"{d_name} {svc_title} 당일출장 | {r_name} 전문 {brand}"
    meta_desc     = f"{r_place} {d_name} {svc_title} 전문. 찬바람 안 나옴·소음·물 떨어짐 즉시 출장. 냉매 누설 점검. 전문 기사 직접 방문 ☎{phone}"
    h1_text       = f"{d_name} {svc_title} 당일출장 전문"
    intro_text    = (
        f"{d_feat}. 에어컨해결사는 {r_short} {d_name} 지역 전문 에어컨 출장 서비스를 운영합니다. "
        f"{r_name} 전역을 담당하며 {r_traffic}으로 접근이 편리해 빠른 출장이 가능합니다. "
        f"{svc_desc} 서비스를 당일 출장으로 해결해드립니다."
    )

    # 증상 카드 HTML
    sym_cards = ""
    for sym_title, sym_body in symptoms:
        sym_cards += f"""
          <div class="sym-card">
            <h3>🔧 {sym_title}</h3>
            <p>{sym_body}</p>
          </div>"""

    # FAQ HTML + JSON-LD
    faq_html = ""
    faq_jsonld_items = []
    for i, (q, a) in enumerate(faqs):
        faq_html += f"""
          <div class="faq-item">
            <h3 class="faq-q">Q{i+1}. {q}</h3>
            <p class="faq-a">{a}</p>
          </div>"""
        faq_jsonld_items.append({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {"@type": "Answer", "text": a}
        })

    faq_jsonld = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq_jsonld_items
    }

    # LocalBusiness JSON-LD
    biz_jsonld = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": f"{brand} {d_name} {svc_title}",
        "description": meta_desc,
        "url": url,
        "telephone": phone,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": d_name,
            "addressRegion": r_name,
            "addressCountry": "KR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": d_lat,
            "longitude": d_lng
        },
        "areaServed": {
            "@type": "Place",
            "name": f"{r_place} {d_name}"
        },
        "sameAs": ["https://map.naver.com/p/entry/place/2053364866"],
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "08:00",
            "closes": "22:00"
        }
    }

    breadcrumb_jsonld = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "홈", "item": site},
            {"@type": "ListItem", "position": 2, "name": f"{r_name} 서비스", "item": f"{site}/area/{urllib.parse.quote(r_short+'-'+svc_slug)}"},
            {"@type": "ListItem", "position": 3, "name": f"{d_name} {svc_title}", "item": url}
        ]
    }

    import json
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{page_title}</title>
  <meta name="description" content="{meta_desc}" />
  <meta name="keywords" content="{d_name} {svc_title},{r_short} {d_name} {svc_title},{r_name} {d_name} {svc_title},{svc_kw}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="naver-site-verification" content="10e10edd1ef5ff973f1f9834637b9aa28cfe22f8" />
  <meta name="geo.region" content="{r_code}" />
  <meta name="geo.placename" content="{r_place} {d_name}" />
  <meta name="geo.position" content="{d_lat};{d_lng}" />
  <meta name="ICBM" content="{d_lat}, {d_lng}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{page_title}" />
  <meta property="og:description" content="{meta_desc}" />
  <meta property="og:url" content="{url}" />
  <meta property="og:site_name" content="{brand}" />
  <link rel="canonical" href="{url}" />
  <script type="application/ld+json">{json.dumps(biz_jsonld, ensure_ascii=False, indent=2)}</script>
  <script type="application/ld+json">{json.dumps(breadcrumb_jsonld, ensure_ascii=False, indent=2)}</script>
  <script type="application/ld+json">{json.dumps(faq_jsonld, ensure_ascii=False, indent=2)}</script>
  <style>
    *{{box-sizing:border-box;margin:0;padding:0}}
    body{{font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;color:#222;background:#f8f9fa;line-height:1.7}}
    a{{color:inherit;text-decoration:none}}
    .wrap{{max-width:860px;margin:0 auto;padding:0 16px}}

    /* 헤더 */
    header{{background:#1a56db;color:#fff;padding:14px 0}}
    header .wrap{{display:flex;align-items:center;justify-content:space-between;gap:12px}}
    .logo{{font-size:1.1rem;font-weight:700}}
    .hd-cta{{background:#fff;color:#1a56db;font-weight:700;padding:9px 18px;border-radius:8px;font-size:0.95rem;white-space:nowrap}}

    /* 히어로 */
    .hero{{background:linear-gradient(135deg,#1a56db 0%,#1e40af 100%);color:#fff;padding:48px 0 40px}}
    .hero h1{{font-size:clamp(1.5rem,5vw,2.1rem);font-weight:800;line-height:1.3;margin-bottom:12px}}
    .hero .sub{{font-size:1rem;opacity:.9;margin-bottom:28px}}
    .hero .badges{{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}}
    .badge{{background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.35);border-radius:20px;padding:5px 14px;font-size:.85rem}}
    .cta-box{{display:flex;flex-direction:column;gap:10px}}
    .btn-call{{display:flex;align-items:center;justify-content:center;gap:8px;background:#f59e0b;color:#fff;font-size:1.2rem;font-weight:800;padding:16px 24px;border-radius:12px;width:100%}}
    .btn-sub{{display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.4);color:#fff;font-size:.95rem;font-weight:600;padding:12px 24px;border-radius:12px;width:100%}}

    /* 섹션 공통 */
    section{{padding:36px 0}}
    .sec-title{{font-size:1.3rem;font-weight:800;margin-bottom:20px;color:#1a56db}}

    /* 지역 소개 */
    .region-box{{background:#fff;border-radius:12px;padding:20px;border-left:4px solid #1a56db;box-shadow:0 2px 8px rgba(0,0,0,.06)}}
    .region-box p{{color:#444;font-size:.97rem}}

    /* 증상 카드 */
    .sym-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}}
    .sym-card{{background:#fff;border-radius:12px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,.06);border-top:3px solid #1a56db}}
    .sym-card h3{{font-size:1rem;font-weight:700;margin-bottom:8px;color:#1e3a8a}}
    .sym-card p{{font-size:.9rem;color:#555}}

    /* 강점 */
    .strength-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}}
    .str-card{{background:#fff;border-radius:12px;padding:18px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06)}}
    .str-icon{{font-size:2rem;margin-bottom:8px}}
    .str-card h3{{font-size:.95rem;font-weight:700;margin-bottom:6px;color:#1e3a8a}}
    .str-card p{{font-size:.85rem;color:#666}}

    /* 서비스 지역 */
    .area-box{{background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.06)}}
    .area-box .dong-list{{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}}
    .dong-tag{{background:#eff6ff;color:#1a56db;padding:5px 12px;border-radius:20px;font-size:.85rem;font-weight:600}}

    /* FAQ */
    .faq-item{{background:#fff;border-radius:12px;padding:18px 20px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,.06)}}
    .faq-q{{font-size:1rem;font-weight:700;color:#1e3a8a;margin-bottom:8px}}
    .faq-a{{font-size:.92rem;color:#555}}

    /* CTA 하단 */
    .bottom-cta{{background:linear-gradient(135deg,#1a56db,#1e40af);color:#fff;padding:40px 0;text-align:center}}
    .bottom-cta h2{{font-size:1.5rem;font-weight:800;margin-bottom:8px}}
    .bottom-cta p{{opacity:.9;margin-bottom:24px}}
    .bottom-cta .btn-call{{max-width:360px;margin:0 auto 12px}}

    /* 브레드크럼 */
    .breadcrumb{{padding:12px 0;font-size:.85rem;color:#666}}
    .breadcrumb a{{color:#1a56db}}
    .breadcrumb span{{margin:0 6px}}

    /* 푸터 */
    footer{{background:#1e293b;color:#94a3b8;padding:24px 0;text-align:center;font-size:.85rem}}
    footer strong{{color:#fff}}

    @media(min-width:600px){{
      .cta-box{{flex-direction:row}}
      .btn-call,.btn-sub{{width:auto;flex:1}}
    }}
  </style>
</head>
<body>

<header>
  <div class="wrap">
    <a href="{site}" class="logo">🌀 {brand}</a>
    <a href="tel:{phone}" class="hd-cta">☎ {phone}</a>
  </div>
</header>

<div class="breadcrumb">
  <div class="wrap">
    <a href="{site}">홈</a><span>›</span>
    <a href="{site}/area/{urllib.parse.quote(r_short+'-'+svc_slug)}">{r_name} {svc_title}</a><span>›</span>
    <span>{d_name} {svc_title}</span>
  </div>
</div>

<section class="hero">
  <div class="wrap">
    <h1>{h1_text}</h1>
    <p class="sub">{r_place} {d_name} · 전문 기사 직접 방문 · 합리적 견적</p>
    <div class="badges">
      <span class="badge">✅ 당일 출장</span>
      <span class="badge">✅ 출장비 무료</span>
      <span class="badge">✅ 냉매 누설 점검</span>
      <span class="badge">✅ 모든 브랜드 가능</span>
      <span class="badge">✅ 연중무휴</span>
    </div>
    <div class="cta-box">
      <a href="tel:{phone}" class="btn-call">📞 {phone} 지금 전화</a>
      <a href="{site}" class="btn-sub">🏠 서비스 전체 보기</a>
    </div>
  </div>
</section>

<div class="wrap">

  <section>
    <p class="sec-title">📍 {d_name} 서비스 지역 안내</p>
    <div class="region-box">
      <p>{intro_text}</p>
      <div style="margin-top:14px;font-size:.9rem;color:#666">
        <strong>담당 지역:</strong> {r_name} {d_name} 및 인근 지역<br/>
        <strong>교통:</strong> {r_traffic}<br/>
        <strong>특징:</strong> {d_feat}
      </div>
    </div>
  </section>

  <section>
    <p class="sec-title">🚨 이런 증상이면 즉시 연락하세요</p>
    <div class="sym-grid">{sym_cards}
    </div>
  </section>

  <section>
    <p class="sec-title">💪 에어컨해결사를 선택하는 이유</p>
    <div class="strength-grid">
      <div class="str-card">
        <div class="str-icon">⚡</div>
        <h3>당일 출장</h3>
        <p>오전 접수 시 당일 오후 방문. 긴급 상황도 신속 대응</p>
      </div>
      <div class="str-card">
        <div class="str-icon">🔍</div>
        <h3>정확한 진단</h3>
        <p>전문 장비로 냉매 압력·누설 정밀 측정 후 정확히 수리</p>
      </div>
      <div class="str-card">
        <div class="str-icon">💰</div>
        <h3>투명한 견적</h3>
        <p>방문 전 예상 비용 안내. 동의 후 작업. 추가비용 없음</p>
      </div>
      <div class="str-card">
        <div class="str-icon">🏆</div>
        <h3>모든 브랜드</h3>
        <p>삼성·LG·캐리어·위니아·대우 등 전 브랜드·기종 대응</p>
      </div>
    </div>
  </section>

  <section>
    <p class="sec-title">🗺️ {d_name} 및 주변 서비스 지역</p>
    <div class="area-box">
      <p>{r_name} 전역 출장 가능합니다. {d_name}을 포함한 주변 동·읍 지역 모두 당일 방문합니다.</p>
      <div class="dong-list">
        {''.join(f'<span class="dong-tag">{d["name"]}</span>' for d in region['dongs'])}
      </div>
    </div>
  </section>

  <section>
    <p class="sec-title">❓ {d_name} {svc_title} 자주 묻는 질문</p>
    {faq_html}
  </section>

</div>

<div class="bottom-cta">
  <div class="wrap">
    <h2>{d_name} {svc_title}, 지금 바로 해결하세요</h2>
    <p>{r_name} {d_name} 당일 출장 · 전문 기사 직접 방문 · 합리적 견적</p>
    <a href="tel:{phone}" class="btn-call">📞 {phone} 지금 전화</a>
    <div style="opacity:.8;font-size:.9rem">연중무휴 08:00 ~ 22:00 운영</div>
  </div>
</div>

<footer>
  <div class="wrap">
    <strong>{brand}</strong> | ☎ {phone}<br/>
    {r_place} {d_name} {svc_title} 전문 당일출장<br/>
    <a href="{site}" style="color:#60a5fa">{site}</a>
  </div>
</footer>

</body>
</html>"""

# ─── 생성 실행 ─────────────────────────────────────────────────────
count = 0
errors = []
for region in REGIONS:
    for dong in region['dongs']:
        for service in SERVICES:
            try:
                html = make_page(region, dong, service)
                slug_raw = f"{region['short']}-{dong['name']}-{service['slug']}"
                encoded  = urllib.parse.quote(slug_raw)
                fname    = f"{encoded}.html"
                fpath    = os.path.join(OUT_DIR, fname)
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.write(html)
                count += 1
            except Exception as e:
                errors.append(f"{region['short']}-{dong['name']}-{service['slug']}: {e}")

print(f"✅ 생성 완료: {count}개")
if errors:
    print(f"❌ 오류: {len(errors)}개")
    for e in errors[:5]:
        print(f"  {e}")
