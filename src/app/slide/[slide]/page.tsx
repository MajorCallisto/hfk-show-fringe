"use client";

import CanvasObject from "@/components/canvas/CanvasObject";
import { slideData } from "@/components/providers/AppProvider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const SlidePage = () => {
  const params = useParams();
  const slideIndex = parseInt(params.slide as string);
  const [selectedSlide, setSelectedSlide] = useState<{ title: string; subtitle?: string; object?: string, model?:string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedItems");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !isNaN(slideIndex)) {
          const slideDataIndex = parseInt(parsed[slideIndex]);
          const slide = slideData[slideDataIndex];
          if (slide) {
            setSelectedSlide(slide);
          }
        }
      } catch {}
    }
  }, [slideIndex]);

  if (!selectedSlide) {
    return <div className="p-6 text-red-600">Slide not found or selection missing.</div>;
  }

  return (
    <div className="grid grid-cols-12 grid-rows-12 h-screen">
      {/* Left Column */}
      <div className="col-span-6 row-span-12 flex flex-col justify-between p-8">
        <div>
          
      <h1 className="text-9xl font-medium">{selectedSlide.title}</h1>
         
      {selectedSlide.subtitle && (
      <h2 className="text-6xl font-medium">{selectedSlide.subtitle}</h2>
      )}
        </div>
        
      <audio autoPlay controls src={`/audio/recording-box-${slideIndex}.webm`} className="mt-4" />
      </div>

      {/* Right Column */}
      <div className="col-span-6 row-span-11 mb-8 mr-8 bg-gradient-to-b from-[#924289] to-[#d94e33] animate-gradient-y flex items-center justify-center">
        {selectedSlide.model && <CanvasObject src={`/models/${selectedSlide.model}`} />}
      </div>
      
      <div className="col-span-6 row-span-1 flex items-start">

        <p className="text-6xl">Display Model: {selectedSlide.object?.toUpperCase()}</p>
      </div>
    </div>

  );
};

export default SlidePage;