import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function SolarPanelAnimation({ active = true }) {
  const lightRef = useRef();

  useFrame((state, delta) => {
    if (lightRef.current && active) {
      lightRef.current.intensity = 1.0 + Math.sin(state.clock.getElapsedTime() * 3) * 0.3;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 0]}
      color="#38bdf8"
      intensity={1}
      distance={3}
    />
  );
}
