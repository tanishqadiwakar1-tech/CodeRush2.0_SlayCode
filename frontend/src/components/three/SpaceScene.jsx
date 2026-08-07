import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import EarthModel from './EarthModel';
import SpacecraftModel from './SpacecraftModel';
import OrbitPath from './OrbitPath';
import TelemetryEffects from './TelemetryEffects';
import CameraController from './CameraController';

export default function SpaceScene({ telemetry }) {
  return (
    <div className="w-full h-full relative bg-[#060913]">
      <Canvas camera={{ position: [0, 2.5, 8.5], fov: 45 }}>
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#38bdf8" />

        {/* Stars background */}
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />

        {/* 3D Objects */}
        <EarthModel />
        <OrbitPath radius={4.2} />
        <SpacecraftModel telemetry={telemetry} />
        <TelemetryEffects telemetry={telemetry} />
        <CameraController />

        {/* Interactive Controls */}
        <OrbitControls enablePan={false} maxDistance={15} minDistance={4} />
      </Canvas>

      {/* 3D Overlay Controls Badge */}
      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur border border-cyan-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2 pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest">
          Interactive 3D Orbit View
        </span>
      </div>
    </div>
  );
}
