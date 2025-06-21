'use client';

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export default function ControlPage() {
  const socketRef = useRef<WebSocket | null>(null);
  const boxRef = useRef<THREE.Mesh>(null);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const lastRotation = useRef([0, 0, 0]);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000/ws');
    socketRef.current = socket;

    socket.onopen = () => console.log('WebSocket connected');
    socket.onclose = () => console.log('WebSocket disconnected');
    socket.onerror = (err) => console.error('WebSocket error', err);

    return () => {
      socket.close();
    };
  }, []);

  const sendGyro = (gx: number, gy: number, gz: number) => {
    const message = JSON.stringify({ gx, gy, gz });
    if (socketRef.current?.readyState === WebSocket.OPEN) {

      socketRef.current.send(message);
    }
  };

  const TrackRotation = () => {
    useFrame(() => {
      const now = performance.now();
      const dt = (now - lastTime.current) / 1000;
      lastTime.current = now;

      if (boxRef.current) {
        const { x, y, z } = boxRef.current.rotation;
        const dx = (x - lastRotation.current[0]) / dt;
        const dy = (y - lastRotation.current[1]) / dt;
        const dz = (z - lastRotation.current[2]) / dt;

        const gx = THREE.MathUtils.radToDeg(dx);
        const gy = THREE.MathUtils.radToDeg(dy);
        const gz = THREE.MathUtils.radToDeg(dz);

        if (Math.abs(gx) > 0.01 || Math.abs(gy) > 0.01 || Math.abs(gz) > 0.01) {
          sendGyro(gx, gy, gz);
        }

        lastRotation.current = [x, y, z];
      }
    });
    return null;
  };

  const DragControls = () => {
    const { gl } = useThree();

    useEffect(() => {
      const onPointerDown = (e: MouseEvent) => {
        isDragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
      };

      const onPointerUp = () => {
        isDragging.current = false;
      };

      const onPointerMove = (e: MouseEvent) => {
        if (!isDragging.current || !boxRef.current) return;

        const deltaX = e.clientX - lastMouse.current.x;
        const deltaY = e.clientY - lastMouse.current.y;

        lastMouse.current = { x: e.clientX, y: e.clientY };

        boxRef.current.rotation.y += deltaX * 0.005;
        boxRef.current.rotation.x += deltaY * 0.005;
      };

      const canvas = gl.domElement;
      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('pointermove', onPointerMove);

      return () => {
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('pointermove', onPointerMove);
      };
    }, [gl]);

    return null;
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <mesh ref={boxRef} rotation={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        <TrackRotation />
        <DragControls />
      </Canvas>
    </div>
  );
}