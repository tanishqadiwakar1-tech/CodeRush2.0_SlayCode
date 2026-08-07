import { useThree, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export default function CameraController() {
  const { camera } = useThree();
  const targetPos = useRef([0, 2, 8]);

  useFrame(() => {
    camera.position.x += (targetPos.current[0] - camera.position.x) * 0.05;
    camera.position.y += (targetPos.current[1] - camera.position.y) * 0.05;
    camera.position.z += (targetPos.current[2] - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
