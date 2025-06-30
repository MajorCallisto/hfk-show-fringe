"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const routes = ["/0", "/slide/0", "/0.1", "/slide/1", "/0.15", "/slide/2", "/0.2", "/slide/3", "/0.5"];

// export const routes = ["/slide/0","/slide/1",
//   "/slide/2","/slide/3",
//   "/slide/4","/slide/5",
//   "/slide/6","/slide/7",
//   "/slide/8","/slide/9",
//   "/slide/10","/slide/11",
//   "/slide/12","/slide/13",
// ];

const audioPlaylist = [
  { path: "/audio/Middle of the Afternoon - Matt without his name - FX June29_2025.aac", fadeIn: false, fadeOut: false, activeIndex:2 },
  { path: "/audio/Crispy Rain w soupcon of guitcello June28_2025.aac", fadeIn: false, fadeOut: false, activeIndex:2 },
  { path: "/audio/Attraction to Collapse No name - FX June29_2025.aac", fadeIn: false, fadeOut: false, activeIndex:4 },
  { path: "/audio/Igneous cello plucked 5ths SHAPED - June28_2025.aac", fadeIn: false, fadeOut: false, activeIndex:6 },
  { path: "/audio/Without intro Grade Eight - FX June29_2025.aac", fadeIn: false, fadeOut: false, activeIndex:8 },
  { path: "/audio/Guitar and rain shaped - June28_2025.aac", fadeIn: false, fadeOut: false, activeIndex:8 },
  { path: "/audio/Only World We Get - Ryan A - FX June29_2025.aac", fadeIn: false, fadeOut: false, activeIndex:8 },
];

export const prompts = ["Hey there, I'm <your name> — welcome to <play>.",
"Hi! My name's <your name>, and you're watching <play>.",
"I'm <your name>, and this right here is <play>.",
"Hello, I'm <your name>. Let's dive into <play>.",
"Hi, <your name> here, and you're about to see <play>."]
export const slideData = [
  { title: "Play about love", object: "green carkeys on a ring",className: "",  model: "keys.splat", thumbnail: "/images/thumbnail/keys.png" },
  { title: "My Grandfather's Lover", className: "title-md", object: "red rose with green petals", model: "rose.splat", thumbnail: "/images/thumbnail/rose.png" },
  { title: "Losing your car in the grocery store parking lot", className: "title-md", subtitle: "Panic Attack #1", object: "yellow car with white windows", model: "car.splat", thumbnail: "/images/thumbnail/car.png"  },
  { title: "My friend, Jordan", object: "mint ice cream cone, dropped", model: "iceCream.splat", thumbnail: "/images/thumbnail/iceCream.png" },
  { title: "Shitty Beige Couch", object: "patterned couch", model: "couch.splat", thumbnail: "/images/thumbnail/couch.png" },
  { title: "Late night bus in Edmonton", className: "!tracking-longtitle", subtitle: "Panic Attack #2", object: "cell phone with blue messages", model: "phone.splat", thumbnail: "/images/thumbnail/phone.png" },
  { title: "Mental Health History", object: "frosted cupcake with sprinkles", model: "cupcake.splat", thumbnail: "/images/thumbnail/cupcake.png" },
  { title: "Loneliness", className: "!tracking-longtitle", object: "brown clipboard with paper", model: "clipboard.splat", thumbnail: "/images/thumbnail/clipboard.png"  },
  { title: "Letter of Intent", object: "cheesy pepperoni pizza slice", model: "pizza.splat", thumbnail: "/images/thumbnail/pizza.png" },
  { title: "Messy Love", object: "pink training potty", model: "potty.splat", thumbnail: "/images/thumbnail/potty.png" },
  { title: "Moment of Truth", object: "bag of ice", model: "ice.splat", thumbnail: "/images/thumbnail/ice.png" },
  { title: "Shower shadows the pain", className: "mb-12", subtitle: "Panic Attack #3", object: "a shower head", model: "showerhead.splat", thumbnail: "/images/thumbnail/showerhead.png"  },
  // { title: "Grade Eight", object: "razor", model: "razor.splat", thumbnail: "/images/thumbnail/razor.png" },
  { title: "See through me", object: "20 dollar bill", model: "twenty.splat", thumbnail: "/images/thumbnail/twenty.png" },
  // { title: "Baby Blues", object: "lithium", model: "pills.splat", thumbnail: "/images/thumbnail/pills.png"  },
  { title: "Ashes", object: "non-descriptive container", model: "ashes.splat", thumbnail: "/images/thumbnail/ashes.png"  }
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
      // console.log("e",e);
      const saved = localStorage.getItem("currentIndex");
      const index = saved ? parseInt(saved, 10) : 0;

      if ((e.key === "ArrowRight" || e.key === "PageDown")  && index < routes.length - 1) {
        const next = index + 1;
        const newPath = routes[next];
        setCurrentIndex(next);
        setPlaylistIndex(0);
        router.push(newPath);
      } else if ((e.key === "ArrowLeft" || e.key === "PageUp") && index > 0) {
        const prev = index - 1;
        setCurrentIndex(prev);
        setPlaylistIndex(0);
        router.push(routes[prev]);
      }else if (e.key === "F5" || e.key === "Escape") {
        setBoostSignal(Date.now());
        e.preventDefault();
        e.stopPropagation();
      }else if (["0", "1", "2", "3", "4"].includes(e.key)) {
        const triggerNum = parseInt(e.key, 10);
        setAudioTrigger?.({
          path: `/audio/recording-box-${triggerNum}.webm`,
          fadeIn: true,
          fadeOut: true,
        });
      }else if (e.key.toLowerCase() === "f") {
        const elem = document.documentElement; // or a specific element
        if (!document.fullscreenElement) {
          elem.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
      }else if (e.key.toLowerCase() === "p" || e.key === ".") {
        const currentSlidePlaylist = audioPlaylist.filter(item => item?.activeIndex === index);

        const nextIndex = playlistIndex % currentSlidePlaylist.length;
        const nextItem = currentSlidePlaylist[nextIndex];
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
