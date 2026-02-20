
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Satellite = ({ distance, speed, color, radius, offset }: any) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const orbit = useRef(offset);

  useFrame((state, delta) => {
    orbit.current += delta * speed;
    const x = Math.cos(orbit.current) * distance;
    const z = Math.sin(orbit.current) * distance;
    const y = Math.sin(orbit.current * 0.5) * (distance * 0.2);
    meshRef.current.position.set(x, y, z);
  });

  return (
    <Trail 
      width={0.4} 
      length={8} 
      color={new THREE.Color(color)} 
      attenuation={(t) => t * t}
    >
      <Sphere ref={meshRef} args={[radius, 8, 8]}>
        <meshBasicMaterial color={color} />
      </Sphere>
    </Trail>
  );
};

const Satellites: React.FC = () => {
  const satellites = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      distance: 150 + Math.random() * 400,
      speed: (Math.random() - 0.5) * 0.2,
      color: ['#00ffff', '#ffffff', '#ff00ff', '#ffff00'][Math.floor(Math.random() * 4)],
      radius: 0.1 + Math.random() * 0.2,
      offset: Math.random() * Math.PI * 2
    }));
  }, []);

  return (
    <group>
      {satellites.map((sat, i) => (
        <Satellite key={i} {...sat} />
      ))}
    </group>
  );
};

export default Satellites;
