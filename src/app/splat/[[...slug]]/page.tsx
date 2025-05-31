"use client";

import { CustomSplat } from "@/components/CustomSplat";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { ASCII, ChromaticAberration, DotScreen, EffectComposer, Glitch, Noise, Pixelation, Scanline, TiltShift2, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";
import { useParams } from "next/navigation";
import { BlendFunction } from "postprocessing";
import { useRef, useState } from "react";
import { Group, Vector2 } from "three";

const RotatingSplat = ({
  src,
  radiusScale,
  alphaTest,
  toneMapped,
}: {
  src: string;
  radiusScale: number;
  alphaTest: number;
  toneMapped: boolean;
}) => {
  const ref = useRef<Group>(null!);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
    }
  });

  return (
    <group scale={10} ref={ref} position={[0, 0, 0]}>
      <CustomSplat radiusScale={radiusScale} alphaTest={alphaTest} src={src} 
    toneMapped={toneMapped} />
    </group>
  );
};
const SplatPage = () => {
  const params = useParams();
  const slug = params?.slug;
  const filename = Array.isArray(slug) && slug.length > 0 ? slug[0] : "stump.splat";
  const filePath = `/models/${filename}`;

  const [alphaTest, setAlphaTest] = useState(0);
  const [radiusScale, setRadiusScale] = useState(1);
  const [toneMapped, setToneMapped] = useState(false);
  const [focalDistance, setFocalDistance] = useState(1);
  const [pixelGranulariy, setPixelGranulariy] = useState(25);
  

  const [showNoise, setShowNoise] = useState(true);
  const [showVignette, setShowVignette] = useState(true);
  const [showAscii, setShowAscii] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const [showTiltShift, setShowTiltShift] = useState(true);
  const [showDotScreen, setShowDotScreen] = useState(false);
  const [showScanline, setShowScanline] = useState(false);
  const [showPixelation, setShowPixelation] = useState(true);
  const [showChromaticAberration, setShowChromaticAberration] = useState(false);

  const animateControls = () => {
    gsap.to(
      { alphaTest, radiusScale, pixelGranulariy },
      {
        alphaTest: 0,
        pixelGranulariy: 0,
        radiusScale: 1.0,
        duration: 3,
        ease: "power2.out",
        onUpdate() {
          setAlphaTest(this.targets()[0].alphaTest);
          setPixelGranulariy(this.targets()[0].pixelGranulariy);
          setRadiusScale(this.targets()[0].radiusScale);
        },
      }
    );
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-80 p-4 rounded-lg shadow-lg text-white space-y-4 w-64 text-sm font-medium">
        <div>
          <div className="flex justify-between mb-1">
            <label htmlFor="alphaTest">Alpha Test</label>
            <span>{alphaTest.toFixed(2)}</span>
          </div>
          <input
            id="alphaTest"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={alphaTest}
            onChange={(e) => setAlphaTest(parseFloat(e.target.value))}
            className="w-full accent-white"
          />
        </div>

        <div className="border-t border-gray-600 pt-4">
          <div className="flex justify-between mb-1">
            <label htmlFor="radiusScale">Radius Scale</label>
            <span>{radiusScale.toFixed(2)}</span>
          </div>
          <input
            id="radiusScale"
            type="range"
            min={0.1}
            max={3}
            step={0.01}
            value={radiusScale}
            onChange={(e) => setRadiusScale(parseFloat(e.target.value))}
            className="w-full accent-white"
          />
        </div>

        <div className="border-t border-gray-600 pt-4">
          <div className="flex justify-between mb-1">
            <label htmlFor="focalDistance">Focal Distance</label>
            <span>{focalDistance.toFixed(5)}</span>
          </div>
          <input
            id="focalDistance"
            type="range"
            min={0.9}
            max={1.1}
            step={0.001}
            value={focalDistance}
            onChange={(e) => setFocalDistance(parseFloat(e.target.value))}
            className="w-full accent-white"
          />
        </div>

        <div className="border-t border-gray-600 pt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={toneMapped}
              onChange={(e) => setToneMapped(e.target.checked)}
              className="form-checkbox accent-white"
            />
            <span>Enable Tone Mapping</span>
          </label>
        </div>

        <div className="border-t border-gray-600 pt-4 space-y-1">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Post Effects</p>
          {[
            ["Noise", showNoise, setShowNoise],
            ["Vignette", showVignette, setShowVignette],
            ["ASCII", showAscii, setShowAscii],
            ["Glitch", showGlitch, setShowGlitch],
            ["TiltShift", showTiltShift, setShowTiltShift],
            ["DotScreen", showDotScreen, setShowDotScreen],
            ["Scanline", showScanline, setShowScanline],
            ["Pixelation", showPixelation, setShowPixelation],
            ["Chromatic", showChromaticAberration, setShowChromaticAberration],
          ].map(([label, value, setter]) => (
            <label key={label} className="flex items-center justify-between">
              <span>{label}</span>
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) =>
                  (setter as React.Dispatch<React.SetStateAction<boolean>>)(e.target.checked)
                }
                className="form-checkbox accent-white"
              />
            </label>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-600">
          <button
            onClick={animateControls}
            className="w-full bg-white text-black rounded px-3 py-1 mt-1 font-semibold text-sm hover:bg-gray-200"
          >
            Animate
          </button>
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas className="w-full h-full" gl={{ alpha: true }} style={{ background: "transparent" }}>
        <OrbitControls />
        <RotatingSplat
          src={filePath}
          radiusScale={radiusScale}
          alphaTest={alphaTest}
          toneMapped={toneMapped}
        />

        <EffectComposer>
          {showNoise && <Noise opacity={0.125} />}
          {showVignette && <Vignette eskil={false} offset={0.1} darkness={1.1} opacity={0.5} />}
          {showAscii && <ASCII />}
          {showGlitch && (
            <Glitch
              active
              chromaticAberrationOffset={new Vector2(1, 5)}
              duration={new Vector2(0.6, 1)}
              delay={new Vector2(1.5, 3.5)}
              columns={0.3}
              ratio={0.85}
              strength={new Vector2(0.3, 1)}
            />
          )}
          {showTiltShift && <TiltShift2 blur={0.15} />}
          {showDotScreen && <DotScreen scale={2} opacity={0.25} />}
          {showScanline && <Scanline />}
          {showPixelation && <Pixelation granularity={pixelGranulariy} />}
          {showChromaticAberration && (
            <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.002, 0.002]} />
          )}
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default SplatPage;