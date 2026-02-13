"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  fa0,
  fa1,
  fa2,
  fa3,
  fa4,
  fa5,
  fa6,
  fa7,
  fa8,
  fa9,
  faFont,
  faParagraph,
  faChessKing,
  faChessKnight,
  faCircleDot,
  faCrown,
  faCross,
  faDiamond,
  faHeart,
  faSquare,
  faWandMagic,
} from "@fortawesome/free-solid-svg-icons";
import { ArrowLeft } from "lucide-react";
import { type TarotCard, type SuitType, getCardsBySuit, SUITS } from "@/lib/tarot-data";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } },
};

export function CardList({
  suit,
  onBack,
  onSelectCard,
}: {
  suit: SuitType;
  onBack: () => void;
  onSelectCard: (card: TarotCard) => void;
}) {
  const cards = getCardsBySuit(suit);
  const suitInfo = SUITS.find((s) => s.id === suit);
  const iconBySuit: Record<SuitType, typeof faSquare> = {
    major: faCircleDot,
    wands: faWandMagic,
    cups: faHeart,
    swords: faCross,
    pentacles: faDiamond,
  };
  const numberIconByValue: Record<string, typeof fa1> = {
    "0": fa0,
    "1": fa1,
    "2": fa2,
    "3": fa3,
    "4": fa4,
    "5": fa5,
    "6": fa6,
    "7": fa7,
    "8": fa8,
    "9": fa9,
  };

  const rankIconByName: Record<string, typeof faFont> = {
    Ace: faFont,
    Page: faParagraph,
    Knight: faChessKnight,
    Queen: faCrown,
    King: faChessKing,
  };

  function renderCardNumberIcon(card: TarotCard) {
    const numericClass = "text-[11px]";
    if (card.suit === "major") {
      const digits = String(card.number).split("");
      return digits.map((d, i) => {
        const icon = numberIconByValue[d];
        if (!icon) return null;
        return (
          <FontAwesomeIcon
            key={`${card.slug}-major-${i}`}
            className={numericClass}
            icon={icon}
          />
        );
      });
    }

    const rank = card.name.split(" of ")[0] ?? "";
    if (rankIconByName[rank]) {
      return <FontAwesomeIcon icon={rankIconByName[rank]} />;
    }

    if (rank === "Ten") {
      return (
        <>
          <FontAwesomeIcon className={numericClass} icon={fa1} />
          <FontAwesomeIcon className={numericClass} icon={fa0} />
        </>
      );
    }

    const numberMap: Record<string, typeof fa2> = {
      Two: fa2,
      Three: fa3,
      Four: fa4,
      Five: fa5,
      Six: fa6,
      Seven: fa7,
      Eight: fa8,
      Nine: fa9,
    };
    const numberIcon = numberMap[rank];
    return numberIcon ? (
      <FontAwesomeIcon className={numericClass} icon={numberIcon} />
    ) : null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col w-full max-w-md mx-auto min-h-[100dvh]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe-top py-4 sticky top-0 bg-background/90 backdrop-blur-sm z-10">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-lg active:bg-accent transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-foreground/60" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-base text-foreground leading-none self-center">
            <FontAwesomeIcon icon={iconBySuit[suit]} />
          </span>
          <h1 className="text-xl font-display font-medium text-foreground self-end">
            {suitInfo?.label}
          </h1>
        </div>
      </div>

      {/* Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 px-4 pb-8"
      >
        {cards.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-muted-foreground font-sans">
              No cards added for this suit yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col bg-card border-2 border-foreground overflow-hidden shadow-[4px_4px_0_0_hsl(var(--foreground))]">
            {cards.map((card) => (
              <motion.button
                key={card.slug}
                variants={item}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectCard(card)}
                className="flex items-center gap-4 px-5 py-4 w-full text-left border-b-2 border-foreground/20 last:border-b-0
                           text-foreground/80 transition-colors active:bg-foreground/10 font-sans"
              >
                <span className="text-sm font-display text-foreground w-6 text-center tabular-nums flex items-center justify-center gap-0.5">
                  {renderCardNumberIcon(card)}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-md font-serif text-foreground block truncate">
                    {card.name}
                  </span>
                  <span className="text-xs text-muted-foreground/80 font-sans block truncate mt-0.3">
                    {card.keywords.upright.slice(0, 3).join(" \u00b7 ")}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
