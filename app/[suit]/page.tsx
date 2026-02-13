"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CardDetail } from "@/components/card-detail";
import { CardList } from "@/components/card-list";
import {
  findCardByParam,
  getAllCards,
  type SuitType,
  toCardQueryParam,
} from "@/lib/tarot-data";

const SUIT_PATHS: SuitType[] = ["major", "wands", "cups", "swords", "pentacles"];

function parseSuitParam(value: string | string[] | undefined): SuitType | null {
  if (!value) return null;
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "majorarcana" || raw === "major") return "major";
  if (SUIT_PATHS.includes(raw as SuitType)) return raw as SuitType;
  return null;
}

function suitPath(suit: SuitType): string {
  return suit === "major" ? "/majorarcana" : `/${suit}`;
}

export default function SuitPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const suit = parseSuitParam(params?.suit);
  const allCards = useMemo(() => getAllCards(), []);
  const [activeCard, setActiveCard] = useState<null | (typeof allCards)[number]>(null);

  useEffect(() => {
    if (!suit) {
      router.replace("/");
      return;
    }

    const cardParam = searchParams.get("card");
    if (!cardParam) {
      setActiveCard(null);
      return;
    }

    const card = findCardByParam(cardParam, allCards);
    if (!card) {
      setActiveCard(null);
      return;
    }

    if (card.suit !== suit) {
      router.replace(`${suitPath(card.suit)}?card=${toCardQueryParam(card.name)}`);
      return;
    }

    setActiveCard(card);
  }, [suit, searchParams, allCards, router]);

  const handleSelectCard = useCallback(
    (card: (typeof allCards)[number]) => {
      if (!suit) return;
      router.push(`${suitPath(suit)}?card=${toCardQueryParam(card.name)}`);
    },
    [router, suit]
  );

  const handleBackToList = useCallback(() => {
    if (!suit) return;
    router.push(suitPath(suit));
  }, [router, suit]);

  if (!suit) return null;

  if (activeCard) {
    return <CardDetail card={activeCard} onBack={handleBackToList} />;
  }

  return (
    <CardList
      suit={suit}
      onBack={() => router.push("/")}
      onSelectCard={handleSelectCard}
    />
  );
}
