"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

export function ModelCardImage({ src, name, priority = false }: { src: string; name: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="model-image-fallback" aria-label={`Preview non disponibile per ${name}`}>
        <span>Preview non disponibile</span>
      </span>
    );
  }

  // Chaturbate thumbnails need native image error handling to avoid broken cards.
  return (
    <img
      src={src}
      alt={`Anteprima webcam live di ${name}`}
      width={360}
      height={270}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
