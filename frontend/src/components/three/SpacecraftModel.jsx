import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SpacecraftModel({ telemetry }) {
  const groupRef = useRef();
  const antennaRef = useRef();
  const solarPanelLeftRef = useRef();
  const solarPanelRightRef = useRef();

  // Telemetry reactives
  const soc = telemetry?.battery_soc ?? 95;
  const temp = telemetry?.battery_temp ?? 20;
  const commActive = telemetry?.antenna_visible ?? true;
  const pointingMode = telemetry?.pointing_mode ?? 'EARTH_TRACK';
  
  // Thermal warning state
  const isThermalExcursion = temp > 35;
  const panelBrightness = Math.max(0.1, soc / 100);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Orbital position positioning around radius 4.2
      const time = state.clock.getElapsedTime();
      const radius = 4.2;
      const angle = time * 0.2;
      
      groupRef.current.position.x = radius * Math.cos(angle);
      groupRef.current.position.y = radius * Math.sin(angle) * 0.3;
      groupRef.current.position.z = radius * Math.sin(angle);

      // Spacecraft rotation depending on pointing mode
      if (pointingMode === 'SUN_POINTING') {
        groupRef.current.rotation.y += delta * 0.8;
      } else {
        groupRef.current.lookAt(0, 0, 0); // Point toward Earth center
      }
    }

    // Antenna points towards Earth (0,0,0) when comm window active
    if (antennaRef.current && commActive && groupRef.current) {
      const earthPos = new THREE.Vector3(0, 0, 0);
      antennaRef.current.lookAt(earthPos);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Satellite Body */}
      <mesh>
        <boxGeometry args={[0.6, 0.6, 0.9]} />
        <meshStandardMaterial
          color={isThermalExcursion ? '#ff4444' : '#94a3b8'}
          metalness={0.8}
          roughness={0.3}
          emissive={isThermalExcursion ? '#ef4444' : '#000000'}
          emissiveIntensity={isThermalExcursion ? 2.0 : 0.0}
        />
      </mesh>

      {/* Solar Panel Left */}
      <mesh ref={solarPanelLeftRef} position={[-1.2, 0, 0]}>
        <boxGeometry args={[1.6, 0.04, 0.7]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#38bdf8"
          emissiveIntensity={panelBrightness}
          metalness={0.9}
        />
      </mesh>

      {/* Solar Panel Right */}
      <mesh ref={solarPanelRightRef} position={[1.2, 0, 0]}>
        <boxGeometry args={[1.6, 0.04, 0.7]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#38bdf8"
          emissiveIntensity={panelBrightness}
          metalness={0.9}
        />
      </mesh>

      {/* High Gain Antenna Dish */}
      <group ref={antennaRef} position={[0, 0.4, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.05, 0.08, 16]} />
          <meshStandardMaterial
            color={commActive ? '#38bdf8' : '#64748b'}
            emissive={commActive ? '#00f0ff' : '#000000'}
            emissiveIntensity={commActive ? 0.8 : 0.0}
            metalness={0.7}
          />
        </mesh>
        {/* Antenna Feed Needle */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Instrument Boom Pole */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.9} />
      </mesh>

      {/* Thermal Warning Aura sphere if in fault */}
      {isThermalExcursion && (
        <mesh>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
