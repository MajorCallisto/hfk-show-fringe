"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, TiltShift } from "@react-three/postprocessing";
import * as React from "react";

type CanvasMainProps = {
  children: React.ReactNode;
  progress: number; // from 0 to 1
};

// Helper to interpolate between two hex colors
const interpolateColor = (color1: string, color2: string, t: number) => {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff;
  const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff;

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `rgb(${r}, ${g}, ${b})`;
};

const CameraSetup = () => {
  const { camera } = useThree();

  React.useEffect(() => {
    camera.position.set(0, 1, 3);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return <OrbitControls target={[0, 0, 0]} />;
};

const CanvasMain = ({ children, progress }: CanvasMainProps) => {
  const background =
    progress > 0.5
      ? interpolateColor("#000000", "#CCEEFF", (progress - 0.5) * 2)
      : "#000000";

  return (
    <Canvas className="w-full h-full" gl={{ alpha: true }} style={{ background }}>
      <CameraSetup />
      <EffectComposer>
        <Bloom />
        <TiltShift />
        <Noise opacity={0.125} />
      </EffectComposer>
      {children}
    </Canvas>
  );
};

export default CanvasMain;
