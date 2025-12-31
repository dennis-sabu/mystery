
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TEMPLATES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { Zap } from "lucide-react";

interface CardDisplayProps {
    data: {
        n: string; // Name
        m: string; // Message
        t: string; // Template ID
    };
}

export default function CardDisplay({ data }: CardDisplayProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    const template = TEMPLATES.find((t) => t.id === data.t) || TEMPLATES[0];

    // Map templates to specific emoji images for the "Side Decor"
    const getTemplateImage = (id: string) => {
        switch (id) {
            case '1': return "/emoji/emoji_1.png";
            case '2': return "/emoji/emoji_6.png";
            case '3': return "/emoji/emoji_4.png";
            case '4': return "/emoji/emoji8.png";
            case '5': return "/emoji/image_9.png";
            case '6': return "/emoji/emoji_3.png";
            case '7': return "/emoji/emoji_2.png";
            default: return "/emoji/emoji8.png";
        }
    };

    const sideImage = getTemplateImage(template.id);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Card Appearance
            gsap.from(cardRef.current, {
                y: 100,
                scale: 0.9,
                opacity: 0,
                duration: 1.2,
                ease: "power4.out",
            });

            // Text Glow and Float
            gsap.to(textRef.current, {
                textShadow: "0 0 20px " + template.accentColor + ", 0 0 40px " + template.accentColor,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // Floating images on the sides
            gsap.to(".side-decor", {
                y: -20,
                rotation: 15,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.5
            });

            // Confetti Burst
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: [template.accentColor, "#FF007A", "#FFD600"],
            });

        }, containerRef);

        return () => ctx.revert();
    }, [template]);

    return (
        <div ref={containerRef} className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0a0a]">


            {/* THE CARD ITSELF */}
            <div
                ref={cardRef}
                className={cn(
                    "relative w-full max-w-sm aspect-[3/5] rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col items-center justify-center p-8",
                    "transition-transform hover:scale-[1.02] duration-500 bg-black border-2",
                    template.id === '1' ? "border-[#FF007A]/30" :
                        template.id === '2' ? "border-emerald-500/30" :
                            template.id === '3' ? "border-[#FF007A]/30" :
                                template.id === '4' ? "border-yellow-400/30" :
                                    template.id === '5' ? "border-purple-500/30" :
                                        template.id === '6' ? "border-[#ccff00]/30" :
                                            "border-red-500/30"
                )}
            >
                {/* Background Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-transparent via-transparent to-transparent z-0 overflow-hidden">
                    <div className="absolute top-10 right-10 w-40 h-40 rounded-full blur-[100px] opacity-20" style={{ backgroundColor: template.id === '6' ? '#ccff00' : template.accentColor }} />
                    <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full blur-[100px] opacity-20" style={{ backgroundColor: template.id === '6' ? '#ccff00' : template.accentColor }} />
                </div>

                {/* Side Decorations */}
                <img
                    src={sideImage}
                    className="side-decor absolute top-1/2 -left-4 w-32 h-32 object-contain opacity-40 -rotate-12 z-0 filter blur-[1px]"
                    alt="Decor"
                />
                <img
                    src={sideImage}
                    className="side-decor absolute -bottom-12 -right-4 w-48 h-48 object-contain opacity-40 rotate-12 z-0 filter blur-[1px]"
                    alt="Decor"
                />


                {/* Main Glowing Headline */}
                <h1
                    ref={textRef}
                    className={cn(
                        "text-4xl md:text-5xl font-black mb-2 leading-tight uppercase text-center relative z-20",
                        template.id === '6' ? "text-[#ccff00]" : "text-white"
                    )}
                    style={{
                        fontFamily: template.id === '2' ? 'var(--font-press-start)' :
                            template.id === '4' ? 'var(--font-permanent-marker)' :
                                template.id === '6' ? 'var(--font-permanent-marker)' :
                                    template.id === '1' ? 'var(--font-syne)' :
                                        'var(--font-heading)',
                        fontSize: template.id === '2' ? '1.2rem' : '3.5rem',
                        lineHeight: template.id === '2' ? '1.5' : '1.1',
                        letterSpacing: template.id === '1' ? '0.1em' : 'normal',
                        fontWeight: template.id === '1' ? '800' : '900'
                    }}
                >
                    Happy <br />
                    New <br />
                    Year <br />
                    <span className="block mt-2 text-5xl md:text-7xl" style={{ color: template.id === '6' ? '#ccff00' : template.accentColor }}>2026</span>
                </h1>

                {/* Recipient Name - Now below the heading */}
                <div className="relative z-20 mb-8 mt-4">
                    <p
                        className="text-xl font-black tracking-[0.2em] uppercase italic opacity-90"
                        style={{
                            color: template.id === '6' ? '#ccff00' : 'white',
                            textShadow: `0 0 15px ${template.id === '6' ? '#ccff00' : template.accentColor}`
                        }}
                    >
                        {data.n}
                    </p>
                </div>

                {/* The Message */}
                <div className="relative z-20 max-w-[280px] text-center">
                    <p className="text-gray-400 font-medium text-lg leading-relaxed italic opacity-80 backdrop-blur-sm bg-black/20 rounded-2xl p-4">
                        "{data.m}"
                    </p>
                </div>

                {/* Signature Bottom */}
                <div className="absolute bottom-10 left-0 w-full px-10 flex justify-between items-center opacity-40 relative z-20 mt-10">
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-white/20 to-transparent" />
                    <div className="px-4 text-[10px] font-bold text-white tracking-[0.3em] uppercase">VIBE_CHECK</div>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                </div>
            </div>

            {/* Create Button */}
            <div className="mt-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                <a
                    href="/"
                    className="flex items-center gap-3 px-10 py-4 rounded-full bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                    <Zap className="w-5 h-5 fill-black" />
                    Make Your Own
                </a>
            </div>
        </div>
    );
}
