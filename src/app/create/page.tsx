"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-store";
import { CREATIVE_FIELDS, type CreativeField } from "@/lib/types";
import { fileToDataUrl } from "@/lib/utils";

export default function CreatePage() {
  const router = useRouter();
  const { ready, user, profile, createArtwork } = useApp();
  const [title, setTitle] = useState("");
  const [section, setSection] = useState<CreativeField>(profile?.interest ?? "Drawing");
  const [description, setDescription] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ready) return <main className="mx-auto max-w-xl px-4 py-10">Loading...</main>;
  if (!user || !profile) {
    return (
      <main className="mx-auto max-w-xl px-4 py-10">
        <div className="card-surface rounded-[28px] p-8 text-center">
          <p className="text-brown/75">Log in and complete your profile before posting artwork.</p>
          <button className="btn-primary mt-4" onClick={() => router.push(user ? "/profile" : "/login")}>
            Continue
          </button>
        </div>
      </main>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!imageDataUrl) return setError("Please upload an artwork image.");
    setBusy(true);
    setError(null);
    const result = await createArtwork({ title, section, description, imageDataUrl });
    setBusy(false);
    if (result.error) return setError(result.error);
    router.push("/profile");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="card-surface rounded-[28px] p-6 sm:p-8">
        <h1 className="text-3xl font-semibold text-brown">Post your artwork</h1>
        <p className="mt-2 text-sm leading-6 text-brown/70">
          Choose a section for your work. It will appear in your profile showcase and the community feed as a 3D-style art card.
        </p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-brown">Artwork image</span>
            <input
              type="file"
              accept="image/*"
              className="text-sm text-brown/70 file:mr-3 file:rounded-full file:border-0 file:bg-[rgba(201,124,93,0.14)] file:px-3 file:py-2 file:font-medium file:text-rust"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) setImageDataUrl(await fileToDataUrl(f));
              }}
            />
            {imageDataUrl ? (
              <div className="art-stage mt-4 max-w-sm">
                <div className="art-card-3d art-frame aspect-[3/4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageDataUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              </div>
            ) : null}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-brown">Title</span>
            <input className="input-autumn" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-brown">Section</span>
            <select className="input-autumn" value={section} onChange={(e) => setSection(e.target.value as CreativeField)}>
              {CREATIVE_FIELDS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-brown">Description</span>
            <textarea className="input-autumn min-h-28" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What inspired this piece?" />
          </label>
          {error ? <p className="sm:col-span-2 rounded-xl bg-[rgba(168,93,68,0.12)] px-3 py-2 text-sm text-rust">{error}</p> : null}
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={busy} className="btn-primary">{busy ? "Posting..." : "Post artwork"}</button>
            <button type="button" className="btn-secondary" onClick={() => router.push("/")}>Cancel</button>
          </div>
        </form>
      </div>
    </main>
  );
}
