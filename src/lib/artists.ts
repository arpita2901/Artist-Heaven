import type { Artwork, Profile } from "./types";

export type ArtistSummary = {
  id: string;
  name: string;
  avatarDataUrl?: string;
  bio?: string;
  interest?: Profile["interest"];
};

export function findArtistByName(
  name: string,
  artworks: Artwork[],
  currentProfile: Profile | null,
): ArtistSummary | null {
  const q = name.trim().toLowerCase();
  if (!q) return null;
  if (currentProfile && currentProfile.name.trim().toLowerCase() === q) {
    return {
      id: currentProfile.id,
      name: currentProfile.name,
      avatarDataUrl: currentProfile.avatarDataUrl,
      bio: currentProfile.bio,
      interest: currentProfile.interest,
    };
  }
  const art = artworks.find((a) => a.artistName.trim().toLowerCase() === q);
  if (!art) return null;
  return { id: art.artistId, name: art.artistName, avatarDataUrl: art.artistAvatar };
}

export function getArtistSummary(
  artistId: string,
  artworks: Artwork[],
  currentProfile: Profile | null,
): ArtistSummary | null {
  if (currentProfile?.id === artistId) {
    return {
      id: currentProfile.id,
      name: currentProfile.name,
      avatarDataUrl: currentProfile.avatarDataUrl,
      bio: currentProfile.bio,
      interest: currentProfile.interest,
    };
  }
  const art = artworks.find((a) => a.artistId === artistId);
  if (!art) return null;
  return { id: art.artistId, name: art.artistName, avatarDataUrl: art.artistAvatar };
}
