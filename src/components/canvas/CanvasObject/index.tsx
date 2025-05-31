"use client";

import { CustomSplat } from "@/components/CustomSplat";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { useRef, useState } from "react";
import { Group } from "three";

const GroupObject = ({ src }: { src: string }) => {
  const ref = useRef<Group>(null);
  const [alphaTest] = useState(0);
  const [radiusScale] = useState(1);

  useFrame(({  }) => {
    if (ref.current) {
      ref.current.rotation.x += 0.0005;
      ref.current.rotation.y += 0.001;
      // ref.current.rotation.z += 0.002
    }
  });

  return (
    <group scale={20} ref={ref} position={[0, -2, 0]}>
      <CustomSplat src={src} alphaTest={alphaTest} radiusScale={radiusScale} />
    </group>
  );
};

const CanvasObject = ({ src }: { src: string }) => {
  return (
    <Canvas className="w-full h-full" gl={{ alpha: true }} style={{ background: "transparent" }}>
      <OrbitControls />
      <EffectComposer>
        <Noise opacity={0.125} />
      </EffectComposer>
      {src && <GroupObject src={src} />}
    </Canvas>
  );
};

export default CanvasObject;
