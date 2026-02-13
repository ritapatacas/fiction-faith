"use client";

import React from "react"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import type { TarotCard } from "@/lib/tarot-data";

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3.5 text-left active:opacity-70"
      >
        <span className="text-[14px] font-display tracking-[0.12em] uppercase text-foreground/80">
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm leading-relaxed text-foreground/65 font-sans">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MeaningBlock({
  label,
  content,
}: {
  label: string;
  content: string | null;
}) {
  if (!content) return null;
  return (
    <div className="mt-3 first:mt-0">
      <h4 className="text-[11px] font-display tracking-[0.22em] uppercase text-foreground/50 mb-1.5">
        {label}
      </h4>
      <p className="text-sm leading-relaxed text-foreground/65 whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}

function KeywordPill({
  word,
  variant,
}: {
  word: string;
  variant: "upright" | "reversed";
}) {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-xs font-sans tracking-wide
        ${variant === "upright"
          ? "bg-foreground/5 text-foreground/60"
          : "bg-foreground/[0.03] text-foreground/40"
        }`}
    >
      {word}
    </span>
  );
}

export function CardDetail({
  card,
  onBack,
}: {
  card: TarotCard;
  onBack: () => void;
}) {
  const [orientation, setOrientation] = useState<"upright" | "reversed">(
    "upright"
  );
  const meanings = orientation === "upright" ? card.upright : card.reversed;
  const quick = meanings;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
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
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-serif font-medium text-foreground truncate">
            {card.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-8 overflow-y-auto">
        {/* Description */}

        {/* TODO: Add description back in
        <Section title="Description" defaultOpen>
          <p className="whitespace-pre-line">{card.description}</p>
        </Section> */}

        {card.abyss && (
          <Section title="The Abyss" defaultOpen>
            <p className="whitespace-pre-line">{card.abyss}</p>
          </Section>
        )}

        {/* Orientation Toggle */}
        <div className="flex items-center gap-1 my-5 p-1 bg-card border-2 border-foreground">
          {(["upright", "reversed"] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOrientation(o)}
              className={`flex-1 py-1 text-[15px] font-display tracking-[0.26em] uppercase transition-all duration-150 border-2 border-transparent
                ${orientation === o
                  ? "bg-foreground text-primary-foreground border-foreground"
                  : "text-muted-foreground active:text-foreground hover:text-foreground"
                }`}
            >
              {o === "upright" ? "Upright" : "Reversed"}
            </button>
          ))}
        </div>


        {/* Meanings */}
        <AnimatePresence mode="wait">
          <motion.div
            key={orientation}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >


            {/* Keywords */}
            <div className="mb-6">
              {orientation === "upright" && (
                <>
                  <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                    {card.keywords.upright.map((k) => (
                      <KeywordPill key={k} word={k} variant="upright" />
                    ))}
                  </div>
                </>
              )}
              {orientation === "reversed" && (
                <>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {card.keywords.reversed.map((k) => (
                      <KeywordPill key={k} word={k} variant="reversed" />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quick meanings */}

            {(quick.love || quick.career || quick.finances) && (
              <div className="mb-6">
                {quick.love && (
                  <div className="mt-3 first:mt-0">
                    <h4 className="text- font-display font-medium tracking-wider uppercase text-foreground/70 mb-1.5">
                      Love
                    </h4>
                    <p className="text-sm leading-relaxed text-foreground/65 whitespace-pre-line">
                      {quick.love}
                    </p>
                  </div>
                )}
                {quick.career && (
                  <div className="mt-3 first:mt-0">
                    <h4 className="text-sm font-display font-medium tracking-wider uppercase text-foreground/70 mb-1.5">
                    Career
                    </h4>
                    <p className="text-sm leading-relaxed text-foreground/65 whitespace-pre-line">
                      {quick.career}
                    </p>
                  </div>
                )}
                {quick.finances && (
                  <div className="mt-3 first:mt-0">
                    <h4 className="text-sm font-display font-medium tracking-wider uppercase text-foreground/70 mb-1.5">
                    Finances
                    </h4>
                    <p className="text-sm leading-relaxed text-foreground/65 whitespace-pre-line">
                      {quick.finances}
                    </p>
                  </div>
                )}
              </div>
            )}
            <Section title="Overview" >
              <p className="whitespace-pre-line">{meanings.overview}</p>
            </Section>

            {(meanings.love_meaning ||
              meanings.career_meaning ||
              meanings.finances_meaning) && (
              <Section title="Areas">
                <MeaningBlock label="Love" content={meanings.love_meaning} />
                <MeaningBlock label="Career" content={meanings.career_meaning} />
                <MeaningBlock
                  label="Finances"
                  content={meanings.finances_meaning}
                />
              </Section>
            )}

            <Section title="As Feelings">
              <MeaningBlock label="" content={meanings.as_feelings} />
            </Section>

            <Section title="As Actions">
              <MeaningBlock label="" content={meanings.as_actions} />
            </Section>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
