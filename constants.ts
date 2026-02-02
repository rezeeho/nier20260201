
import { Scenario, Resolution, Period, RegionInfo } from './types';

export const RISK_CATEGORIES = [
  { id: 'flood', name: '침수·호우', icon: 'Waves' },
  { id: 'heat', name: '폭염', icon: 'ThermometerSun' },
  { id: 'drought', name: '가뭄', icon: 'Droplets' },
  { id: 'fire', name: '산불', icon: 'Flame' },
  { id: 'sea', name: '해수면', icon: 'Anchor' },
  { id: 'surge', name: '해일', icon: 'Wind' },
];

export const REGION_DATA: Record<string, RegionInfo[]> = {
  '서울': [
    {
      id: 'seoul-gangnam',
      name: '강남구',
      risks: [
        { id: 'flood', name: '침수·호우', value: '42.5', unit: 'mm/hr', insight: '강우 강도 집중 시 저지대 침수 리스크가 매우 높습니다.', refDate: '2026-01-01', updateCycle: '1년', provider: '환경부', range: '격자단위(1km)', trend: [10, 15, 25, 42] },
        { id: 'heat', name: '폭염', value: '31', unit: '일', insight: '도시열섬 현상으로 야간 열대야 지속 시간이 증가 중입니다.', refDate: '2026-01-01', updateCycle: '1년', provider: '기상청', range: '시군구', trend: [20, 22, 28, 31] },
        { id: 'fire', name: '산불', value: '보통', unit: '지수', insight: '도심지 내 녹지대 관리 및 산책로 실화 주의가 필요합니다.', refDate: '2026-01-01', updateCycle: '분기', provider: '산림청', range: '격자단위', trend: [5, 4, 6, 5] },
      ]
    },
    {
      id: 'seoul-mapo',
      name: '마포구',
      risks: [
        { id: 'flood', name: '침수·호우', value: '38.2', unit: 'mm/hr', insight: '한강 인접 지대의 배수 펌프장 가동 효율 점검이 권장됩니다.', refDate: '2026-01-01', updateCycle: '1년', provider: '환경부', range: '격자단위', trend: [12, 18, 30, 38] },
        { id: 'heat', name: '폭염', value: '29', unit: '일', insight: '평균 기온이 10년 전 대비 1.2도 상승하여 취약계층 보호가 필요합니다.', refDate: '2026-01-01', updateCycle: '1년', provider: '기상청', range: '시군구', trend: [18, 20, 25, 29] },
        { id: 'drought', name: '가뭄', value: '관심', unit: '단계', insight: '생활용수 공급은 안정적이나 녹지 용수 절약이 필요합니다.', refDate: '2026-01-01', updateCycle: '월간', provider: '수자원공사', range: '시군구', trend: [2, 3, 3, 4] },
      ]
    }
  ],
  '부산': [
    {
      id: 'busan-haeundae',
      name: '해운대구',
      risks: [
        { id: 'sea', name: '해수면', value: '15.4', unit: 'cm', insight: '해수면 상승으로 만조 시 해안도로 월파 위험이 증대됩니다.', refDate: '2026-01-01', updateCycle: '5년', provider: '해양수산부', range: '해안선', trend: [5, 8, 12, 15] },
        { id: 'surge', name: '해일', value: '주의', unit: '단계', insight: '태풍 상륙 시 폭풍해일 피해 가능성에 대비가 필요합니다.', refDate: '2026-01-01', updateCycle: '실시간연계', provider: '기상청', range: '격자단위', trend: [3, 5, 7, 8] },
        { id: 'heat', name: '폭염', value: '25', unit: '일', insight: '해안 기온 완화 효과가 있으나 습도로 인한 불쾌지수가 높습니다.', refDate: '2026-01-01', updateCycle: '1년', provider: '기상청', range: '시군구', trend: [15, 18, 22, 25] },
      ]
    }
  ]
};
