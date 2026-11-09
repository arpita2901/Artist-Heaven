"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Artwork, CreativeField, Profile } from "./types";
import { hasSupabaseConfig } from "./supabase";

type AuthUser = { id: string; email: string } | null;

type Reaction = "like" | "dislike";

type AppState = {
  ready: boolean;
  demoMode: boolean;
  user: AuthUser;
  profile: Profile | null;
  artworks: Artwork[];
  savedIds: string[];
  artworkReactions: Partial<Record<string, Reaction>>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  saveProfile: (profile: Omit<Profile, "id" | "email">) => Promise<void>;
  createArtwork: (input: {
    title: string;
    section: CreativeField;
    description: string;
    imageDataUrl: string;
  }) => Promise<{ error?: string }>;
  deleteArtwork: (artworkId: string) => void;
  toggleSave: (artworkId: string) => void;
  reactToArtwork: (artworkId: string, reaction: Reaction) => void;
};

const STORAGE_KEY = "artisan-grove-demo-v1";

const seedArtworks: Artwork[] = [
  {
    id: "seed-1",
    artistId: "seed-a",
    artistName: "Mira",
    title: "Monsoon Courtyard",
    section: "Photography",
    description: "Rain-soft light over old stone and leaves.",
    imageDataUrl:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 800'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='#d8a48f'/><stop offset='1' stop-color='#8a9a7b'/></linearGradient></defs><rect width='600' height='800' fill='url(#g)'/><circle cx='430' cy='180' r='90' fill='#f7f1e8' opacity='.7'/><rect x='70' y='430' width='460' height='250' rx='28' fill='#5a4636' opacity='.25'/><text x='70' y='720' font-size='44' fill='#3a2f28' font-family='Georgia'>Photography</text></svg>`,
      ),
    likes: 0,
    dislikes: 0,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "seed-2",
    artistId: "seed-b",
    artistName: "Anaya",
    title: "Festival Alpona",
    section: "Alpona",
    description: "Traditional floor art with warm festive rhythm.",
    imageDataUrl:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 800'><rect width='600' height='800' fill='#f3e8db'/><g fill='none' stroke='#a85d44' stroke-width='8'><circle cx='300' cy='360' r='180'/><circle cx='300' cy='360' r='110'/><path d='M300 120 C360 220 360 500 300 600 C240 500 240 220 300 120Z'/><path d='M120 360 C220 300 380 300 480 360 C380 420 220 420 120 360Z'/></g><text x='70' y='730' font-size='44' fill='#5a4636' font-family='Georgia'>Alpona</text></svg>`,
      ),
    likes: 0,
    dislikes: 0,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "seed-3",
    artistId: "seed-c",
    artistName: "Rafi",
    title: "Pencil Sketch Portrait",
    section: "Drawing",
    description: "A quiet pencil sketch study in autumn shadows.",
    imageDataUrl:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 800'><defs><linearGradient id='g' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='#efe3d3'/><stop offset='1' stop-color='#d4b483'/></linearGradient></defs><rect width='600' height='800' fill='url(#g)'/><ellipse cx='300' cy='330' rx='150' ry='190' fill='#5a4636' opacity='.18'/><path d='M170 560 Q300 430 430 560' stroke='#3a2f28' stroke-width='10' fill='none' opacity='.35'/><text x='70' y='730' font-size='44' fill='#3a2f28' font-family='Georgia'>Drawing</text></svg>`,
      ),
    likes: 0,
    dislikes: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-4",
    artistId: "seed-d",
    artistName: "Nila",
    title: "Autumn Poster Design",
    section: "Digital Art",
    description: "Graphic design poster with warm typography and shapes.",
    imageDataUrl:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 800'><rect width='600' height='800' fill='#f7f1e8'/><rect x='60' y='80' width='480' height='520' rx='28' fill='#c97c5d' opacity='.18'/><circle cx='300' cy='280' r='120' fill='#8a9a7b' opacity='.35'/><text x='90' y='520' font-size='54' fill='#5a4636' font-family='Georgia'>DESIGN</text><text x='70' y='730' font-size='44' fill='#3a2f28' font-family='Georgia'>Digital Art</text></svg>`,
      ),
    likes: 0,
    dislikes: 0,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "seed-5",
    artistId: "seed-e",
    artistName: "Ira",
    title: "Morning Poem",
    section: "Writing",
    description: "A short poem about light, tea, and quiet beginnings.",
    imageDataUrl:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 800'><rect width='600' height='800' fill='#fffaf4'/><rect x='70' y='90' width='460' height='560' rx='22' fill='#efe3d3' opacity='.75'/><g stroke='#a85d44' stroke-width='3' opacity='.25'><line x1='120' y1='190' x2='480' y2='190'/><line x1='120' y1='250' x2='480' y2='250'/><line x1='120' y1='310' x2='480' y2='310'/><line x1='120' y1='370' x2='420' y2='370'/></g><text x='120' y='230' font-size='28' fill='#5a4636' font-family='Georgia'>Morning light,</text><text x='120' y='290' font-size='28' fill='#5a4636' font-family='Georgia'>warm tea,</text><text x='120' y='350' font-size='28' fill='#5a4636' font-family='Georgia'>soft words.</text><text x='70' y='730' font-size='44' fill='#3a2f28' font-family='Georgia'>Writing</text></svg>`,
      ),
    likes: 0,
    dislikes: 0,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

