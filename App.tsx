
import React, { useState, useEffect } from 'react';
import SolarSystem from './components/SolarSystem';
import { Gauge, Ruler, List, ChevronRight, Globe, Moon as MoonIcon, Search, Zap, Sun as SunIcon } from 'lucide-react';
import { PLANETS } from './constants';

const App: React.FC = () => {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [distanceMultiplier, setDistanceMultiplier] = useState(1);
  const [bloomIntensity, setBloomIntensity] = useState(1.5);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (focusedId) setShowWelcome(false);
  }, [focusedId]);

  const handleSelect = (id: string | null, type: 'planet' | 'moon') => {
    setFocusedId(id);
  };

  const filteredPlanets = PLANETS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.moons?.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const calculateKSD = (units: number) => ((units * distanceMultiplier * 4.3) / 1000).toFixed(3);
  const systemScaleKSD = calculateKSD(25); 

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden selection:bg-cyan-500/30 font-inter text-white">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <SolarSystem 
          focusedId={focusedId} 
          onSelect={handleSelect} 
          timeMultiplier={timeMultiplier}
          distanceMultiplier={distanceMultiplier}
          bloomIntensity={bloomIntensity}
        />
      </div>

      {/* Navigation & Header */}
      <div className="absolute top-10 left-10 z-10 pointer-events-none transition-all duration-1000">
        <h1 className="text-white font-orbitron text-4xl md:text-5xl font-black tracking-tighter leading-none mb-2 drop-shadow-2xl animate-in slide-in-from-left duration-700">
          CELESTIAL<br/>JOURNEY<span className="text-cyan-500 animate-pulse">_</span>
        </h1>
        <p className="text-white/30 text-[9px] font-bold tracking-[0.5em] uppercase opacity-70 animate-in fade-in duration-1000 delay-300">
          Deep Space Visualization Engine v7.0
        </p>
      </div>

      {/* Unified Sidebar Container (Top Right) */}
      <div className="absolute top-10 right-10 z-30 flex flex-col gap-4 animate-in slide-in-from-right duration-700 max-h-[calc(100vh-80px)] w-80">
        
        {/* Control Panels */}
        <div onWheel={(e) => e.stopPropagation()} className="flex flex-col gap-3">
          <div className="bg-black/40 p-5 rounded-3xl border border-white/5 backdrop-blur-2xl shadow-2xl hover:border-white/20 transition-all duration-500 group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-white/60 group-hover:text-cyan-400 transition-colors">
                <Gauge size={14} />
                <span className="text-[9px] font-bold tracking-widest uppercase">Время</span>
              </div>
              <span className="text-cyan-400 font-orbitron text-xs font-bold">{timeMultiplier.toFixed(1)}x</span>
            </div>
            <input 
              type="range" min="0" max="10" step="0.1" value={timeMultiplier} 
              onChange={(e) => setTimeMultiplier(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500 transition-all"
            />
          </div>

          <div className="bg-black/40 p-5 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl hover:border-white/20 transition-all duration-500 group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white/60 group-hover:text-amber-400 transition-colors">
                <Ruler size={14} />
                <span className="text-[9px] font-bold tracking-widest uppercase">Масштаб</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-amber-400 font-orbitron text-[10px] font-bold">{systemScaleKSD} kD⊙</span>
                <span className="text-white/20 text-[7px] font-medium tracking-tighter uppercase whitespace-nowrap">тыс. диаметров (1 AU)</span>
              </div>
            </div>
            <input 
              type="range" min="0.1" max="5" step="0.05" value={distanceMultiplier} 
              onChange={(e) => setDistanceMultiplier(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500 transition-all"
            />
          </div>

          <div className="bg-black/40 p-5 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl hover:border-white/20 transition-all duration-500 group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white/60 group-hover:text-indigo-400 transition-colors">
                <SunIcon size={14} />
                <span className="text-[9px] font-bold tracking-widest uppercase">Свечение (Bloom)</span>
              </div>
              <span className="text-indigo-400 font-orbitron text-xs font-bold">{bloomIntensity.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="0" max="5" step="0.1" value={bloomIntensity} 
              onChange={(e) => setBloomIntensity(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all"
            />
          </div>
        </div>

        <div 
          onWheel={(e) => e.stopPropagation()}
          className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-[0_40px_120px_rgba(0,0,0,0.9)] flex-1 min-h-0"
        >
           <div className="p-8 pb-0">
              <div className="relative mb-6">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="ПОИСК..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-[11px] text-white font-bold tracking-widest focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/20"
                />
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-8 pt-2 space-y-3 custom-scrollbar">
              {filteredPlanets.map(planet => (
                <div key={planet.id} className="space-y-1.5 animate-in slide-in-from-bottom-2 duration-500">
                  <button 
                    onClick={() => handleSelect(planet.id, 'planet')}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 group ${focusedId === planet.id ? 'bg-cyan-500/20 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10' : 'bg-white/5 border-transparent text-white/50 hover:bg-white/10 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-4">
                      <Globe size={16} style={{ color: planet.color }} />
                      <span className="text-[11px] font-black tracking-widest uppercase">{planet.name}</span>
                    </div>
                    <ChevronRight size={14} className={`transition-all duration-500 ${focusedId === planet.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                  </button>
                  
                  {planet.moons && focusedId === planet.id && (
                    <div className="pl-8 space-y-1 border-l-2 border-white/5 ml-5">
                       {planet.moons.map(moon => (
                          <button 
                            key={moon.id}
                            onClick={() => handleSelect(moon.id, 'moon')}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${focusedId === moon.id ? 'text-amber-400 bg-amber-400/10' : 'text-white/20 hover:text-white/40'}`}
                          >
                            <div className="flex items-center gap-3">
                              <MoonIcon size={12} />
                              {moon.name}
                            </div>
                          </button>
                       ))}
                    </div>
                  )}
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Welcome Screen Overlay (No Blur as requested) */}
      {showWelcome && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 transition-all duration-1000">
          <div className="max-w-2xl text-center p-12 bg-black/60 rounded-[40px] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-700">
             <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black tracking-widest uppercase mb-8">
               <Zap size={12} />
               Telemetry Active
             </div>
             <h2 className="text-5xl font-orbitron font-black text-white tracking-tighter mb-6 leading-tight uppercase">
               Исследуйте<br/>границы возможного
             </h2>
             <p className="text-white/40 text-sm font-medium leading-relaxed mb-10 max-w-md mx-auto">
               Система телеметрии и трассировки объектов активирована. Добро пожаловать.
             </p>
             <button 
               onClick={() => setShowWelcome(false)}
               className="group flex items-center gap-4 mx-auto px-8 py-4 bg-white text-black font-black text-xs tracking-[0.2em] uppercase rounded-2xl hover:bg-cyan-500 hover:text-white transition-all duration-500 shadow-xl"
             >
               Начать миссию
               <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      )}

      {/* Global Style Updates */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }
        input[type='range'] { -webkit-appearance: none; background: transparent; }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 14px; width: 14px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
          margin-top: -5px;
          box-shadow: 0 0 15px currentColor;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        input[type='range']:active::-webkit-slider-thumb { transform: scale(1.4); }
        input[type='range']::-webkit-slider-runnable-track {
          width: 100%; height: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
          transition: background 0.3s;
        }
      `}</style>
    </div>
  );
};

export default App;
