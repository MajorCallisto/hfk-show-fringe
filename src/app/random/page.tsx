"use client"

import HomeComponent from "../page";
import { useAppContext } from "@/components/providers/AppProvider";
import { useEffect } from "react";

const RandomPage = () => {
  
    const { setRandomSelectedItems } = useAppContext();
  useEffect(() => {
    setRandomSelectedItems();
    localStorage.setItem("currentIndex", JSON.stringify(0));
  }, []);

  return <HomeComponent />;
};

export default RandomPage;
