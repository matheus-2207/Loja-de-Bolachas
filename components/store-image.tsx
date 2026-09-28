"use client";
import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icon";
import { isIllustrativeImage } from "@/lib/product-imagery";
export function StoreImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, 33vw",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  const valid = src && (/^\/(?!\/)/.test(src) || /^https?:\/\//.test(src));
  if (!valid || failed)
    return (
      <div className={`image-unavailable ${className}`}>
        <Icon name="basket" />
        <span>Fotografia em breve</span>
      </div>
    );
  const illustrative = isIllustrativeImage(src);
  return (
    <>
      <Image
        src={src}
        alt={illustrative ? `Imagem ilustrativa de ${alt}` : alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={!src.startsWith("/")}
        className={className}
        onError={() => setFailed(true)}
      />
      {illustrative && (
        <span className="illustration-caption">Imagem ilustrativa</span>
      )}
    </>
  );
}
