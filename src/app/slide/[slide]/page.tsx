"use client";

import CanvasObject from "@/components/canvas/CanvasObject";
import { slideData } from "@/components/providers/AppProvider";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

const SlidePage = () => {
 
  const audioRef = useRef<HTMLAudioElement>(null);
  const params = useParams();
  const slideIndex = parseInt(params.slide as string);
  const [selectedSlide, setSelectedSlide] = useState<{ title: string; subtitle?: string; object?: string, model?:string, className?:string} | null>(null);

const initPath = (() => {
  switch (slideIndex) {
    case 0:
      return "/audio/Buchla Pearl Nugget A-2.aac";
    case 1:
      return "/audio/Buchla Pearl Nugget B-1.aac";
    case 2:
      return "/audio/Buchla Pearl Nugget C-1.aac";
    default:
      return "/audio/Buchla Pearl Nugget D-1.aac";
  }
})();

  const [stateAudioSrc, setStateAudioSrc] = useState(initPath);

  
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
    <div className="mx-[78px] grid grid-cols-12 grid-rows-12 h-screen cursor-none">
      {/* Left Column */}
      <div className="col-span-6 row-span-12 grid grid-rows-12 ml-4 pr-4">
        <div className="my-[72px] row-span-10 flex flex-col">
          <h1 className={`-mt-1.5 opacity-0 animate-fade-in-slow ${selectedSlide?.className? `${selectedSlide?.className}`:""}`}>{selectedSlide.title}</h1>
            
          {selectedSlide.subtitle && (
          <h2 className="pb-3 mt-14l opacity-0 animate-fade-in-slow">{selectedSlide.subtitle}</h2>
          )}
        </div>
        
        <div className="row-span-1 flex items-end">
          {selectedSlide.object && (
          <p className="caption opacity-0 animate-fade-in-slow-delay">{selectedSlide.object?.toUpperCase()}</p>
          )}
          <audio onEnded={()=>{
                const nextSrc = `/audio/uploads/recording-box-${slideIndex}.webm`;
                setStateAudioSrc(nextSrc);
          }}  ref={audioRef} autoPlay controls={false} src={stateAudioSrc} className="mt-4" />
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-6 row-span-12 grid grid-rows-12 h-0 opacity-0 animate-fade-in-height overflow-hidden">
        <div className=" row-span-12 min-h-screen bg-gradient-to-b from-[#924289] to-[#d94e33] flex items-end justify-center">
          {selectedSlide.model && <CanvasObject src={`/models/${selectedSlide.model}`} />}
        </div>
      </div>
      
    </div>
  );
};

export default SlidePage;