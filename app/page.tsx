"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SuitButtons } from "@/components/suit-buttons";
import { SearchInput } from "@/components/search-input";
import { toCardQueryParam, type TarotCard, type SuitType } from "@/lib/tarot-data";

export default function Home() {
  const router = useRouter();

  const handleSelectSuit = useCallback(
    (suit: SuitType) => {
      const path = suit === "major" ? "/majorarcana" : `/${suit}`;
      router.push(path);
    },
    [router]
  );

  const handleSelectCard = useCallback(
    (card: TarotCard) => {
      const suitPath = card.suit === "major" ? "/majorarcana" : `/${card.suit}`;
      router.push(`${suitPath}?card=${toCardQueryParam(card.name)}`);
    },
    [router]
  );

  return (
    <main className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      <motion.div
        key="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="h-full flex flex-col items-center justify-between px-6 py-4 overflow-hidden"
      >
        {/* Top spacer */}
        <div className="flex-1" />

        {/* Center content */}
        <div className="flex flex-col items-center gap-8">
          <motion.div
            key="suits"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <h1 className="text-6xl pt-10 font-display font-bold leading-[0.8] text-foreground text-left uppercase w-full max-w-xs self-center">
              Fiction
              <br />
              Faith
              <br />
              Bible
            </h1>
            <div className="w-full pt-4 min-w-[250px]">
              <SuitButtons onSelect={handleSelectSuit} />
            </div>
          </motion.div>
        </div>

        {/* Bottom search */}
        <div className="flex-1 flex items-end w-full justify-center pt-6">
          <div className="w-full max-w-[400px]">
            <SearchInput onSelectCard={handleSelectCard} />
          </div>
        </div>
      </motion.div>
    </main>
  );
}
