import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function EarthModel() {
  const earthRef = useRef();
  const cloudsRef = useRef();

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.07;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Main Earth Body */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          color="#1e3a8a"
          roughness={0.6}
          metalness={0.2}
          emissive="#0c1e4a"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Cloud & Atmosphere Outer Glow */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.55, 64, 64]} />
        <meshStandardMaterial
          color="#60a5fa"
          transparent={true}
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Atmosphere Ring */}
      <mesh>
        <sphereGeometry args={[2.65, 32, 32]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent={true}
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
