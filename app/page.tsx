
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { decodeData } from "@/lib/url-helper";
import AudioController from "@/components/AudioController";
import CreatorForm from "@/components/CreatorForm";
import CardDisplay from "@/components/CardDisplay";
import GiftBox from "@/components/GiftBox";
import { Suspense } from "react";

function HomeContent() {
  const searchParams = useSearchParams();
  const d = searchParams.get("d");

  const [cardData, setCardData] = useState<any>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (d) {
      const decoded = decodeData(d);
      setCardData(decoded);
    }
  }, [d]);

  // Receiver Mode
  if (cardData) {
    return (
      <main className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center bg-black text-white">
        <AudioController />

        {!isRevealed && <GiftBox onOpen={() => setIsRevealed(true)} />}

        {isRevealed && <CardDisplay data={cardData} />}
      </main>
    );
  }

  // Creator Mode
  return (

    <main className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-4 bg-black">
      <div className="relative z-10 w-full">
        <CreatorForm />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}
