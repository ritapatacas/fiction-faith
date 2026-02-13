export interface TarotCard {
  slug: string;
  title: string;
  name: string;
  number: string;
  suit: SuitType;
  abyss: string | null;
    keywords: {
      upright: string[];
      reversed: string[];
    };
    description: string;
    upright: {
    overview: string;
    love_meaning: string | null;
    career_meaning: string | null;
    finances_meaning: string | null;
    as_feelings: string | null;
    as_actions: string | null;
    love: string | null;
    career: string | null;
    finances: string | null;
  };
    reversed: {
    overview: string;
    love_meaning: string | null;
    career_meaning: string | null;
    finances_meaning: string | null;
    as_feelings: string | null;
    as_actions: string | null;
    love: string | null;
    career: string | null;
    finances: string | null;
  };
}

export type SuitType =
  | "major"
  | "wands"
  | "cups"
  | "swords"
  | "pentacles";

export const SUITS: { id: SuitType; label: string; symbol: string }[] = [
  { id: "major", label: "Major Arcana", symbol: "\u2726" },
  { id: "wands", label: "Wands", symbol: "\u2758" },
  { id: "cups", label: "Cups", symbol: "\u25CB" },
  { id: "swords", label: "Swords", symbol: "\u2020" },
  { id: "pentacles", label: "Pentacles", symbol: "\u2B23" },
];

type RawCard = {
  title?: string;
  keywords?: {
    upright?: string[] | null;
    reversed?: string[] | null;
  };
  description?: string | null;
  abyss?: string | null;
  upright?: {
    overview?: string | null;
    love_meaning?: string | null;
    career_meaning?: string | null;
    finances_meaning?: string | null;
    as_feelings?: string | null;
    as_actions?: string | null;
    love?: string | null;
    career?: string | null;
    finances?: string | null;
  };
  reversed?: {
    overview?: string | null;
    love_meaning?: string | null;
    career_meaning?: string | null;
    finances_meaning?: string | null;
    as_feelings?: string | null;
    as_actions?: string | null;
    love?: string | null;
    career?: string | null;
    finances?: string | null;
  };
};

// Webpack helper for Next to load all json files in client bundle
declare const require: {
  context(
    path: string,
    recursive: boolean,
    regExp: RegExp
  ): {
    keys(): string[];
    <T = unknown>(id: string): T;
  };
};

const ctx = require.context("../cards_json", false, /\.json$/);

function toSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function parseFilename(
  file: string
): {
  slug: string;
  title: string;
  name: string;
  suit: SuitType;
  number: string;
} | null {
  const base = file.replace(/^.*\//, "").replace(/\.json$/, "");

  // Major Arcana: "00_The Fool"
  if (/^\d{2}_/.test(base)) {
    const [num, title] = base.split("_", 2);
    const name = title.trim();
    return {
      slug: toSlug(name),
      title: name,
      name,
      suit: "major",
      number: String(parseInt(num, 10)),
    };
  }

  // Minor Arcana: "CUPS_01_Ace", "SWORDS_11_Page"
  if (!/^[A-Z]+_\d{2}_[A-Za-z]+$/.test(base)) {
    return null;
  }
  const [suitRaw, numRaw, rankRaw] = base.split("_");
  const suit = suitRaw.toLowerCase() as SuitType;
  if (!rankRaw) return null;
  const rank = rankRaw.trim();
  const name = `${rank} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`;
  const title = name;

  const rankMap: Record<string, string> = {
    Ace: "A",
    Two: "2",
    Three: "3",
    Four: "4",
    Five: "5",
    Six: "6",
    Seven: "7",
    Eight: "8",
    Nine: "9",
    Ten: "10",
    Page: "P",
    Knight: "K",
    Queen: "Q",
    King: "K",
  };

  const number = rankMap[rank] ?? String(parseInt(numRaw, 10));

  return {
    slug: toSlug(`${rank}-of-${suit}`),
    title,
    name,
    suit,
    number,
  };
}

const ALL_CARDS: TarotCard[] = ctx
  .keys()
  .reduce<TarotCard[]>((acc, key) => {
    const meta = parseFilename(key);
    if (!meta) return acc;
    const raw = ctx<RawCard>(key);

    acc.push({
      slug: meta.slug,
      title: raw.title || meta.title,
      name: meta.name,
      number: meta.number,
      suit: meta.suit,
    keywords: {
      upright: raw.keywords?.upright ?? [],
      reversed: raw.keywords?.reversed ?? [],
    },
    description: raw.description ?? "",
    abyss: raw.abyss ?? null,
      upright: {
        overview: raw.upright?.overview ?? "",
        love_meaning: raw.upright?.love_meaning ?? null,
        career_meaning: raw.upright?.career_meaning ?? null,
        finances_meaning: raw.upright?.finances_meaning ?? null,
        as_feelings: raw.upright?.as_feelings ?? null,
        as_actions: raw.upright?.as_actions ?? null,
        love: raw.upright?.love ?? null,
        career: raw.upright?.career ?? null,
        finances: raw.upright?.finances ?? null,
      },
      reversed: {
        overview: raw.reversed?.overview ?? "",
        love_meaning: raw.reversed?.love_meaning ?? null,
        career_meaning: raw.reversed?.career_meaning ?? null,
        finances_meaning: raw.reversed?.finances_meaning ?? null,
        as_feelings: raw.reversed?.as_feelings ?? null,
        as_actions: raw.reversed?.as_actions ?? null,
        love: raw.reversed?.love ?? null,
        career: raw.reversed?.career ?? null,
        finances: raw.reversed?.finances ?? null,
      },
    });

    return acc;
  }, []);

export function getAllCards(): TarotCard[] {
  return ALL_CARDS;
}

export function getCardBySlug(slug: string): TarotCard | undefined {
  return ALL_CARDS.find((c) => c.slug === slug);
}

export function getCardsBySuit(suit: SuitType): TarotCard[] {
  return ALL_CARDS.filter((c) => c.suit === suit);
}

export function searchCards(query: string): TarotCard[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ALL_CARDS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.keywords.upright.some((k) => k.toLowerCase().includes(q)) ||
      c.keywords.reversed.some((k) => k.toLowerCase().includes(q))
  );
}

function normalizeCardId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function toCardQueryParam(name: string): string {
  const words = name
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w.toLowerCase() !== "of");
  return words.join("");
}

export function findCardByParam(
  value: string,
  cards: TarotCard[]
): TarotCard | undefined {
  if (!value) return undefined;
  const normalized = normalizeCardId(value);

  const slugCard = getCardBySlug(
    value.trim().toLowerCase().replace(/\s+/g, "-")
  );
  if (slugCard) return slugCard;

  return cards.find((card) => {
    const slugId = normalizeCardId(card.slug);
    const nameId = normalizeCardId(card.name);
    const nameNoOf = normalizeCardId(card.name.replace(/\bof\b/gi, ""));
    const titleId = normalizeCardId(card.title);
    return (
      normalized === slugId ||
      normalized === nameId ||
      normalized === nameNoOf ||
      normalized === titleId
    );
  });
}
