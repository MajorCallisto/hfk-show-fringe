"use client";

      import { slideData, useAppContext } from "@/components/providers/AppProvider";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

// ---- Button Component ----
const Button = ({ onClick, children, variant = "solid" }: { onClick: () => void; children: React.ReactNode; variant?: "solid" | "outline" }) => {
  const base = "px-4 py-2 rounded font-medium transition-colors";
  const styles =
    variant === "outline"
      ? "border border-gray-500 text-gray-700 hover:bg-gray-100"
      : "bg-blue-600 text-white hover:bg-blue-700";
  return (
    <button onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
};

// ---- Page Component ----
const Page = () => {
  const { setSelectedItems, resetApp } = useAppContext();
  const [boxes, setBoxes] = useState<(number | null)[]>(Array(4).fill(null));
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [recordingBox, setRecordingBox] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("selectedItems");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setBoxes(parsed);
        }
      } catch {}
    }
  }, []);

  const saveToStorage = (updatedBoxes: (number | null)[]) => {
    const finalItems = updatedBoxes.map((item) => (typeof item === "number" ? item : -1));
    setSelectedItems(finalItems.map(String));
    localStorage.setItem("selectedItems", JSON.stringify(finalItems));
  };

  const handleDrop = (index: number) => {
    if (draggingIndex !== null) {
      const updatedBoxes = [...boxes];
      updatedBoxes[index] = draggingIndex;
      setBoxes(updatedBoxes);
      saveToStorage(updatedBoxes);
    }
  };

  const handleReset = () => {
    setBoxes(Array(4).fill(null));
    resetApp();
  };

  const startCountdownAndRecord = (boxIndex: number) => {
    setShowOverlay(true);
    setCountdown(3);
    setRecordingBox(boxIndex);

    let timer = 3;

    const interval = setInterval(() => {
      timer -= 1;
      if (timer > 0) {
        setCountdown(timer);
      } else if (timer === 0) {
        setCountdown("Go");
      } else {
        clearInterval(interval);
        setCountdown(null);
        beginRecording();
      }
    }, 1000);
  };

  const beginRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
        a.href = url;
        a.download = `recording-box-${recordingBox}.webm`;
        a.click();

        // Cleanup
        setIsRecording(false);
        setShowOverlay(false);
        setRecordingBox(null);
      };
    }
  };

  return (
    <div className="p-6 space-y-4 relative">
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center text-white text-6xl font-bold space-y-6">
          {countdown !== null ? (
            <div>{countdown}</div>
          ) : (
            <>
              <div>Recording...</div>
              <Button onClick={stopRecording} variant="outline">
                Stop
              </Button>
            </>
          )}
        </div>
      )}

      <h1 className="text-2xl font-bold">Select 5 Items</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 ">
        {slideData.map((slide, index) => (
          <motion.div
            key={index}
            draggable
            onDragStart={() => setDraggingIndex(index)}
            className="border rounded p-3 cursor-grab bg-white flex flex-col items-center text-center rounded-xl overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-sm font-semibold text-black">{slide?.title}</div>
            {slide.subtitle && <div className="text-xs text-black italic">{slide.subtitle}</div>}
            {slide.object && <div className="text-2xl text-black italic">{slide.object}</div>}
            
            {slide.thumbnail && <div className="rounded-2xl overflow-hidden"><Image alt="image of model" src={slide.thumbnail} width={128} height={128} /></div>}
          </motion.div>
        ))}
      </div>

      <h2 className="text-xl font-semibold">Drop Here</h2>
      <div className="flex gap-4">
        {boxes.map((item, idx) => (
          <div
            key={idx}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
            className="w-40 h-64 border-2 border-dashed flex flex-col items-center justify-center bg-gray-100 text-sm text-center p-2 gap-2 rounded-xl"
          >
            {typeof item === "number" && (
              <>
                <div>
                  <div className="font-semibold text-black">{slideData[item]?.title}</div>
                  
                  {slideData[item].thumbnail && <div className="rounded-2xl overflow-hidden"><Image alt="image of selected model" src={slideData[item].thumbnail} width={128} height={128} /></div>}
          
                </div>
                <Button
                  onClick={() =>
                    isRecording && recordingBox === idx
                      ? stopRecording()
                      : startCountdownAndRecord(idx)
                  }
                  variant="outline"
                >
                  {isRecording && recordingBox === idx ? "Stop Recording" : "Record"}
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <Button onClick={handleReset} variant="outline">Reset</Button>
      </div>
    </div>
  );
};

export default Page;
