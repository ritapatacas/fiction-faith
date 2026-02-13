"use client";

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { searchCards, type TarotCard } from "@/lib/tarot-data";

export function SearchInput({
  onSelectCard,
}: {
  onSelectCard: (card: TarotCard) => void;
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<TarotCard[]>([]);
  const [textWidth, setTextWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (measureRef.current) {
      setTextWidth(measureRef.current.offsetWidth);
    }
  }, [query]);

  const handleChange = useCallback((value: string) => {
    setQuery(value);
    if (value.trim().length > 0) {
      setResults(searchCards(value));
    } else {
      setResults([]);
    }
  }, []);

  const handleSelect = useCallback(
    (card: TarotCard) => {
      setQuery("");
      setResults([]);
      setFocused(false);
      inputRef.current?.blur();
      onSelectCard(card);
    },
    [onSelectCard]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  }, []);

  // Close results on escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setFocused(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-xl">
      {/* Results dropdown - rendered above the input */}
      <AnimatePresence>
        {focused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 right-0 mb-3 bg-card border-2 border-foreground
                       overflow-hidden max-h-72 overflow-y-auto shadow-[4px_4px_0_0_hsl(var(--foreground))]"
          >
            {results.map((card) => (
              <button
                key={card.slug}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(card);
                }}
                className="w-full flex items-center gap-4 px-5 py-4 text-left border-b-2 border-foreground/20 last:border-b-0
                           transition-colors active:bg-foreground/10 font-sans"
              >
                <span className="text-sm text-muted-foreground font-bold uppercase tracking-widest w-8 text-center">
                  {card.number}
                </span>
                <span className="text-base font-semibold text-foreground">
                  {card.name}
                </span>
              </button>
            ))}
          </motion.div>
        )}
        {focused && query.trim().length > 0 && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-full left-0 right-0 mb-3 bg-card border-2 border-foreground
                       px-5 py-4 text-base font-semibold text-muted-foreground text-center"
          >
            No cards found
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input - brutalist: big, bold, thick borders */}
      <div className="flex items-center gap-4 px-2 pt-4 mb-20 bg-transparent">
        <div className="relative flex-1 flex items-center min-w-0">
          {/* Hidden span to measure text width for cursor position */}
          <span
            ref={measureRef}
            aria-hidden
            className="invisible absolute left-0 top-0 whitespace-pre text-2xl font-bold font-sans pointer-events-none"
          >
            {query || "\u00A0"}
          </span>
          {/* Blinking cursor - same design when focused or not (native caret hidden) */}
          <span
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-7 bg-foreground animate-caret pointer-events-none"
            style={{ left: textWidth }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            className={`w-full bg-transparent text-2xl font-bold text-foreground placeholder:text-muted-foreground/70
                       outline-none font-sans caret-transparent border-b-2 py-3 transition-colors duration-200
                       ${focused ? "border-foreground" : "border-foreground/40"}`}
          />
        </div>
        <AnimatePresence>
          {query.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="text-muted-foreground active:text-foreground shrink-0 p-1 -m-1"
              aria-label="Clear search"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
