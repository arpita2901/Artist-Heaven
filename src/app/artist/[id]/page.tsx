"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArtCard } from "@/components/art-card";
import { useApp } from "@/lib/app-store";
import { getArtistSummary } from "@/lib/artists";

export default function ArtistPage() {
  const params = useParams<{ id: string }>();
  const artistId = decodeURIComponent(Array.isArray(params.id) ? params.id[0] : params.id || "");
  const { artworks, profile } = useApp();

  const artist = useMemo(
    () => getArtistSummary(artistId, artworks, profile),
    [artistId, artworks, profile],
  );
  const works = useMemo(
    () => artworks.filter((a) => a.artistId === artistId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [artworks, artistId],
  );
  const sections = Array.from(new Set(works.map((w) => w.section)));

  if (!artist) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="card-surface rounded-[24px] p-8">
          <p className="text-brown/75">Artist not found.</p>
          <Link href="/" className="btn-primary mt-4">Back home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="card-surface mb-6 rounded-[28px] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-white/60">
              {artist.avatarDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={artist.avatarDataUrl} alt={artist.name} className="block h-full w-full object-cover object-center" />
              ) : (
                <div className="grid h-full w-full place-items-center text-2xl text-brown/40">◎</div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-brown">{artist.name}</h1>
              {artist.interest ? <p className="mt-1 text-sm text-rust">{artist.interest}</p> : null}
              {artist.bio ? <p className="mt-2 max-w-2xl text-sm leading-6 text-brown/70">{artist.bio}</p> : null}
            </div>
          </div>
          <Link href="/" className="btn-secondary">Back home</Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-brown">Artworks</h2>
        {works.length === 0 ? (
          <div className="card-surface rounded-[24px] p-8 text-center text-brown/70">No artworks yet.</div>
        ) : (
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section}>
                <h3 className="mb-3 text-lg font-semibold text-rust">{section}</h3>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {works.filter((a) => a.section === section).map((art) => (
                    <ArtCard key={art.id} art={art} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
