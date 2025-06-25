"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const routes = ["/0", "/slide/0", "/0.1", "/slide/1", "/0.15", "/slide/2", "/0.2", "/slide/3", "/0.5"];

const audioPlaylist = [
  { path: "/audio/Jordan voice to Cosmic space - May25 experiment.mp3", fadeIn: true, fadeOut: true },
  { path: "/audio/715634__trp__130313-waves-washy-crashes-rough-lake-ontario-notl.mp3", fadeIn: true, fadeOut: true },
];

export const prompts = ["Hey there, I'm <name>—welcome to <play>.",
"Hi! My name's <name>, and you're watching <play>.",
"I'm <name>, and this right here is <play>.",
"Hello, I'm <name>. Let's dive into <play>.",
"Hi, <name> here, and you're about to see <play>."]
export const slideData = [
  { title: "Play about love #1 and 2", object: "keys", model: "keys.splat", thumbnail: "/images/thumbnail/keys.png" },
  { title: "My Grandfather's Lover", className: "title-sm", object: "rose", model: "rose.splat" },
  { title: "Losing your car in the grocery store parking lot", className: "title-sm", subtitle: "Panic Attack #1", object: "car", model: "car.splat" },
  { title: "My friend, Jordan", object: "dropped ice cream", model: "iceCream.splat", thumbnail: "/images/thumbnail/iceCream.png" },
  { title: "Shitty Beige Couch", object: "couch", model: "couch.splat", thumbnail: "/images/thumbnail/couch.png" },
  { title: "Late night bus in Edmonton", className: "!tracking-longtitle", subtitle: "Panic Attack #2", object: "phone texts", model: "phone.splat", thumbnail: "/images/thumbnail/phone.png" },
  { title: "Mental Health History", object: "cupcake", model: "cupcake.splat", thumbnail: "/images/thumbnail/cupcake.png" },
  { title: "Loneliness", className: "!tracking-longtitle", object: "clipboard", model: "clipboard.splat" },
  { title: "Letter of Intent", object: "pizza", model: "pizza.splat", thumbnail: "/images/thumbnail/pizza.png" },
  { title: "Messy Love", object: "potty", model: "potty.splat", thumbnail: "/images/thumbnail/potty.png" },
  { title: "Moment of Truth", object: "bag of ice", model: "ice.splat", thumbnail: "/images/thumbnail/ice.png" },
  { title: "Shower shadows the pain", className: "mb-12", subtitle: "Panic Attack #3", object: "showerhead", model: "showerhead.splat" },
  { title: "Grade Eight", object: "razor", model: "razor.splat", thumbnail: "/images/thumbnail/razor.png" },
  { title: "See through me", object: "20 dollar bill", model: "twenty.splat", thumbnail: "/images/thumbnail/twenty.png" },
  { title: "Baby Blues", object: "lithium", model: "pills.splat" },
  { title: "Ashes", object: "Container", model: "ashes.splat" }
];

type AudioTriggerEvent = {
  path: string;
  fadeIn?: boolean;
  fadeOut?: boolean;
};

type AppContextType = {
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  setRandomSelectedItems:()=>void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  resetApp: () => void;
  boostSignal:number;
  setBoostSignal?: (value: number) => void; 
  audioTrigger: AudioTriggerEvent | null;
  setAudioTrigger?: (event: AudioTriggerEvent) => void;
};

export const AppContext = createContext<AppContextType>({
  selectedItems: [],
  setSelectedItems: () => {},
  setRandomSelectedItems: () => {},
  currentIndex: 0,
  setCurrentIndex: () => {},
  resetApp: () => {},
  boostSignal: 0,
  audioTrigger: null,
  setAudioTrigger: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [selectedItems, setSelectedItemsState] = useState<string[]>([]);
  const [currentIndex, setCurrentIndexState] = useState(0);
  
  const [playlistIndex, setPlaylistIndex] = useState(0);
  
  const setRandomSelectedItems = () => {
    const length = slideData.length;
    const selected = new Set<number>();

    while (selected.size < 4 && selected.size < length) {
      selected.add(Math.floor(Math.random() * length));
    }
    const results: any[] = [...selected];
    console.log("results", results);
    setSelectedItems(results);
  };

  const setSelectedItems = (items: string[]) => {
    setSelectedItemsState(items);
    localStorage.setItem("selectedItems", JSON.stringify(items));
  };

  const setCurrentIndex = (index: number) => {
    setCurrentIndexState(index);
    localStorage.setItem("currentIndex", index.toString());
  };

  const resetApp = () => {
    setSelectedItemsState([]);
    setCurrentIndexState(0);
    localStorage.removeItem("selectedItems");
    localStorage.setItem("currentIndex", "0");
  };

  const [boostSignal, setBoostSignal] = useState<number>(0);

  const [audioTrigger, setAudioTrigger] = useState<AudioTriggerEvent | null>(null);
  
  // Arrow key navigation based on localStorage
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const saved = localStorage.getItem("currentIndex");
      const index = saved ? parseInt(saved, 10) : 0;

      if ((e.key === "ArrowRight" || e.key === "PageDown")  && index < routes.length - 1) {
        const next = index + 1;
        const newPath = routes[next];
        setCurrentIndex(next);
        router.push(newPath);
      } else if ((e.key === "ArrowLeft" || e.key === "PageUp") && index > 0) {
        const prev = index - 1;
        setCurrentIndex(prev);
        router.push(routes[prev]);
      }else if (e.key === ".") {
        setBoostSignal(Date.now());
      }else if (["0", "1", "2", "3", "4"].includes(e.key)) {
        const triggerNum = parseInt(e.key, 10);
        setAudioTrigger?.({
          path: `/audio/recording-box-${triggerNum}.webm`,
          fadeIn: true,
          fadeOut: true,
        });
      }else if (e.key.toLowerCase() === "p") {
        const nextIndex = playlistIndex % audioPlaylist.length;
        const nextItem = audioPlaylist[nextIndex];
        setAudioTrigger?.(nextItem);
        setPlaylistIndex(prev => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, setAudioTrigger, setBoostSignal, setCurrentIndex, playlistIndex]);

  return (
    <AppContext.Provider
      value={{
        selectedItems,
        setSelectedItems,
        setRandomSelectedItems,
        currentIndex,
        setCurrentIndex,
        resetApp,
        boostSignal, 
        setBoostSignal, 
        audioTrigger,
        setAudioTrigger,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
