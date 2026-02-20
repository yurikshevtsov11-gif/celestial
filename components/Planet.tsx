
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring, Html, Trail } from '@react-three/drei';
import { ChevronDown, Info, ExternalLink, X, Activity, Minus, Maximize2 } from 'lucide-react';
import * as THREE from 'three';
import { PlanetData, MoonData } from '../types';

interface MoonProps {
  data: MoonData;
  timeMultiplier: number;
  isDimmed: boolean;
  isFocused: boolean;
  onSelect: (id: string, type: 'moon') => void;
}

const Moon: React.FC<MoonProps> = ({ data, timeMultiplier, isDimmed, isFocused, onSelect }) => {
  const moonRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const orbitRef = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    const effectiveDelta = delta * timeMultiplier;
    orbitRef.current += effectiveDelta * data.orbitSpeed * 2.5;
    
    groupRef.current.position.x = Math.cos(orbitRef.current) * data.distance;
    groupRef.current.position.z = Math.sin(orbitRef.current) * data.distance;
    moonRef.current.rotation.y += effectiveDelta * 0.5;
  });

  return (
    <group ref={groupRef} name={`group-${data.id}`}>
      <Trail 
        width={0.2} 
        length={4} 
        color={new THREE.Color(data.color)} 
        attenuation={(t) => t * t}
      >
        <Sphere 
          ref={moonRef} 
          args={[data.radius, 16, 16]} 
          castShadow 
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            onSelect(data.id, 'moon');
          }}
        >
          <meshStandardMaterial 
            color={data.color} 
            roughness={0.9} 
            metalness={0.1} 
            opacity={isDimmed && !isFocused ? 0.3 : 1}
            transparent={isDimmed}
            emissive={isFocused ? data.color : '#000000'}
            emissiveIntensity={isFocused ? 0.5 : 0}
          />
        </Sphere>
      </Trail>
    </group>
  );
};

interface PlanetProps {
  data: PlanetData;
  isSelected: boolean;
  focusedId: string | null;
  onSelect: (id: string | null, type: 'planet' | 'moon') => void;
  timeMultiplier: number;
  distanceMultiplier: number;
  isDimmed: boolean;
}

