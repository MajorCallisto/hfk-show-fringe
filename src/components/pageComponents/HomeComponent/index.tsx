"use client";

import CanvasMain from "@/components/canvas/CanvasMain";
import { CustomSplat } from "@/components/CustomSplat";
import { AppContext } from "@/components/providers/AppProvider";
import { useFrame } from "@react-three/fiber";
import { useParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { Group } from "three";

const GroupHome = ({ startProgress }: { startProgress: number }) => {
  const groupRef = useRef<Group>(null);
  const [progress, setProgress] = useState(startProgress);
  const [iterator, setIterator] = useState(0.00001);
  const boostTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { boostSignal } = useContext(AppContext);
  const lastBoostRef = useRef<number>(boostSignal);

  // Watch for boost signal change
  useEffect(() => {
    if (boostSignal !== lastBoostRef.current) {
      lastBoostRef.current = boostSignal;
      setIterator(0.0001);

      if (boostTimeoutRef.current) clearTimeout(boostTimeoutRef.current);
      boostTimeoutRef.current = setTimeout(() => {
        setIterator(0.00001);
      }, 10000); // 10 seconds
    }
  }, [boostSignal]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0001;
    }

    setProgress(prev => Math.min(prev + iterator, 1));
  });

  const radiusScale = 0.2 + (1.0 - 0.2) * progress;
  const alphaTest = 0.99 + (0.0 - 0.99) * progress;

  return (
    <group ref={groupRef}>
      <CustomSplat
        src="/models/beach.splat"
        radiusScale={radiusScale}
        alphaTest={alphaTest}
      />
    </group>
  );
};

const Home = () => {
  const params = useParams();
  const progressParam = params?.progress;
  const progress = Math.min(Math.max(parseFloat(Array.isArray(progressParam) ? progressParam[0] : progressParam ?? "0"), 0), 1)


  return (
    <div className="w-screen h-screen overflow-hidden m-0 p-0">
      <CanvasMain progress={progress}>
        <GroupHome startProgress={progress} />
      </CanvasMain>
    </div>
  );
};

export default Home;
