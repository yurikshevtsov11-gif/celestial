
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';

interface SunProps {
  timeMultiplier: number;
}

const Sun: React.FC<SunProps> = ({ timeMultiplier }) => {
  const sunRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const effectiveDelta = delta * timeMultiplier;
    
    sunRef.current.rotation.y += effectiveDelta * 0.1;
    glowRef.current.scale.setScalar(1.15 + Math.sin(time * 1.5) * 0.03);
  });

  return (
    <group>
      {/* Core - Основное тело солнца */}
      <Sphere ref={sunRef} args={[5, 64, 64]}>
        <meshStandardMaterial
          emissive="#ffcc33"
          emissiveIntensity={15}
          color="#ffdd00"
        />
      </Sphere>

      {/* Halo Glow - Мягкое свечение вокруг */}
      <Sphere ref={glowRef} args={[5.5, 32, 32]}>
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Surface Distortion Flare - Эффект протуберанцев */}
      <Sphere args={[5.2, 48, 48]}>
        <MeshDistortMaterial
          color="#ff6600"
          speed={3 * timeMultiplier}
          distort={0.45}
          radius={1}
          emissive="#ff3300"
          emissiveIntensity={3}
          transparent
          opacity={0.6}
        />
      </Sphere>

      {/* ГЛАВНЫЙ ИСТОЧНИК СВЕТА - Высокое качество теней */}
      <pointLight 
        intensity={3000} 
        distance={1000} 
        decay={1.2} 
        color="#ffddaa" 
        castShadow 
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={1000}
        shadow-bias={-0.0001}
      />
      
      <Html position={[0, 8, 0]} center>
        <div className="pointer-events-none whitespace-nowrap">
          <span className="font-orbitron text-yellow-400 text-3xl font-black tracking-widest uppercase drop-shadow-[0_0_25px_rgba(253,184,19,1)] select-none">
            SOL
          </span>
        </div>
      </Html>
    </group>
  );
};

export default Sun;
