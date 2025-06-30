"use client";

import { useAppContext } from "@/components/providers/AppProvider";
import { useEffect, useRef } from "react";

const FADE_DURATION_MS = 2000;

const AudioTrigger = () => {
  const { audioTrigger } = useAppContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeInterval = useRef<NodeJS.Timeout | null>(null);
  const lastPlayedPath = useRef<string | null>(null);

  const fadeVolume = (targetVolume: number, duration: number) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeDelta = (targetVolume - audio.volume) / steps;

    if (fadeInterval.current) clearInterval(fadeInterval.current);

    fadeInterval.current = setInterval(() => {
      if (!audioRef.current) return;
      audio.volume = Math.min(1, Math.max(0, audio.volume + volumeDelta));
      const done =
        (volumeDelta > 0 && audio.volume >= targetVolume) ||
        (volumeDelta < 0 && audio.volume <= targetVolume);
      if (done) {
        audio.volume = targetVolume;
        clearInterval(fadeInterval.current!);
      }
    }, stepTime);
  };

  useEffect(() => {
    console.log("A");
    if (!audioTrigger || !audioTrigger.path || audioTrigger.path === lastPlayedPath.current) return;
console.log("B");
    lastPlayedPath.current = audioTrigger.path;

    const audio = new Audio(audioTrigger.path);
    audioRef.current = audio;
    audio.volume = audioTrigger.fadeIn ? 0 : 1;

      audio.play().then(() => {
        if (audioTrigger.fadeIn) fadeVolume(1, FADE_DURATION_MS);
      })
      .catch((err) => {
        console.warn("Audio playback failed:", err);
        lastPlayedPath.current = null;
      audioRef.current = null;
      });
    
    audio.onended = () => {
      if (audioTrigger.fadeOut) {
        fadeVolume(0, FADE_DURATION_MS);
        setTimeout(() => audio.pause(), FADE_DURATION_MS);
      }
      lastPlayedPath.current = null;
      audioRef.current = null;
    };

    return () => {
      if (audioRef.current) {
        if (audioTrigger.fadeOut) {
          fadeVolume(0, FADE_DURATION_MS);
          setTimeout(() => audioRef.current?.pause(), FADE_DURATION_MS);
        } else {
          audioRef.current.pause();
        }
      }
    };
  }, [audioTrigger]);

  return null;
};

export default AudioTrigger;
