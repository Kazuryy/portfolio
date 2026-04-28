import Image from "next/image";
import { IMAGE_CONFIG } from "@/lib/image-config";

interface MDXImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export function MDXImage({ src, alt = "", width, height }: MDXImageProps) {
  if (!src) return null;

  const config = IMAGE_CONFIG.inline;

  return (
    <span className="block my-8">
      <Image
        src={src}
        alt={alt}
        width={width || config.width}
        height={height || config.height}
        className="w-full h-auto rounded-lg block"
        sizes={config.sizes}
        quality={config.quality}
      />
      {alt && (
        <span
          className="block mt-2 text-center text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          {alt}
        </span>
      )}
    </span>
  );
}