type Stored = {
  user: AuthUser;
  profile: Profile | null;
  accounts: Record<string, string>;
  artworks: Artwork[];
  savedIds: string[];
  artworkReactions: Partial<Record<string, Reaction>>;
};

function normalizeArtwork(art: Artwork): Artwork {
  return {
    ...art,
    likes: typeof art.likes === "number" ? art.likes : 0,
    dislikes: typeof art.dislikes === "number" ? art.dislikes : 0,
  };
}

function loadStored(): Stored {
  if (typeof window === "undefined")
    return {
      user: null,
      profile: null,
      accounts: {},
      artworks: seedArtworks,
      savedIds: [],
      artworkReactions: {},
    };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return {
        user: null,
        profile: null,
        accounts: {},
        artworks: seedArtworks,
        savedIds: [],
        artworkReactions: {},
      };
    const parsed = JSON.parse(raw) as Partial<Stored>;
    const artworks =
      Array.isArray(parsed.artworks) && parsed.artworks.length
        ? parsed.artworks.map(normalizeArtwork)
        : seedArtworks;
    return {
      user: parsed.user ?? null,
      profile: parsed.profile ?? null,
      accounts: parsed.accounts ?? {},
      artworks,
      savedIds: parsed.savedIds ?? [],
      artworkReactions: parsed.artworkReactions ?? {},
    };
  } catch {
    return {
      user: null,
      profile: null,
      accounts: {},
      artworks: seedArtworks,
      savedIds: [],
      artworkReactions: {},
    };
  }
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    ready: boolean;
    user: AuthUser;
    profile: Profile | null;
    accounts: Record<string, string>;
    artworks: Artwork[];
    savedIds: string[];
    artworkReactions: Partial<Record<string, Reaction>>;
  }>({
    ready: false,
    user: null,
    profile: null,
    accounts: {},
    artworks: seedArtworks,
    savedIds: [],
    artworkReactions: {},
  });

  useEffect(() => {
    // Load persisted demo data after mount to keep server and initial client render identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ ready: true, ...loadStored() });
  }, []);

  const { ready, user, profile, accounts, artworks, savedIds, artworkReactions } = state;
  const setUser = (user: AuthUser) => setState((s) => ({ ...s, user }));
  const setProfile = (value: Profile | null | ((p: Profile | null) => Profile | null)) =>
    setState((s) => ({ ...s, profile: typeof value === "function" ? value(s.profile) : value }));
  const setAccounts = (value: Record<string, string> | ((a: Record<string, string>) => Record<string, string>)) =>
    setState((s) => ({ ...s, accounts: typeof value === "function" ? value(s.accounts) : value }));
  const setArtworks = (value: Artwork[] | ((a: Artwork[]) => Artwork[])) =>
    setState((s) => ({ ...s, artworks: typeof value === "function" ? value(s.artworks) : value }));
  const setSavedIds = (value: string[] | ((ids: string[]) => string[])) =>
    setState((s) => ({ ...s, savedIds: typeof value === "function" ? value(s.savedIds) : value }));
  const setArtworkReactions = (
    value:
      | Partial<Record<string, Reaction>>
      | ((r: Partial<Record<string, Reaction>>) => Partial<Record<string, Reaction>>),
  ) => setState((s) => ({ ...s, artworkReactions: typeof value === "function" ? value(s.artworkReactions) : value }));

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, profile, accounts, artworks, savedIds, artworkReactions }),
    );
  }, [ready, user, profile, accounts, artworks, savedIds, artworkReactions]);

  const value = useMemo<AppState>(
    () => ({
      ready,
      demoMode: !hasSupabaseConfig,
      user,
      profile,
      artworks,
      savedIds,
      artworkReactions,
      async login(email, password) {
        const existing = accounts[email.toLowerCase()];
        if (!existing || existing !== password) return { error: "Invalid email or password." };
        const id = "demo-" + email.toLowerCase();
        setUser({ id, email });
        setProfile((p) => (p?.email === email ? p : p));
        return {};
      },
      async signup(email, password) {
        if (!email.includes("@") || password.length < 6)
          return { error: "Use a valid email and a password with at least 6 characters." };
        const key = email.toLowerCase();
        setAccounts((a) => ({ ...a, [key]: password }));
        setUser({ id: "demo-" + key, email });
        return {};
      },
      async logout() {
        setUser(null);
      },
      async saveProfile(input) {
        if (!user) return;
        setProfile({ id: user.id, email: user.email, ...input });
      },
      async createArtwork(input) {
        if (!user || !profile) return { error: "Please log in and complete your profile first." };
        const art: Artwork = {
          id: crypto.randomUUID(),
          artistId: profile.id,
          artistName: profile.name,
          artistAvatar: profile.avatarDataUrl,
          ...input,
          likes: 0,
          dislikes: 0,
          createdAt: new Date().toISOString(),
        };
        setArtworks((a) => [art, ...a]);
        return {};
      },
      deleteArtwork(artworkId) {
        setArtworks((items) =>
          items.filter((art) => !(art.id === artworkId && art.artistId === profile?.id)),
        );
        setSavedIds((ids) => ids.filter((id) => id !== artworkId));
        setArtworkReactions((r) => {
          const next = { ...r };
          delete next[artworkId];
          return next;
        });
      },
      toggleSave(artworkId) {
        setSavedIds((ids) =>
          ids.includes(artworkId) ? ids.filter((i) => i !== artworkId) : [artworkId, ...ids],
        );
      },
      reactToArtwork(artworkId, reaction) {
        const current = artworkReactions[artworkId];
        setArtworks((items) =>
          items.map((art) => {
            if (art.id !== artworkId) return art;
            let likes = art.likes ?? 0;
            let dislikes = art.dislikes ?? 0;
            if (current === "like") likes = Math.max(0, likes - 1);
            if (current === "dislike") dislikes = Math.max(0, dislikes - 1);
            if (current === reaction) return { ...art, likes, dislikes };
            if (reaction === "like") likes += 1;
            if (reaction === "dislike") dislikes += 1;
            return { ...art, likes, dislikes };
          }),
        );
        setArtworkReactions((r) => {
          const next = { ...r };
          if (current === reaction) delete next[artworkId];
          else next[artworkId] = reaction;
          return next;
        });
      },
    }),
    [ready, user, profile, artworks, savedIds, artworkReactions, accounts],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
