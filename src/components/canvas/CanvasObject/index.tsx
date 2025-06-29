"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { CustomSplat } from "@/components/CustomSplat";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

const GroupObject = ({ src }: { src: string }) => {
  const parentRef = useRef<THREE.Group>(null); // For continuous yaw rotation
  const ref = useRef<THREE.Group>(null);       // For pitch/roll from sensor
  const [alphaTest, setAlphaTest] = useState(1);
  const [radiusScale, setRadiusScale] = useState(10);
  const smoothed = useRef({ roll: 0, pitch: 0 });
  const alpha = 0.1;

  // Animate yaw rotation over time
  useEffect(() => {
    const yawSpeed = 0.0005;
    let yawAngle = 0;

    const animate = () => {
      if (parentRef.current) {
        yawAngle += yawSpeed; // Adjust rotation speed here
        parentRef.current.rotation.y = yawAngle;
      }
      setAlphaTest(val => val > 0?val - 0.00075:0);
      setRadiusScale(val => val > 1?val - 0.01:1);
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  // WebSocket for roll & pitch
  useEffect(() => {
    try {
      const host = window.location.hostname;
      const prot = window.location.protocol;
      const socket = new WebSocket(`${prot === "https:" ? "wss" : "ws"}://${host}:3000/ws`);

      socket.onmessage = async (event) => {
        const text = event.data instanceof Blob ? await event.data.text() : event.data;
        try {
          const { roll = 0, pitch = 0 } = JSON.parse(text); // yaw ignored

          smoothed.current.roll = smoothed.current.roll * (1 - alpha) + roll * alpha;
          smoothed.current.pitch = smoothed.current.pitch * (1 - alpha) + pitch * alpha;

          if (ref.current) {
            ref.current.rotation.x = THREE.MathUtils.degToRad(smoothed.current.pitch);
            ref.current.rotation.z = THREE.MathUtils.degToRad(smoothed.current.roll);
          }
        } catch {
          console.warn("Invalid WebSocket message:", text);
        }
      };

      return () => socket.close();
    } catch {
      console.log("WebSocket Error Probable");
    }
  }, []);

  return (
    <group ref={parentRef} scale={30} position={[0, -2, 0]}>
      <group ref={ref}>
        <CustomSplat src={src} alphaTest={alphaTest} radiusScale={radiusScale} />
      </group>
    </group>
  );
};


const CanvasObject = ({ src }: { src: string }) => {
  return (
    <Canvas className="w-full h-full" gl={{ alpha: true }} style={{ background: "transparent" }}>
      <OrbitControls />
      <EffectComposer>
        <Noise opacity={0.0625} />
      </EffectComposer>
      {src && <GroupObject src={src} />}
    </Canvas>
  );
};

export default CanvasObject;
