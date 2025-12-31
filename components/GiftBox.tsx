
"use client";

import { useState } from "react";
import gsap from "gsap";
import confetti from "canvas-confetti";

interface GiftBoxProps {
    onOpen: () => void;
}

export default function GiftBox({ onOpen }: GiftBoxProps) {
    const [isOpened, setIsOpened] = useState(false);

    const handleClick = () => {
        if (isOpened) return;
        setIsOpened(true);

        // Initial confetti burst
        confetti({
            particleCount: 150,
            spread: 60,
            origin: { y: 0.7 },
        });

        // Play music via global handler if available
        // @ts-ignore
        if (window.playMusic) window.playMusic();

        // Animate out
        gsap.to(".gift-box", {
            scale: 5,
            opacity: 0,
            duration: 0.8,
            ease: "power4.in",
            onComplete: onOpen,
        });
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black">
            <div
                onClick={handleClick}
                className="gift-box cursor-pointer animate-bounce hover:scale-110 transition-transform duration-300"
            >
                <div className="text-9xl filter drop-shadow-[0_0_50px_rgba(255,255,255,0.5)]">
                    🎁
                </div>
                <p className="mt-8 text-center text-white/60 font-mono animate-pulse">
                    Click to Open Your Vibe
                </p>
            </div>
        </div>
    );
}
