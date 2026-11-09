"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArtCard } from "@/components/art-card";
import { useApp } from "@/lib/app-store";

export default function SavedPage() {
  const { artworks, savedIds } = useApp();
  const items = useMemo(
    () => artworks.filter((a) => savedIds.includes(a.id)).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [artworks, savedIds],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-brown">Saved works</h1>
          <p className="mt-1 text-sm text-brown/65">Artwork you saved from the community.</p>
        </div>
        <Link href="/" className="btn-secondary">Back home</Link>
      </div>
      {items.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((art) => (
            <ArtCard key={art.id} art={art} />
          ))}
        </div>
      ) : (
        <div className="card-surface rounded-[24px] p-8 text-center text-brown/70">
          No saved artworks yet.
        </div>
      )}
    </main>
  );
}
