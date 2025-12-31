
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import useEmblaCarousel from "embla-carousel-react";
import { SURPRISE_MESSAGES, TEMPLATES } from "@/lib/constants";
import { encodeData } from "@/lib/url-helper";
import { Sparkles, ArrowRight, Wand2, Star, Zap, Palette, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreatorForm() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "center", containScroll: "trimSnaps" });

    // Form State
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("1");
    const [generatedLink, setGeneratedLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [step, setStep] = useState(1); // 1: Name, 2: Template, 3: Message/Result
    const [isGeneratingWish, setIsGeneratingWish] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Bouncy entrance for Headline
            gsap.from(".hero-word", {
                y: 100,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "elastic.out(1, 0.5)",
            });

            // Floating blobs
            gsap.to(".blob", {
                y: -20,
                rotation: 10,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.5
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (emblaApi) {
            emblaApi.on("select", () => {
                const index = emblaApi.selectedScrollSnap();
                setSelectedTemplate(TEMPLATES[index].id);
            });
        }
    }, [emblaApi]);


    const handleSurpriseMe = async () => {
        setIsGeneratingWish(true);
        try {
            const response = await fetch("/api/generate-wish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Gemini API Error details:", errorData);
                throw new Error(errorData.message || "API failed");
            }

            const data = await response.json();
            if (data.wish) {
                setMessage(data.wish);
            } else {
                // Fallback to static message
                const randomMsg = SURPRISE_MESSAGES[Math.floor(Math.random() * SURPRISE_MESSAGES.length)];
                setMessage(randomMsg);
            }
        } catch (error) {
            console.error("Failed to generate wish:", error);
            // Fallback to static message on error
            const randomMsg = SURPRISE_MESSAGES[Math.floor(Math.random() * SURPRISE_MESSAGES.length)];
            setMessage(randomMsg);
        } finally {
            setIsGeneratingWish(false);
        }
    };

    const handleNext = () => {
        if (step === 1 && !name.trim()) return alert("Hey! We need a name to start the party.");
        if (step < 3) setStep(step + 1);
        else generateLink();
    };


    const generateLink = () => {
        const finalMessage = message || "Happy New Year! 2026 is gonna be epic.";
        const data = { n: name, m: finalMessage, t: selectedTemplate };
        const encoded = encodeData(data);
        const link = `${window.location.origin}?d=${encoded}`;
        setGeneratedLink(link);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div ref={containerRef} className="w-full min-h-screen flex flex-col relative z-10 font-[family-name:var(--font-heading)] pb-20 bg-[#0a0a0a] bg-noise">

            {/* Header / Logo Area */}
            <div className="w-full flex justify-center p-6 fixed top-0 z-50">
                <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 flex items-center gap-2">
                    <Smile className="w-5 h-5 text-[#FFD600]" />
                    <span className="text-sm font-bold text-white tracking-wider">VIBE_CHECK 2026</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 mt-20">

                {/* Hero Section */}
                <div className="text-center mb-10 relative">
                    <div className="blob absolute top-0 -left-20 w-32 h-32 bg-[#FF6600] rounded-full blur-[80px] opacity-40 animate-pulse" />
                    <div className="blob absolute bottom-0 -right-20 w-32 h-32 bg-[#9D00FF] rounded-full blur-[80px] opacity-40 animate-pulse delay-1000" />

                    <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-xl transform -rotate-2">
                        <div className="hero-word">Send</div>
                        <div className="hero-word text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] to-[#FFD600]">Crazy</div>
                        <div className="hero-word text-stroke-purple">Wishes</div>
                    </h1>
                </div>


                {/* Interactive Card Stack */}
                <div className="w-full max-w-sm relative">
                    {!generatedLink ? (
                        <div className="rounded-[2rem] p-6 relative overflow-hidden">
                            {/* Fun Progress Bar */}
                            <div className="flex gap-2 mb-6 justify-center">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className={`h-2 rounded-full transition-all duration-300 ${step >= s ? 'w-8 bg-[#FFD600]' : 'w-2 bg-white/20'}`} />
                                ))}
                            </div>

                            {/* Step 1: Messy Input */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in zoom-in fade-in duration-300 text-center">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Who's the Star? ⭐</h2>
                                        <p className="text-sm text-gray-400">Type the name of the legend.</p>
                                    </div>
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Name here..."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-[#0a0a0a] border-2 border-[#333] hover:border-[#FF6600] focus:border-[#FFD600] rounded-xl px-4 py-5 text-xl font-bold text-center text-white placeholder:text-gray-700 outline-none transition-all transform hover:scale-105 focus:scale-100"
                                    />
                                </div>
                            )}

                            {/* Step 2: Visuals (Carousel) */}
                            {step === 2 && (
                                <div className="space-y-4 animate-in slide-in-from-right fade-in duration-300">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-white mb-1">Pick a Flavor 🍦</h2>
                                        <p className="text-sm text-gray-400">Swipe for the vibe.</p>
                                    </div>

                                    <div className="overflow-hidden -mx-6" ref={emblaRef}>
                                        <div className="flex touch-pan-y">
                                            {TEMPLATES.map((t) => (
                                                <div className="flex-[0_0_70%] min-w-0 pl-4 py-4 relative" key={t.id}>
                                                    <div
                                                        onClick={() => { setSelectedTemplate(t.id); }}
                                                        className={cn(
                                                            "aspect-[3/4] rounded-2xl p-6 flex flex-col justify-end border-2 transition-all duration-300 relative overflow-hidden group cursor-pointer",
                                                            selectedTemplate === t.id ? "border-[#9D00FF] shadow-[0_0_0_4px_rgba(157,0,255,0.2)] scale-100" : "border-white/10 opacity-60 scale-90 grayscale"
                                                        )}
                                                    >
                                                        {/* Thumbnail Image */}
                                                        <img
                                                            src={t.thumbnail}
                                                            alt={t.name}
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                                                        />

                                                        {/* Gradient Overlay for Text Readability */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                                        <div className="relative z-10 text-left">
                                                            <div className="w-8 h-8 rounded-full mb-2 flex items-center justify-center bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-lg">
                                                                <Palette className="w-4 h-4" />
                                                            </div>
                                                            <h3 className="text-white font-bold text-lg leading-tight uppercase tracking-wide drop-shadow-md">{t.name}</h3>
                                                            {selectedTemplate === t.id && (
                                                                <p className="text-[10px] text-gray-200 mt-1 font-sans opacity-90 line-clamp-2">{t.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Message & Generation */}
                            {step === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-white mb-1">The Magic Words ✨</h2>
                                        <p className="text-sm text-gray-400">Or let AI capture the vibe.</p>
                                    </div>

                                    <div className="bg-[#222] rounded-2xl p-4 border-2 border-white/5 relative group focus-within:border-[#FF6600]">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Message</label>
                                            <button
                                                onClick={handleSurpriseMe}
                                                disabled={isGeneratingWish}
                                                className="text-[10px] bg-[#9D00FF] text-white px-2 py-1 rounded-md flex items-center gap-1 hover:bg-[#b033ff] transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Wand2 className="w-3 h-3" />
                                                {isGeneratingWish ? 'Cooking...' : 'AI SPICE'}
                                            </button>
                                        </div>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Write something cool..."
                                            className="w-full bg-transparent text-sm text-white resize-none outline-none h-24 placeholder:text-gray-600 font-sans font-medium"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Navigation Action */}
                            <div className="mt-8">
                                <button
                                    onClick={handleNext}
                                    ref={btnRef}
                                    className="w-full py-4 rounded-xl bg-[#FF6600] text-white font-black uppercase tracking-wider hover:bg-[#ff7a22] hover:-translate-y-1 active:translate-y-0 transition-all shadow-[0_4px_0_#cc5200] flex items-center justify-center gap-2 group text-lg"
                                >
                                    {step === 3 ? "Launch It 🚀" : "Let's Go"}
                                    {step !== 3 && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </div>

                        </div>

                    ) : (
                        <div className="rounded-[2rem] p-8 text-center animate-in bounce-in duration-700 relative overflow-hidden">
                            {/* Confetti-like decor */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF6600] via-[#9D00FF] to-[#FFD600]" />

                            <div className="w-20 h-20 rounded-full bg-[#FFD600] text-black flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
                                <Smile className="w-10 h-10 fill-black" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-2 transform -rotate-1">It's Alive!</h3>
                            <p className="text-sm text-gray-400 mb-8 font-sans">Your card is ready to break the internet.</p>

                            <div className="bg-black rounded-xl p-4 mb-4 border border-white/10 flex items-center gap-2">
                                <code className="text-xs text-[#FF6600] flex-1 truncate font-mono">{generatedLink}</code>
                            </div>

                            <button
                                onClick={copyToClipboard}
                                className="w-full py-4 rounded-xl bg-white text-black font-black text-sm uppercase mb-3 hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                {copied ? "Copied! 🎉" : "Copy Link"}
                            </button>
                            <button
                                onClick={() => { setGeneratedLink(""); setStep(1); }}
                                className="text-xs text-gray-500 hover:text-[#9D00FF] transition-colors font-bold uppercase tracking-widest"
                            >
                                Start Over
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

