import type { CreativeField } from "./types";

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
  sections: CreativeField[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "hue-and-heart",
    name: "Hue & Heart",
    description: "Visual art and fine art — drawing, painting, alpona, and craft.",
    image: "/pic/heart.png",
    sections: ["Drawing", "Painting", "Alpona", "Craft"],
  },
  {
    slug: "pixel-bloom",
    name: "Pixel Bloom",
    description: "Design and graphics — digital creativity and visual design.",
    image: "/pic/pixelbloom.jpg",
    sections: ["Digital Art", "Other"],
  },
  {
    slug: "frame-and-light",
    name: "Frame & Light",
    description: "Media — photography and captured moments.",
    image: "/pic/photo.jpg",
    sections: ["Photography"],
  },
  {
    slug: "word-and-wonder",
    name: "Word & Wonder",
    description: "Writing — stories, poems, sketches in words, and more.",
    image: "/pic/writing.jpg",
    sections: ["Writing"],
  },
];

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function artworkInCategory(section: CreativeField, slug: string) {
  return getCategory(slug)?.sections.includes(section) ?? false;
}
