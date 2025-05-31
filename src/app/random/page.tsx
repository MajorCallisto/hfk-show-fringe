"use client"

import { slideData } from "@/components/providers/AppProvider";
import { useEffect } from "react";
import HomeComponent from "../page";

const RandomPage = () => {
  useEffect(() => {
    const length = slideData.length;
    const selected = new Set<number>();

    while (selected.size < 4 && selected.size < length) {
      selected.add(Math.floor(Math.random() * length));
    }

    localStorage.setItem("selectedItems", JSON.stringify([...selected]));
    localStorage.setItem("currentIndex", JSON.stringify(0));
  }, []);

  return <HomeComponent />;
};

export default RandomPage;
