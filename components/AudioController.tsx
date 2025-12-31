
"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioController() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Royalty-free upbeat lo-fi track
        const audio = new Audio("https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3");
        audio.loop = true;
        audio.volume = 0.5;
        audioRef.current = audio;

        return () => {
            audio.pause();
            audioRef.current = null;
        };
    }, []);

    const toggleAudio = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch((e) => console.log("Playback failed:", e));
        }
        setIsPlaying(!isPlaying);
    };


    // Expose play function to global window for other components to trigger
    useEffect(() => {
        // @ts-ignore
        window.playMusic = () => {
            if (audioRef.current && !isPlaying) {
                audioRef.current.play().catch((e) => console.log("Playback failed:", e));
                setIsPlaying(true);
            }
        }
    }, [isPlaying]);

    // Handle Tab Switching / Visibility Change
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isPlaying && audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isPlaying]);

    return (
        <button
            onClick={toggleAudio}
            className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all shadow-lg"
            aria-label="Toggle Music"
        >
            {isPlaying ? (
                <Volume2 className="w-6 h-6 text-white animate-pulse" />
            ) : (
                <VolumeX className="w-6 h-6 text-gray-400" />
            )}
        </button>
    );
}
