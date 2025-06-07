"use client";

import CanvasObject from "@/components/canvas/CanvasObject";
import { slideData } from "@/components/providers/AppProvider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const SlidePage = () => {
  const params = useParams();
  const slideIndex = parseInt(params.slide as string);
  const [selectedSlide, setSelectedSlide] = useState<{ title: string; subtitle?: string; object?: string, model?:string, className?:string} | null>(null);

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
    <div className="mx-[78px] grid grid-cols-12 grid-rows-12 h-screen">
      {/* Left Column */}
      <div className="col-span-6 row-span-12 grid grid-rows-12 ml-4">
        <div className="my-[72px] row-span-10 flex flex-col">
          <h1 className={`-mt-1.5 ${selectedSlide?.className? `${selectedSlide?.className}`:""}`}>{selectedSlide.title}</h1>
            
          {selectedSlide.subtitle && (
          <h2 className="pb-3 mt-14l">{selectedSlide.subtitle}</h2>
          )}
        </div>
        
        <div className="row-span-1 flex items-end">
          <p className="subtitle">International Style</p>
          <audio autoPlay controls={false} src={`/audio/recording-box-${slideIndex}.webm`} className="mt-4" />
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-6 row-span-12 grid grid-rows-12 ">
        <div className=" row-span-10 bg-gradient-to-b from-[#924289] to-[#d94e33] flex items-end justify-center">
          {selectedSlide.model && <CanvasObject src={`/models/${selectedSlide.model}`} />}
        </div>
        <div className="row-span-1 flex items-end">
          <p className="subtitle">Display Model: {selectedSlide.object?.toUpperCase()}</p>
        </div>
      </div>
      
    </div>
  );
};

export default SlidePage;