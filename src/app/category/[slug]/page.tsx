"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArtCard } from "@/components/art-card";
import { useApp } from "@/lib/app-store";
import { getCategory } from "@/lib/categories";
import { findArtistByName } from "@/lib/artists";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const category = getCategory(slug || "");
  const { artworks, profile } = useApp();
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");

  const categoryArtworks = useMemo(() => {
    if (!category) return [];
    return artworks
      .filter((a) => category.sections.includes(a.section))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [artworks, category]);

  const filtered = useMemo(() => {
    const q = appliedQuery.trim().toLowerCase();
    if (!q) return categoryArtworks;
    return categoryArtworks.filter((a) => {
      return (
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.section.toLowerCase().includes(q) ||
        a.artistName.toLowerCase().includes(q)
      );
    });
  }, [categoryArtworks, appliedQuery]);

  if (!category) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="card-surface rounded-[24px] p-8">
          <p className="text-brown/75">Category not found.</p>
          <Link href="/" className="btn-primary mt-4">Back home</Link>
        </div>
      </main>
    );
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      setAppliedQuery("");
      return;
    }
    const artist = findArtistByName(q, categoryArtworks, profile);
    if (artist) {
      router.push(`/artist/${encodeURIComponent(artist.id)}`);
      return;
    }
    setAppliedQuery(q);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="card-surface mb-6 rounded-[28px] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rust/80">Category</p>
            <h1 className="mt-1 text-3xl font-semibold text-brown">{category.name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-brown/70">{category.description}</p>
          </div>
          <Link href="/" className="btn-secondary">All categories</Link>
        </div>
        <form onSubmit={onSearch} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            className="input-autumn"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by artist name or art (e.g. pencil sketch)"
            aria-label="Search artworks or artists"
          />
          <button type="submit" className="btn-primary shrink-0">Search</button>
          {appliedQuery ? (
            <button
              type="button"
              className="btn-secondary shrink-0"
              onClick={() => {
                setQuery("");
                setAppliedQuery("");
              }}
            >
              Clear
            </button>
          ) : null}
        </form>
        <p className="mt-3 text-xs text-brown/55">
          Search an artist name to open their profile. Search an art term (like “pencil sketch”) to filter artworks.
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-brown">
          {appliedQuery ? `Results for “${appliedQuery}”` : "Artworks"}
        </h2>
        <p className="text-sm text-brown/60">{filtered.length} work{filtered.length === 1 ? "" : "s"}</p>
      </div>

      {filtered.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((art) => (
            <ArtCard key={art.id} art={art} />
          ))}
        </div>
      ) : (
        <div className="card-surface rounded-[24px] p-8 text-center text-brown/70">
          No artworks found. Try a different search, or post artwork in this category.
        </div>
      )}
    </main>
  );
}
