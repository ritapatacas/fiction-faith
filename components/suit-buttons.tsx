"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWandMagic,
  faCircleDot,
  faCross,
  faSquarePlus,
  faDiamond,
  faHeart,
  faLeaf,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import { SUITS, type SuitType } from "@/lib/tarot-data";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};

export function SuitButtons({
  onSelect,
}: {
  onSelect: (suit: SuitType) => void;
}) {
  const iconBySuit: Record<SuitType, typeof faSquare> = {
    major: faCircleDot,
    wands: faWandMagic,
    cups: faHeart,
    swords: faCross,
    pentacles: faDiamond,
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
      className="flex flex-col w-full max-w-xs bg-card border-2 border-foreground overflow-hidden shadow-[4px_4px_0_0_hsl(var(--foreground))]"
    >
      {SUITS.map((suit) => (
        <motion.button
          key={suit.id}
          variants={item}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(suit.id)}
          className="flex items-center gap-4 px-5 py-5 w-full text-left border-b-2 border-foreground/20 last:border-b-0
                     text-foreground/80 transition-colors active:bg-foreground/10 font-sans"
        >
          <span className="text-lg text-foreground/90 w-6 text-center">
            <FontAwesomeIcon icon={iconBySuit[suit.id]} />
          </span>
          <span className="text-xl tracking-wide font-display uppercase text-foreground">
            {suit.label}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}
