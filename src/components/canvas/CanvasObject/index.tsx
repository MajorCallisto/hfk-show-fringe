"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { CustomSplat } from "@/components/CustomSplat";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";

const GroupObject = ({ src }: { src: string }) => {
  const parentRef = useRef<THREE.Group>(null); // Yaw rotation
  const ref = useRef<THREE.Group>(null);       // Pitch/Roll rotation
  const smoothed = useRef({ roll: 0, pitch: 0 });
  const target = useRef({ roll: 0, pitch: 0 });

  const alpha = 0.1;         // Smoothing responsiveness
  const epsilon = 6;        // Ignore changes smaller than 0.2 degrees

  useEffect(() => {
    const yawSpeed = 0.0005;
    let yawAngle = 0;

    const animate = () => {
        yawAngle += yawSpeed;

        if (parentRef.current) {
          parentRef.current.rotation.y = yawAngle;
        }

        const deltaRoll = target.current.roll - smoothed.current.roll;
        const deltaPitch = target.current.pitch - smoothed.current.pitch;

        if (Math.abs(deltaRoll) > epsilon) {
          smoothed.current.roll += deltaRoll * alpha;
        }

        if (Math.abs(deltaPitch) > epsilon) {
          smoothed.current.pitch += deltaPitch * alpha;
        }

        if (ref.current) {
          ref.current.rotation.x = THREE.MathUtils.degToRad(smoothed.current.pitch);
          ref.current.rotation.z = THREE.MathUtils.degToRad(smoothed.current.roll);
        }


      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

  }, []);

  useEffect(() => {
    try {
      const host = window.location.hostname;
      const prot = window.location.protocol;
      const socket = new WebSocket(`${prot === "https:" ? "wss" : "ws"}://${host}:3000/ws`);

      socket.onmessage = async (event) => {
        const text = event.data instanceof Blob ? await event.data.text() : event.data;
        try {
          const { roll = 0, pitch = 0 } = JSON.parse(text);

          // Only update target if value change is meaningful
          if (Math.abs(roll - target.current.roll) > epsilon) {
            target.current.roll = roll;
          }
          if (Math.abs(pitch - target.current.pitch) > epsilon) {
            target.current.pitch = pitch;
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
    <group ref={parentRef} scale={30} position={[0, -1.25, 0]}>
      <group ref={ref}>
        <CustomSplat src={src} animateInternal={true} />
      </group>
    </group>
  );
};



const CanvasObject = ({ src }: { src: string }) => {
  return (
    <Canvas className="w-full h-full" gl={{ alpha: true }} style={{ background: "transparent" }}  camera={{ position: [0, 1.5, 3], fov: 90 }}>
      <OrbitControls  target={[0, -0.5, 0]}   />
      <EffectComposer>
        <Noise opacity={0.0625} />
      </EffectComposer>
      {src && <GroupObject src={src} />}
    </Canvas>
  );
};

export default CanvasObject;
