import React from "react";

const SUIT_SEGMENTS: { suit: string }[] = [
  { suit: "majorarcana" },
  { suit: "wands" },
  { suit: "cups" },
  { suit: "swords" },
  { suit: "pentacles" },
];

export function generateStaticParams() {
  return SUIT_SEGMENTS;
}

export default function SuitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      {children}
    </React.Suspense>
  );
}
