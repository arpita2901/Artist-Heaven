"use client";

import Link from "next/link";
import type { Artwork } from "@/lib/types";
import { useApp } from "@/lib/app-store";

export function ArtCard({ art }: { art: Artwork }) {
  const { profile, savedIds, artworkReactions, toggleSave, deleteArtwork, reactToArtwork } = useApp();
  const saved = savedIds.includes(art.id);
  const reaction = artworkReactions[art.id];
  const canDelete = profile?.id === art.artistId;

  return (
    <article className="art-stage">
      <div className="art-card-3d card-surface rounded-[24px] p-3">
        <div className="art-frame aspect-[3/4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={art.imageDataUrl} alt={art.title} className="block h-full w-full object-cover" />
        </div>
        <div className="px-1 pb-1 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-brown">{art.title}</h3>
              <p className="text-sm text-brown/65">
                <Link href={`/artist/${encodeURIComponent(art.artistId)}`} className="hover:text-rust hover:underline">
                  {art.artistName}
                </Link>
                {" · "}
                <span className="text-rust">{art.section}</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => toggleSave(art.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium border transition ${
                  saved
                    ? "border-transparent bg-[rgba(201,124,93,0.16)] text-rust"
                    : "border-[var(--border)] bg-white/60 text-brown/75 hover:bg-white"
                }`}
                aria-label={saved ? "Unsave artwork" : "Save artwork"}
              >
                {saved ? "Saved" : "Save"}
              </button>
              {canDelete ? (
                <button
                  onClick={() => {
                    if (window.confirm("Delete this post?")) deleteArtwork(art.id);
                  }}
                  className="rounded-full border border-[rgba(168,93,68,0.25)] bg-white/60 px-3 py-1.5 text-sm font-medium text-rust transition hover:bg-[rgba(168,93,68,0.08)]"
                  aria-label="Delete artwork"
                >
                  Delete
                </button>
              ) : null}
            </div>
          </div>
          {art.description ? (
            <p className="mt-3 text-sm leading-6 text-brown/75">{art.description}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => reactToArtwork(art.id, "like")}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                reaction === "like"
                  ? "border-transparent bg-[rgba(138,154,123,0.22)] text-olive"
                  : "border-[var(--border)] bg-white/60 text-brown/75 hover:bg-white"
              }`}
              aria-label="Like artwork"
            >
              Like {art.likes ?? 0}
            </button>
            <button
              onClick={() => reactToArtwork(art.id, "dislike")}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                reaction === "dislike"
                  ? "border-transparent bg-[rgba(168,93,68,0.14)] text-rust"
                  : "border-[var(--border)] bg-white/60 text-brown/75 hover:bg-white"
              }`}
              aria-label="Dislike artwork"
            >
              Dislike {art.dislikes ?? 0}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
