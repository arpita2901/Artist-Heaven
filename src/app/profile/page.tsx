"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArtCard } from "@/components/art-card";
import { useApp } from "@/lib/app-store";
import { CREATIVE_FIELDS, type CreativeField, type Profile } from "@/lib/types";
import { fileToDataUrl } from "@/lib/utils";

function ProfileForm({
  profile,
  onSave,
}: {
  profile: Profile | null;
  onSave: (input: Omit<Profile, "id" | "email">) => Promise<void>;
}) {
  const [name, setName] = useState(profile?.name ?? "");
  const [interest, setInterest] = useState<CreativeField>(profile?.interest ?? "Drawing");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | undefined>(profile?.avatarDataUrl);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({ name, interest, bio, avatarDataUrl });
    setSaving(false);
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-brown">Profile picture</span>
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-[rgba(183,196,168,0.22)] text-brown/50">
            {avatarDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarDataUrl} alt="Avatar preview" className="block h-full w-full object-cover object-center" />
            ) : (
              "◎"
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="text-sm text-brown/70 file:mr-3 file:rounded-full file:border-0 file:bg-[rgba(201,124,93,0.14)] file:px-3 file:py-2 file:font-medium file:text-rust"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) setAvatarDataUrl(await fileToDataUrl(f));
            }}
          />
        </div>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-brown">Name</span>
        <input className="input-autumn" required value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-brown">Creative interest</span>
        <select className="input-autumn" value={interest} onChange={(e) => setInterest(e.target.value as CreativeField)}>
          {CREATIVE_FIELDS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-brown">Bio</span>
        <textarea className="input-autumn min-h-28" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell people about your creative practice..." />
      </label>
      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { ready, user, profile, artworks, savedIds, saveProfile } = useApp();
  const [showSettings, setShowSettings] = useState(false);

  if (!ready) return <main className="mx-auto max-w-5xl px-4 py-10">Loading...</main>;
  if (!user) {
    return (
      <main className="mx-auto max-w-xl px-4 py-10">
        <div className="card-surface rounded-[28px] p-8 text-center">
          <p className="text-brown/75">Please log in to create your profile.</p>
          <button className="btn-primary mt-4" onClick={() => router.push("/login")}>Go to login</button>
        </div>
      </main>
    );
  }

  const mine = artworks.filter((a) => a.artistId === profile?.id);
  const sections = Array.from(new Set(mine.map((a) => a.section)));
  const savedWorks = artworks
    .filter((a) => savedIds.includes(a.id))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="card-surface rounded-[28px] p-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-semibold text-brown">{profile ? "My Canvas" : "Set up your profile"}</h1>
            {profile ? (
              <button
                type="button"
                className="rounded-full border border-[var(--border)] bg-white/70 px-3 py-1.5 text-sm font-medium text-brown/80 transition hover:bg-white"
                onClick={() => setShowSettings((v) => !v)}
              >
                {showSettings ? "Close settings" : "Settings"}
              </button>
            ) : null}
          </div>

          {profile ? (
            <div className="mt-5 rounded-[24px] bg-[linear-gradient(180deg,rgba(183,196,168,0.18),rgba(255,250,244,0.55))] p-5 text-center">
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-[28px] border border-[var(--border)] bg-white/70 shadow-[0_10px_30px_rgba(90,70,54,0.10)]">
                {profile.avatarDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarDataUrl}
                    alt={profile.name}
                    className="block h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-4xl text-brown/35">◎</div>
                )}
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold tracking-tight text-brown">{profile.name}</div>
                <div className="mt-1 text-sm text-brown/65">{user.email}</div>
                <div className="mt-2 inline-flex rounded-full bg-[rgba(201,124,93,0.12)] px-3 py-1 text-sm font-medium text-rust">
                  {profile.interest}
                </div>
                {profile.bio ? <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-brown/72">{profile.bio}</p> : null}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-brown/70">Complete your profile to get started.</p>
          )}

          {profile ? (
            showSettings ? (
              <div className="mt-4 rounded-2xl border border-[var(--border)] bg-white/35 p-4">
                <p className="text-xs text-brown/55">Only you can change these settings.</p>
                <ProfileForm key={profile.id} profile={profile} onSave={saveProfile} />
              </div>
            ) : null
          ) : (
            <div className="mt-4">
              <ProfileForm key={user.id} profile={profile} onSave={saveProfile} />
            </div>
          )}
        </section>

        <section className="card-surface rounded-[28px] p-6 lg:col-start-1 lg:row-start-2">
          <h2 className="text-xl font-semibold text-brown">Saved artwork</h2>
          <p className="mt-1 text-xs text-brown/55">Only you can see this section.</p>
          {savedWorks.length ? (
            <div className="mt-4 grid gap-4">
              {savedWorks.map((art) => (
                <ArtCard key={art.id} art={art} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-brown/70">No saved artwork yet. Save works you like from categories and artist profiles.</p>
          )}
        </section>

        <section className="lg:row-span-2">
          <div className="card-surface h-full rounded-[28px] p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-brown">My showcase</h2>
              {profile ? <button className="btn-secondary" onClick={() => router.push("/create")}>Post artwork</button> : null}
            </div>
            {!profile ? (
              <p className="mt-4 text-sm text-brown/70">Complete your profile to start posting and showcasing work.</p>
            ) : mine.length === 0 ? (
              <p className="mt-4 text-sm text-brown/70">No posts yet. Add artwork to create sections in your profile.</p>
            ) : (
              <div className="mt-6 space-y-8">
                {sections.map((section) => (
                  <div key={section}>
                    <h3 className="mb-3 text-lg font-semibold text-rust">{section}</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {mine.filter((a) => a.section === section).map((art) => (
                        <ArtCard key={art.id} art={art} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
