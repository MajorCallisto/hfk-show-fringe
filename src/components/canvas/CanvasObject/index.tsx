"use client";

import { Canvas } from "@react-three/fiber";
import { CustomSplat } from "@/components/CustomSplat";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { Group } from "three";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

const GroupObject = ({ src }: { src: string }) => {
  const ref = useRef<Group>(null);
  const [alphaTest] = useState(0);
  const [radiusScale] = useState(1);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    
      try {
        const host = window.location.hostname;
        const prot = window.location.protocol;
        const socket = new WebSocket(`${prot === "https:"?"wss":"ws"}://${host}:3000/ws`);

        socket.onmessage = async (event) => {
          const text = event.data instanceof Blob ? await event.data.text() : event.data;
          try {
            const { gx = 0, gy = 0, gz = 0 } = JSON.parse(text);
            const now = performance.now();
            const deltaSec = (now - lastTime.current) / 1000;
            lastTime.current = now;

            if (ref.current) {
              ref.current.rotation.x += gy * deltaSec;
              ref.current.rotation.y += gz * deltaSec;
              ref.current.rotation.z += gx * deltaSec;
            }
          } catch {
            console.warn("Invalid WebSocket message:", text);
          }
        };
        
        return () => socket.close();
      }
      catch{
        console.log("Websocket Error Probable");
      }
    

  }, []);

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
