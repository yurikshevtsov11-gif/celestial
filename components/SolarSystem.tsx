
import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Environment, Sphere, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import Sun from './Sun';
import Planet from './Planet';
import Satellites from './Satellites';
import { PLANETS } from '../constants';

const NebulaCloud = ({ color, position, scale, count = 5000 }: { color: string, position: [number, number, number], scale: number, count?: number }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.5) * scale;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [count, scale]);

  const pointsRef = useRef<THREE.Points>(null!);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={scale * 0.015}
        color={color}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
};

const Nebula = () => {
  const nebulae = useMemo(() => {
    return [
      { color: '#4411aa', pos: [300, 100, -500], scale: 300 },
      { color: '#aa2244', pos: [-400, -200, -300], scale: 350 },
      { color: '#1144aa', pos: [500, -300, 200], scale: 280 },
      { color: '#118866', pos: [-600, 400, 400], scale: 400 }
    ];
  }, []);

  return (
    <group>
      {nebulae.map((neb, i) => (
        <Float key={i} speed={0.5} rotationIntensity={0.2} floatIntensity={0.2}>
          <NebulaCloud 
            color={neb.color} 
            position={neb.pos as [number, number, number]} 
            scale={neb.scale} 
          />
        </Float>
      ))}
    </group>
  );
};

const SpaceBackground = () => {
  return (
    <group>
      <Stars radius={1500} depth={200} count={30000} factor={10} saturation={1} fade speed={1} />
      <Sphere args={[2000, 32, 32]}>
        <meshBasicMaterial color="#010005" side={THREE.BackSide} transparent opacity={1} depthWrite={false} />
      </Sphere>
      <Nebula />
    </group>
  );
};

const CameraRig = ({ focusedId }: { focusedId: string | null }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const isInitialFlight = useRef(false);
  const panOffset = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (focusedId) {
      isInitialFlight.current = true;
      panOffset.current.set(0, 0, 0);
    }
  }, [focusedId]);

  useFrame((state) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (focusedId) {
      const targetGroup = state.scene.getObjectByName(`group-${focusedId}`);
      
      if (targetGroup) {
        const worldPos = new THREE.Vector3();
        targetGroup.getWorldPosition(worldPos);
        const currentTarget = worldPos.clone().add(panOffset.current);
        controls.target.lerp(currentTarget, 0.1);

        if (isInitialFlight.current) {
          let radius = 1.0;
          const planet = PLANETS.find(p => p.id === focusedId);
          if (planet) radius = planet.radius;
          else {
            for(const p of PLANETS) {
               const moon = p.moons?.find(m => m.id === focusedId);
               if (moon) { radius = moon.radius; break; }
            }
          }

          const fov = (camera as THREE.PerspectiveCamera).fov;
          const fovRad = fov * (Math.PI / 180);
          const idealDistance = (5.5 * radius) / Math.tan(fovRad / 2);
          const currentPos = camera.position.clone();
          const direction = new THREE.Vector3().subVectors(currentPos, worldPos).normalize();
          const targetCamPos = new THREE.Vector3().addVectors(worldPos, direction.multiplyScalar(idealDistance));
          
          camera.position.lerp(targetCamPos, 0.05);
          if (camera.position.distanceTo(targetCamPos) < 0.1) isInitialFlight.current = false;
        }
        controls.minDistance = 0.5;
        controls.maxDistance = 2000;
      }
    } else {
      controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
      controls.minDistance = 10;
      controls.maxDistance = 4000;
    }

    if (!isInitialFlight.current && focusedId) {
       const targetGroup = state.scene.getObjectByName(`group-${focusedId}`);
       if (targetGroup) {
         const worldPos = new THREE.Vector3();
         targetGroup.getWorldPosition(worldPos);
         panOffset.current.subVectors(controls.target, worldPos);
       }
    }
    controls.update();
  });

  return (
    <OrbitControls 
      ref={controlsRef} 
      enablePan={true} 
      enableZoom={true} 
      makeDefault 
      dampingFactor={0.08} 
      rotateSpeed={0.6} 
      zoomSpeed={1.2} 
    />
  );
};

interface SolarSystemProps {
  focusedId: string | null;
  onSelect: (id: string | null, type: 'planet' | 'moon') => void;
  timeMultiplier: number;
  distanceMultiplier: number;
  bloomIntensity: number;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ focusedId, onSelect, timeMultiplier, distanceMultiplier, bloomIntensity }) => {
  return (
    <Canvas 
      shadows={{ type: THREE.PCFSoftShadowMap }} 
      className="bg-black" 
      gl={{ 
        antialias: true, 
        stencil: false, 
        depth: true,
        logarithmicDepthBuffer: true 
      }} 
      dpr={[1, 2]}
    >
      <PerspectiveCamera makeDefault position={[0, 125, 300]} fov={45} far={20000} />
      <CameraRig focusedId={focusedId} />
      <ambientLight intensity={0.15} />
      <SpaceBackground />
      <Sun timeMultiplier={timeMultiplier} />
      <Satellites />

      {PLANETS.map((planet) => (
        <Planet 
          key={planet.id} 
          data={planet} 
          isSelected={focusedId === planet.id}
          focusedId={focusedId}
          onSelect={onSelect}
          timeMultiplier={timeMultiplier}
          distanceMultiplier={distanceMultiplier}
          isDimmed={!!focusedId && focusedId !== planet.id}
        />
      ))}

      <Environment preset="night" />
      <EffectComposer enableNormalPass={false}>
        <Bloom 
          intensity={bloomIntensity} 
          luminanceThreshold={0.1} 
          luminanceSmoothing={0.9} 
          mipmapBlur 
        />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};

export default SolarSystem;