const Planet: React.FC<PlanetProps> = ({ data, isSelected, onSelect, timeMultiplier, distanceMultiplier, isDimmed, focusedId }) => {
  const planetRef = useRef<THREE.Mesh>(null!);
  const atmosRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const orbitAngle = useRef(Math.random() * Math.PI * 2);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dragging logic for the info panel
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isSelected) {
      setIsCollapsed(false);
      setDragOffset({ x: 0, y: 0 }); // Reset position when newly selected
    }
  }, [isSelected]);

  const onHeaderMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setDragOffset({
          x: e.clientX - dragStartPos.current.x,
          y: e.clientY - dragStartPos.current.y
        });
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const surfaceTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = data.color;
    ctx.fillRect(0, 0, 1024, 512);
    
    switch(data.id) {
      case 'mercury':
        for (let i = 0; i < 2000; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)';
          ctx.beginPath(); ctx.arc(Math.random()*1024, Math.random()*512, Math.random()*3, 0, Math.PI*2); ctx.fill();
        }
        break;
      case 'earth':
        ctx.fillStyle = '#0a3a6b'; ctx.fillRect(0, 0, 1024, 512);
        for (let i = 0; i < 30; i++) {
          ctx.fillStyle = Math.random() > 0.3 ? '#2d5a27' : '#5c4033';
          ctx.beginPath(); ctx.ellipse(Math.random()*1024, Math.random()*512, Math.random()*150+50, Math.random()*100+30, Math.random()*Math.PI, 0, Math.PI*2); ctx.fill();
        }
        break;
      case 'jupiter':
        for (let i = 0; i < 25; i++) {
          ctx.fillStyle = i % 2 === 0 ? 'rgba(100, 50, 30, 0.4)' : 'rgba(220, 190, 160, 0.3)';
          ctx.fillRect(0, Math.random()*512, 1024, Math.random()*30+5);
        }
        break;
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }, [data.id, data.color]);

  useFrame((state, delta) => {
    const effectiveDelta = delta * timeMultiplier;
    orbitAngle.current += effectiveDelta * data.orbitSpeed * 1.5;
    
    const targetX = Math.cos(orbitAngle.current) * data.distance * distanceMultiplier;
    const targetZ = Math.sin(orbitAngle.current) * data.distance * distanceMultiplier;
    
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.1);
    
    planetRef.current.rotation.y += effectiveDelta * data.rotationSpeed * 5;
    if (atmosRef.current) atmosRef.current.rotation.y += effectiveDelta * data.rotationSpeed * 6;
  });

  const hasAtmosphere = data.id !== 'mercury' && data.id !== 'saturn'; 

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[(data.distance * distanceMultiplier) - 0.05, (data.distance * distanceMultiplier) + 0.05, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={isDimmed ? 0.01 : 0.05} side={THREE.DoubleSide} />
      </mesh>

      <group ref={groupRef} name={`group-${data.id}`}>
        {data.moons?.map((moon) => (
          <mesh key={`orbit-${moon.id}`} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[moon.distance - 0.005, moon.distance + 0.005, 64]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={isDimmed ? 0.002 : 0.03} side={THREE.DoubleSide} />
          </mesh>
        ))}

        <Trail 
          width={0.6} 
          length={6} 
          color={new THREE.Color(data.color)} 
          attenuation={(t) => t * t}
        >
          <Sphere
            ref={planetRef}
            args={[data.radius, 64, 64]}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(data.id, 'planet');
            }}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial 
              map={surfaceTexture}
              roughness={0.8} metalness={0.1} 
              emissive={isSelected ? data.color : '#000000'}
              emissiveIntensity={isSelected ? 0.3 : 0}
              opacity={isDimmed && !isSelected ? 0.4 : 1}
              transparent={isDimmed}
            />
          </Sphere>
        </Trail>

        {data.moons?.map((moon) => (
          <Moon 
            key={moon.id} 
            data={moon} 
            timeMultiplier={timeMultiplier} 
            isDimmed={isDimmed}
            isFocused={focusedId === moon.id}
            onSelect={onSelect}
          />
        ))}

        {hasAtmosphere && (
          <Sphere ref={atmosRef} args={[data.radius * 1.04, 64, 64]}>
            <meshStandardMaterial 
              color={data.id === 'earth' ? '#6ebfff' : data.id === 'venus' ? '#ffe1a8' : data.color}
              transparent opacity={isDimmed ? 0.02 : 0.15} side={THREE.BackSide} blending={THREE.AdditiveBlending}
            />
          </Sphere>
        )}

        {data.hasRings && (
          <Ring args={[data.radius * 1.4, data.radius * 2.5, 128]} rotation={[-Math.PI / 2.3, 0.1, 0]}>
            <meshStandardMaterial color={data.color} transparent opacity={isDimmed ? 0.05 : 0.5} side={THREE.DoubleSide} roughness={0.5} />
          </Ring>
        )}

        <Html 
          position={[0, data.radius + 1.2, 0]} 
          center 
          style={{ 
            pointerEvents: isDimmed && !isSelected ? 'none' : 'auto',
            transition: isDragging ? 'none' : 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
            opacity: isDimmed && !isSelected ? 0 : 1,
            zIndex: isSelected ? 100 : 10,
            transform: `translate(calc(-50% + ${dragOffset.x}px), calc(-50% + ${dragOffset.y}px))`
          }}
        >
          <div className="flex flex-col items-center">
             {!isSelected ? (
                <div 
                  onClick={() => onSelect(data.id, 'planet')}
                  className="group flex flex-col items-center cursor-pointer"
                >
                  <div className="w-[1px] h-8 bg-gradient-to-t from-cyan-400 to-transparent group-hover:h-12 transition-all duration-500 ease-out"></div>
                  <div className="px-4 py-1.5 text-white font-orbitron text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 group-hover:text-cyan-400 transition-all duration-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {data.name}
                    <ChevronDown size={10} className="text-white/40 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
             ) : (
                <div 
                  onWheel={(e) => e.stopPropagation()}
                  className={`w-80 bg-black/95 backdrop-blur-3xl border border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-700 transition-all ${isCollapsed ? 'max-h-14' : 'max-h-[500px]'}`}
                >
                  <div 
                    onMouseDown={onHeaderMouseDown}
                    className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-cyan-500/20 to-transparent cursor-grab active:cursor-grabbing select-none"
                  >
                    <span className="font-orbitron font-black text-xs text-white tracking-widest uppercase">{data.name}</span>
                    <div className="flex items-center gap-1">
                      <button 
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }} 
                        className="text-white/40 hover:text-cyan-400 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                        title={isCollapsed ? "Развернуть" : "Свернуть"}
                      >
                        {isCollapsed ? <Maximize2 size={14} /> : <Minus size={14} />}
                      </button>
                      <button 
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onSelect(null, 'planet'); }} 
                        className="text-white/40 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                        title="Закрыть"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {!isCollapsed && (
                    <div className="p-5 space-y-4 max-h-96 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5 shadow-inner">
                        <div className="flex items-center gap-2 text-[8px] font-bold text-cyan-400 uppercase tracking-widest mb-1">
                          <Activity size={10} /> Телеметрия
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                          <div>
                            <p className="text-[7px] text-white/30 uppercase font-black tracking-widest">Масса</p>
                            <p className="text-[10px] text-white font-medium">{data.telemetry.mass}</p>
                          </div>
                          <div>
                            <p className="text-[7px] text-white/30 uppercase font-black tracking-widest">Гравитация</p>
                            <p className="text-[10px] text-white font-medium">{data.telemetry.gravity}</p>
                          </div>
                          <div>
                            <p className="text-[7px] text-white/30 uppercase font-black tracking-widest">Сутки</p>
                            <p className="text-[10px] text-white font-medium">{data.telemetry.dayLength}</p>
                          </div>
                          <div>
                            <p className="text-[7px] text-white/30 uppercase font-black tracking-widest">Орб. скорость</p>
                            <p className="text-[10px] text-white font-medium">{data.telemetry.orbitalVelocity}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[8px] font-bold text-cyan-400/80 uppercase tracking-widest">
                          <Info size={10} /> Информация
                        </div>
                        <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                          {data.description}
                        </p>
                      </div>

                      <div className="space-y-2">
                         {data.facts.map((f, i) => (
                           <div key={i} className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                             <div className="w-1 h-1 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(34,211,238,1)]" />
                             <span className="text-[10px] text-white/60 font-medium">{f}</span>
                           </div>
                         ))}
                      </div>

                      <div className="pt-3 border-t border-white/5 space-y-4">
                        <div className="flex items-center gap-2 text-[8px] font-bold text-amber-400/80 uppercase tracking-widest">
                          <ExternalLink size={10} /> Проверенные факты
                        </div>
                        {data.verifiedFacts.map((vf, i) => (
                          <div key={i} className="space-y-2 group/fact">
                            <h4 className="text-[10px] text-white font-bold">{vf.title}</h4>
                            <p className="text-[9px] text-white/50 leading-snug">{vf.description}</p>
                            <a 
                              href={vf.source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[8px] text-cyan-500 hover:text-white transition-colors uppercase font-black"
                            >
                              Источник: {vf.source.text}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
             )}
          </div>
        </Html>
      </group>
    </group>
  );
};

export default Planet;
