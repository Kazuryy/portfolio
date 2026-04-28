export const IMAGE_CONFIG = {
  cover: {
    width: 1200,
    height: 675,
    aspectRatio: "16/9",
    quality: 90,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px",
  },
  coverCard: {
    width: 600,
    height: 338,
    aspectRatio: "16/9",
    quality: 85,
    sizes: "(max-width: 768px) 100vw, 600px",
  },
  inline: {
    width: 800,
    height: 450,
    quality: 85,
    sizes: "(max-width: 768px) 100vw, 800px",
  },
} as const;

export const ACCEPTED_FORMATS = ["jpg", "jpeg", "png", "webp", "avif"] as const;

export type ImageType = keyof typeof IMAGE_CONFIG;
