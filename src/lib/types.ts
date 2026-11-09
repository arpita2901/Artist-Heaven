export type CreativeField =
  | "Photography"
  | "Alpona"
  | "Drawing"
  | "Painting"
  | "Craft"
  | "Digital Art"
  | "Writing"
  | "Other";

export const CREATIVE_FIELDS: CreativeField[] = [
  "Photography",
  "Alpona",
  "Drawing",
  "Painting",
  "Craft",
  "Digital Art",
  "Writing",
  "Other",
];

export type Profile = {
  id: string;
  name: string;
  email: string;
  interest: CreativeField;
  bio: string;
  avatarDataUrl?: string;
};

export type Artwork = {
  id: string;
  artistId: string;
  artistName: string;
  artistAvatar?: string;
  title: string;
  section: CreativeField;
  description: string;
  imageDataUrl: string;
  likes: number;
  dislikes: number;
  createdAt: string;
};
