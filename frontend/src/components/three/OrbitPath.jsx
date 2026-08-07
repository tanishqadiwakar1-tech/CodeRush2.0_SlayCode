import { useMemo } from 'react';
import * as THREE from 'three';

export default function OrbitPath({ radius = 4.2 }) {
  const points = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          radius * Math.cos(theta),
          radius * Math.sin(theta) * 0.3,
          radius * Math.sin(theta)
        )
      );
    }
    return pts;
  }, [radius]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="#00f0ff" opacity={0.4} transparent linewidth={1} />
    </line>
  );
}
