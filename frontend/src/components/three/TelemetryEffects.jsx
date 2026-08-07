import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function TelemetryEffects({ telemetry }) {
  const pulseRef = useRef();
  const commActive = telemetry?.antenna_visible ?? true;

  useFrame((state, delta) => {
    if (pulseRef.current && commActive) {
      pulseRef.current.scale.x = 1 + (state.clock.getElapsedTime() % 2) * 0.5;
      pulseRef.current.scale.y = 1 + (state.clock.getElapsedTime() % 2) * 0.5;
      pulseRef.current.scale.z = 1 + (state.clock.getElapsedTime() % 2) * 0.5;
      pulseRef.current.material.opacity = Math.max(0, 0.4 - (state.clock.getElapsedTime() % 2) * 0.2);
    }
  });

  if (!commActive) return null;

  return (
    <mesh ref={pulseRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.7, 32, 32]} />
      <meshBasicMaterial color="#00f0ff" transparent opacity={0.2} wireframe />
    </mesh>
  );
}
