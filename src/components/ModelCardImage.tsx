"use client";

import { useState } from "react";

export function ModelCardImage({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="model-image-fallback" aria-label={`Preview non disponibile per ${name}`}>
        <span>Preview non disponibile</span>
      </span>
    );
  }

  // Chaturbate thumbnails need native image error handling to avoid broken cards.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}
