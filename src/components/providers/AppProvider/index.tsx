"use client";

import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const routes = ["/0", "/slide/0.01", "/0.1", "/slide/1", "/0.15", "/slide/2", "/0.2", "/slide/3", "/0.5"];

export const prompts = ["Hey there, I'm <name>—welcome to <play>.",
"Hi! My name's <name>, and you're watching <play>.",
"I'm <name>, and this right here is <play>.",
"Hello, I'm <name>. Let's dive into <play>.",
"Hi, <name> here, and you're about to see <play>."]
export const slideData = [
  { title: "Play about love #1", object: "keys", model: "keys.splat", thumbnail: "/images/thumbnail/keys.png" },
  { title: "My Grandfather's Lover", className: "title-sm", object: "rose", model: "test.splat" },
  { title: "Losing your car in the grocery store parking lot", className: "title-sm", subtitle: "Panic Attack #1", object: "car", model: "test.splat" },
  { title: "My friend, Jordan", object: "dropped ice cream", model: "iceCream.splat", thumbnail: "/images/thumbnail/iceCream.png" },
  { title: "Shitty Beige Couch", object: "couch", model: "couch.splat", thumbnail: "/images/thumbnail/couch.png" },
  { title: "Late night bus in Edmonton", className: "!tracking-longtitle", subtitle: "Panic Attack #2", object: "phone texts", model: "phone.splat", thumbnail: "/images/thumbnail/phone.png" },
  { title: "Mental Health History", object: "cupcake", model: "cupcake.splat", thumbnail: "/images/thumbnail/cupcake.png" },
  { title: "Loneliness", className: "!tracking-longtitle", object: "clipboard", model: "test.splat" },
  { title: "Letter of Intent", object: "pizza", model: "pizza.splat", thumbnail: "/images/thumbnail/pizza.png" },
  { title: "Messy Love", object: "potty", model: "potty.splat", thumbnail: "/images/thumbnail/potty.png" },
  { title: "Moment of Truth", object: "bag of ice", model: "ice.splat", thumbnail: "/images/thumbnail/ice.png" },
  { title: "Shower shadows the pain", className: "mb-12", subtitle: "Panic Attack #3", object: "blue shampoo bottle", model: "test.splat" },
  { title: "Grade Eight", object: "razor", model: "razor.splat", thumbnail: "/images/thumbnail/razor.png" },
  { title: "See through me", object: "20 dollar bill", model: "twenty.splat", thumbnail: "/images/thumbnail/twenty.png" },
  { title: "Play about love #2", object: "battery tea light", model: "test.splat" }
];
  

type AppContextType = {
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  resetApp: () => void;
  boostSignal:number;
  setBoostSignal?: (value: number) => void; // ← ADD THIS
};

export const AppContext = createContext<AppContextType>({
  selectedItems: [],
  setSelectedItems: () => {},
  currentIndex: 0,
  setCurrentIndex: () => {},
  resetApp: () => {},
  boostSignal: 0,
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [selectedItems, setSelectedItemsState] = useState<string[]>([]);
  const [currentIndex, setCurrentIndexState] = useState(0);

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
        setBoostSignal(Date.now()); // <-- NEW: Trigger boost
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <AppContext.Provider
      value={{
        selectedItems,
        setSelectedItems,
        currentIndex,
        setCurrentIndex,
        resetApp,
    boostSignal, // ← ✅ ADD THIS
        setBoostSignal, // ← ADD THIS
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
