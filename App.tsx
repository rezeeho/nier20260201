
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Waves, ThermometerSun, Droplets, Flame, Anchor, Wind, 
  Search, Map as MapIcon, BarChart3, Info, Download, 
  Share2, Printer, MapPin, Star, Layers, ChevronDown, 
  Menu, X, ExternalLink, HelpCircle, ChevronRight,
  UserCheck, ShieldCheck, AlertCircle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Scenario, Resolution, Period, RiskData } from './types';
import { RISK_CATEGORIES, REGION_DATA } from './constants';

const App: React.FC = () => {
  // --- State ---
  const [selectedCity, setSelectedCity] = useState<string>('서울');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('강남구');
  const [selectedRiskId, setSelectedRiskId] = useState<string>('flood');
  const [scenario, setScenario] = useState<Scenario>(Scenario.SSP126);
  const [resolution, setResolution] = useState<Resolution>(Resolution.YEARLY);
  const [period, setPeriod] = useState<Period>(Period.PRESENT);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showMetadata, setShowMetadata] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [isGridOn, setIsGridOn] = useState(false);
  const [opacity, setOpacity] = useState(80);
  const [searchTab, setSearchTab] = useState<'risk' | 'place' | 'region'>('risk');

  // --- Helpers ---
  const currentRegion = useMemo(() => {
    return REGION_DATA[selectedCity]?.find(d => d.name === selectedDistrict);
  }, [selectedCity, selectedDistrict]);

  const currentRisk = useMemo(() => {
    return currentRegion?.risks.find(r => r.id === selectedRiskId) || currentRegion?.risks[0];
  }, [currentRegion, selectedRiskId]);

  const chartData = useMemo(() => {
    if (!currentRisk) return [];
    const multiplier = scenario === Scenario.SSP585 ? 1.5 : 1.0;
    return [
      { name: '2020s', value: currentRisk.trend[0] },
      { name: '2040s', value: currentRisk.trend[1] * multiplier },
      { name: '2060s', value: currentRisk.trend[2] * multiplier },
      { name: '2080s', value: currentRisk.trend[3] * multiplier },
    ];
  }, [currentRisk, scenario]);

  // --- Handlers ---
  useEffect(() => {
    const saved = localStorage.getItem('climate-favs');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (riskId: string) => {
    setFavorites(prev => {
      let next;
      if (prev.includes(riskId)) {
        next = prev.filter(id => id !== riskId);
      } else {
        if (prev.length >= 6) {
          alert('즐겨찾기는 최대 6개까지만 가능합니다.');
          return prev;
        }
        next = [...prev, riskId];
      }
      localStorage.setItem('climate-favs', JSON.stringify(next));
      return next;
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}?city=${selectedCity}&district=${selectedDistrict}&risk=${selectedRiskId}`;
    navigator.clipboard.writeText(url);
    alert('현재 설정 링크가 클립보드에 복사되었습니다.');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (format: string) => {
    alert(`${format} 형식으로 데이터 다운로드를 시작합니다 (더미)`);
  };

  const handleOfficialLogin = () => {
    alert('공무원 로그인 모달: 소속 기관(G-Cloud) 인증 후 관할 구역 대시보드로 진입합니다.');
  };

  // --- Components ---
  const IconComponent = ({ name, className }: { name: string, className?: string }) => {
    switch (name) {
      case 'Waves': return <Waves className={className} />;
      case 'ThermometerSun': return <ThermometerSun className={className} />;
      case 'Droplets': return <Droplets className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Anchor': return <Anchor className={className} />;
      case 'Wind': return <Wind className={className} />;
      default: return <Info className={className} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 no-print">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" />
              <span className="hidden sm:inline">국가 기후위기 적응정보 통합플랫폼</span>
              <span className="sm:hidden">기후적응플랫폼</span>
            </h1>
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
              <a href="#" className="hover:text-blue-600">서비스 소개</a>
              <a href="#" className="text-blue-600 border-b-2 border-blue-600 py-5">대시보드</a>
              <a href="#" className="hover:text-blue-600">데이터 신청</a>
              <a href="#" className="hover:text-blue-600">이용안내</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleOfficialLogin}
              className="px-4 py-2 bg-blue-700 text-white rounded text-sm font-semibold flex items-center gap-2 hover:bg-blue-800 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              공무원 로그인
            </button>
            <button className="lg:hidden p-2 text-gray-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        {/* News Strip */}
        <div className="bg-gray-100 border-b overflow-hidden hidden md:block">
          <div className="max-w-[1200px] mx-auto px-4 h-10 flex items-center gap-4 text-xs">
            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">기상속보</span>
            <div className="flex-1 overflow-hidden">
              <p className="animate-pulse">대기 불안정으로 인한 일부 지역 국지성 호우 주의 (2026-01-01 14:00 기준)</p>
            </div>
            <div className="flex gap-4 text-gray-500">
              <span>폭염주의보: 서울, 경기</span>
              <span>풍랑주의보: 제주 해상</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] mx-auto px-4 py-8 space-y-12">
        {/* Section 1: Hero */}
        <section className="bg-white rounded-2xl border p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center no-print">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              우리 동네 <span className="text-blue-700">기후 리스크</span>,<br />
              과학적 데이터로 미리 보세요.
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-lg">
              범부처 적응정보를 표준화하여 정밀 지도를 제공합니다.<br />
              SSP 시나리오 기반의 미래 전망 지표를 지금 확인하세요.
            </p>
            
            {/* Search Area */}
            <div className="space-y-4">
              <div className="flex gap-2 text-sm border-b w-fit">
                {(['risk', 'place', 'region'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setSearchTab(tab)}
                    className={`px-4 py-2 font-medium ${searchTab === tab ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {tab === 'risk' ? '리스크' : tab === 'place' ? '장소' : '지역'}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <select 
                  value={selectedCity} 
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedDistrict(Object.keys(REGION_DATA[e.target.value] || {})[0] || '');
                  }}
                  className="px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-40"
                >
                  {Object.keys(REGION_DATA).map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                <select 
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-48"
                >
                  {REGION_DATA[selectedCity]?.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
                <button className="px-6 py-3 bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-800 flex-grow sm:flex-grow-0">
                  <MapPin className="w-5 h-5" />
                  내 지역 리스크 보기
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                기준일: 2026-01-01
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                출처: 환경부/기상청 연계
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                갱신: 연 1회 표준 갱신
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-6 border flex flex-col gap-4">
             <div className="text-center space-y-2 mb-2">
                <h4 className="font-bold">분석 대시보드 진입</h4>
                <p className="text-xs text-gray-500 italic">로그인 여부에 따라 서비스 범위가 다릅니다.</p>
             </div>
             <button className="w-full py-4 border-2 border-blue-600 text-blue-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50">
               대국민 대시보드 <ChevronRight className="w-4 h-4" />
             </button>
             <button 
              onClick={handleOfficialLogin}
              className="w-full py-4 bg-gray-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all"
             >
               공무원 대시보드 (로그인) <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </section>

        {/* Section 2: Top 3 Risks */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
              {selectedDistrict} 기후리스크 TOP 3
            </h3>
            <span className="text-sm text-gray-500">{selectedCity} {selectedDistrict} 중심 과학 분석 데이터</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentRegion?.risks.map((risk, idx) => (
              <div 
                key={risk.id}
                onClick={() => setSelectedRiskId(risk.id)}
                className={`group relative bg-white border rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg ${selectedRiskId === risk.id ? 'border-blue-600 ring-1 ring-blue-600 shadow-md' : 'hover:border-blue-300'}`}
              >
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-lg ${selectedRiskId === risk.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      <IconComponent name={RISK_CATEGORIES.find(c => c.id === risk.id)?.icon || ''} className="w-6 h-6" />
                   </div>
                   <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(risk.id); }}
                    className={`p-2 rounded-full transition-colors ${favorites.includes(risk.id) ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
                   >
                     <Star className="w-5 h-5" fill={favorites.includes(risk.id) ? "currentColor" : "none"} />
                   </button>
                </div>
                <div className="space-y-1 mb-4">
                  <h4 className="font-bold text-lg">{risk.name}</h4>
                  <p className="text-2xl font-black text-blue-900">{risk.value} <span className="text-sm font-normal text-gray-500">{risk.unit}</span></p>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-6">
                  {risk.insight}
                </p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Info className="w-3 h-3" />
                    {risk.provider} | {risk.refDate}
                  </div>
                  <button className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:underline">
                    상세분석 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Map Analysis Portal (The Core) */}
        <section className="bg-white border rounded-2xl overflow-hidden shadow-sm no-print">
          <div className="bg-gray-800 text-white p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Scenario Toggle */}
              <div className="flex items-center bg-gray-700 rounded-lg p-1">
                <button 
                  onClick={() => setScenario(Scenario.SSP126)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${scenario === Scenario.SSP126 ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                >
                  저탄소
                </button>
                <button 
                  onClick={() => setScenario(Scenario.SSP585)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${scenario === Scenario.SSP585 ? 'bg-red-600' : 'hover:bg-gray-600'}`}
                >
                  고탄소
                </button>
                <button title="SSP 시나리오란?" className="px-2 text-gray-400 hover:text-white">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              {/* Time Resolution */}
              <div className="flex items-center bg-gray-700 rounded-lg p-1">
                {(Object.values(Resolution) as Resolution[]).map(res => (
                  <button 
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold ${resolution === res ? 'bg-gray-500 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    {res}
                  </button>
                ))}
              </div>

              {/* Period Dropdown */}
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="bg-gray-700 text-white text-xs px-3 py-2 rounded-lg outline-none border-none ring-1 ring-gray-600"
              >
                {Object.values(Period).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleDownload('CSV')}
                className="p-2 hover:bg-gray-700 rounded text-gray-300" title="CSV 다운로드"
              >
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded text-gray-300" title="메타데이터" onClick={() => setShowMetadata(!showMetadata)}>
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row min-h-[500px]">
            {/* Map Area (LHS) */}
            <div className="flex-1 relative bg-gray-200 overflow-hidden group">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2 opacity-30 select-none">
                  <MapIcon className="w-24 h-24 mx-auto" />
                  <p className="font-bold text-xl">{selectedCity} {selectedDistrict} 분석 지도</p>
                  <p className="text-sm">격자해상도: 1km / 데이터 오버레이 활성화 중</p>
                </div>
                {/* Simulated Grid Overlay */}
                {isGridOn && (
                  <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                    backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }}></div>
                )}
                {/* Simulated Risk Overlay (Blue/Red circle) */}
                <div 
                  className={`absolute w-96 h-96 rounded-full blur-3xl transition-all duration-700 ${scenario === Scenario.SSP585 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ opacity: opacity / 100 }}
                ></div>
              </div>

              {/* Category Chips (SafeMap Style) */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {RISK_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedRiskId(cat.id)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-full shadow-lg border transition-all ${selectedRiskId === cat.id ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                  >
                    <IconComponent name={cat.icon} className="w-4 h-4" />
                    <span className="text-sm font-bold">{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Utility Floating Buttons (SafeMap Style) */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                {[
                  { id: 'loc', icon: MapPin, title: '내 위치' },
                  { id: 'share', icon: Share2, title: '공유', action: handleShare },
                  { id: 'legend', icon: Layers, title: '범례', action: () => setShowLegend(!showLegend) },
                  { id: 'print', icon: Printer, title: '인쇄', action: handlePrint },
                  { id: 'measure', icon: BarChart3, title: '측정' },
                ].map(tool => (
                  <button
                    key={tool.id}
                    onClick={tool.action}
                    title={tool.title}
                    className="p-3 bg-white rounded-lg shadow-md hover:bg-gray-50 border border-gray-200 text-gray-600 transition-all"
                  >
                    <tool.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>

              {/* Legend Panel */}
              {showLegend && (
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl border shadow-lg z-10 min-w-[200px]">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-bold text-gray-500">범례: {currentRisk?.name}</h5>
                    <div className="flex bg-gray-100 rounded p-0.5">
                      <button className="text-[10px] px-2 py-0.5 bg-white rounded shadow-sm font-bold">절대</button>
                      <button className="text-[10px] px-2 py-0.5 text-gray-400">상대</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded-full bg-gradient-to-r from-blue-100 via-blue-500 to-blue-900"></div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                      <span>최소 (0.0)</span>
                      <span>중간</span>
                      <span>최대 (100.0)</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">투명도</span>
                      <input 
                        type="range" min="0" max="100" value={opacity} 
                        onChange={(e) => setOpacity(parseInt(e.target.value))}
                        className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={isGridOn} onChange={() => setIsGridOn(!isGridOn)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                      <span className="text-xs text-gray-600">격자(Grid) 표시</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Metadata Overlay Panel */}
              {showMetadata && currentRisk && (
                <div className="absolute inset-0 bg-white/90 z-20 flex items-center justify-center p-8 overflow-y-auto">
                  <div className="max-w-md w-full bg-white border rounded-2xl shadow-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-bold text-lg flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        주제도 메타데이터
                      </h4>
                      <button onClick={() => setShowMetadata(false)}><X className="w-6 h-6" /></button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 rounded">
                          <p className="text-xs text-gray-400 mb-1">데이터 범위</p>
                          <p className="font-bold">{currentRisk.range}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <p className="text-xs text-gray-400 mb-1">기준일</p>
                          <p className="font-bold">{currentRisk.refDate}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <p className="text-xs text-gray-400 mb-1">최종 갱신일</p>
                          <p className="font-bold">2026-05-20 (정기)</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <p className="text-xs text-gray-400 mb-1">제공 기관</p>
                          <p className="font-bold">{currentRisk.provider}</p>
                        </div>
                      </div>
                      <div className="p-4 border-l-4 border-blue-500 bg-blue-50 text-xs text-blue-800 space-y-2">
                        <p><strong>산정 기준:</strong> IPCC 6차 보고서 SSP 시나리오 및 고해상도 시나리오 연계 분석</p>
                        <p><strong>참고 사항:</strong> 본 데이터는 국가 표준 시나리오를 바탕으로 가공되었으며, 지자체 적응 대책 수립의 근거 데이터로 활용됩니다.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowMetadata(false)}
                      className="w-full mt-6 py-3 bg-blue-700 text-white rounded-lg font-bold"
                    >
                      확인 완료
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Data (RHS) */}
            <div className="w-full lg:w-[400px] border-l bg-white p-6 flex flex-col">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">시뮬레이션</span>
                  <h4 className="font-bold text-gray-800">미래 전망 차트</h4>
                </div>
                <div className="h-48 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={scenario === Scenario.SSP585 ? "#ef4444" : "#3b82f6"} stopOpacity={0.1}/>
                          <stop offset="95%" stopColor={scenario === Scenario.SSP585 ? "#ef4444" : "#3b82f6"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Area type="monotone" dataKey="value" stroke={scenario === Scenario.SSP585 ? "#ef4444" : "#3b82f6"} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h5 className="text-sm font-bold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    분석 결과 요약
                  </h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    선택하신 <strong className="text-gray-900">{selectedDistrict}</strong> 지역의 
                    <strong className="text-gray-900"> {period}</strong> 기준 
                    <strong className="text-gray-900"> {currentRisk?.name}</strong> 리스크는 
                    {scenario === Scenario.SSP585 ? 
                      <span className="text-red-600 font-bold"> "고탄소 시나리오 적용 시 급격한 증가세"</span> : 
                      <span className="text-blue-600 font-bold"> "완만한 증가세 유지"</span>
                    }를 보입니다. 
                    후반기에는 현재 대비 약 {(chartData[3]?.value / chartData[0]?.value * 100 - 100).toFixed(0)}% 가량 변동이 예상됩니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">권장 적응 조치</h5>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      배수 시설 인프라 노후도 정밀 진단
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      취약 계층 거주 지역 대피 경로 표준화
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t space-y-3">
                <button className="w-full py-3 bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-800">
                  <BarChart3 className="w-4 h-4" />
                  정밀 대시보드 바로가기
                </button>
                <div className="flex gap-2">
                   <button onClick={() => handleDownload('PNG')} className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 font-medium">지도 저장 (PNG)</button>
                   <button onClick={() => handleDownload('CSV')} className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 font-medium">데이터 (CSV)</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: User Split Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 no-print">
          <div className="bg-white border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-6">
              <UserCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">대국민 대시보드</h3>
            <p className="text-gray-600 mb-8 h-12">기후 리스크를 이해하고 대비하는 일반 시민과 기업을 위한 맞춤형 정보를 제공합니다.</p>
            <ul className="space-y-3 mb-8 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-500" />
                우리 동네 위험 요소 직관적 시각화
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-500" />
                재난 유형별 행동 요령 안내
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-500" />
                관심 지역 리스크 알림 서비스
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-500" />
                적응 정보 지식인(Glossary) 제공
              </li>
            </ul>
            <button className="w-full py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              시민용 대시보드 진입
            </button>
          </div>
          <div className="bg-gray-900 text-white rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">공무원 대시보드</h3>
            <p className="text-gray-300 mb-8 h-12">정책 수립 및 의사결정을 지원하는 고해상도 격자 데이터 및 분석 리포트를 제공합니다.</p>
            <ul className="space-y-3 mb-8 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-500" />
                관할 구역별 취약도 정밀 분석 툴
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-500" />
                부처별 적응 대책 성과 모니터링
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-500" />
                Raw 데이터(GIS/Grid) 직접 다운로드
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-500" />
                적응 정보 공유 플랫폼(협업룸)
              </li>
            </ul>
            <button 
              onClick={handleOfficialLogin}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors"
            >
              업무용 대시보드 로그인
            </button>
          </div>
        </section>

        {/* Section 5: Data Reliability */}
        <section className="bg-gray-50 border rounded-2xl p-10 no-print">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-2xl font-bold">데이터는 어디서 오나요?</h3>
            <p className="text-gray-600">
              국가 기후위기 적응정보 통합플랫폼은 환경부, 기상청, 국립환경과학원 등 전문 부처의 검증된 과학 데이터를 통합하여 
              표준 가이드라인에 따라 산출한 신뢰도 높은 정보만을 제공합니다.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
              <a href="#" className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border hover:border-blue-400 group transition-all">
                <span className="text-xs font-bold text-gray-400 group-hover:text-blue-500">데이터 기준일</span>
                <span className="font-bold text-gray-800">2026.01.01</span>
              </a>
              <a href="#" className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border hover:border-blue-400 group transition-all">
                <span className="text-xs font-bold text-gray-400 group-hover:text-blue-500">갱신 주기</span>
                <span className="font-bold text-gray-800">연간/분기</span>
              </a>
              <a href="#" className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border hover:border-blue-400 group transition-all">
                <span className="text-xs font-bold text-gray-400 group-hover:text-blue-500">해상도</span>
                <span className="font-bold text-gray-800">1km ~ 시군구</span>
              </a>
              <a href="#" className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border hover:border-blue-400 group transition-all">
                <span className="text-xs font-bold text-gray-400 group-hover:text-blue-500">가공 기준</span>
                <span className="font-bold text-gray-800">SSP v6.0</span>
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-2 bg-white border rounded-full text-sm font-bold hover:bg-gray-100">데이터 출처 확인</button>
              <button className="px-6 py-2 bg-white border rounded-full text-sm font-bold hover:bg-gray-100">전문 용어집</button>
              <button className="px-6 py-2 bg-white border rounded-full text-sm font-bold hover:bg-gray-100">자주 묻는 질문(FAQ)</button>
            </div>
          </div>
        </section>

        {/* Section 6: Onboarding */}
        <section className="text-center space-y-8 no-print">
          <h3 className="text-xl font-bold">3분 사용법: 리스크 확인하기</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-3 max-w-[200px]">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">1</div>
              <p className="font-bold">지역 선택</p>
              <p className="text-xs text-gray-500">살고 계신 지역이나 관심 지역을 선택하세요.</p>
            </div>
            <ChevronRight className="hidden md:block w-6 h-6 text-gray-300" />
            <div className="flex flex-col items-center gap-3 max-w-[200px]">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">2</div>
              <p className="font-bold">리스크 유형 선택</p>
              <p className="text-xs text-gray-500">폭염, 침수 등 확인하고 싶은 주제를 선택하세요.</p>
            </div>
            <ChevronRight className="hidden md:block w-6 h-6 text-gray-300" />
            <div className="flex flex-col items-center gap-3 max-w-[200px]">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">3</div>
              <p className="font-bold">지도 및 차트 해석</p>
              <p className="text-xs text-gray-500">미래 전망과 대응 방안 데이터를 분석합니다.</p>
            </div>
          </div>
          <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors">
            상세 튜토리얼 보기
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12 text-gray-500 no-print">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800">국가 기후위기 적응정보 통합플랫폼</h2>
              <p className="text-sm">부처 간 기후적응 정보를 통합하여 과학적 대응 체계를 구축합니다.</p>
              <div className="flex gap-4 text-xs">
                <a href="#" className="hover:underline">이용약관</a>
                <a href="#" className="hover:underline font-bold text-gray-700">개인정보처리방침</a>
                <a href="#" className="hover:underline">웹 접근성 정책</a>
                <a href="#" className="hover:underline">문의하기</a>
              </div>
            </div>
            <div className="flex gap-12">
              <div className="space-y-2">
                <p className="font-bold text-gray-700 text-sm">연계기관</p>
                <ul className="text-xs space-y-1">
                  <li><a href="#" className="hover:underline">환경부</a></li>
                  <li><a href="#" className="hover:underline">기상청</a></li>
                  <li><a href="#" className="hover:underline">행정안전부</a></li>
                  <li><a href="#" className="hover:underline">산림청</a></li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-gray-700 text-sm">고객지원</p>
                <p className="text-xs">대표번호: 00-000-0000</p>
                <p className="text-xs">이메일: support@climate.go.kr</p>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[10px]">
            <p>© 2026 National Climate Crisis Adaptation Platform. All rights reserved.</p>
            <div className="flex gap-4">
              <img src="https://picsum.photos/120/40?grayscale&random=1" alt="정부기관 로고" className="h-8 opacity-50 grayscale" />
              <img src="https://picsum.photos/120/40?grayscale&random=2" alt="적용기관 로고" className="h-8 opacity-50 grayscale" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
