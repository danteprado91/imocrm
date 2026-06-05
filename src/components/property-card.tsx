"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type ImageItem = { url: string };

export function PropertyCard({
  href, title, address, coverImage, images, area, bedrooms, bathrooms, salePrice, rentPrice,
}: {
  href: string; title: string; address: string; coverImage?: string | null;
  images?: ImageItem[]; area?: number | null; bedrooms?: number | null;
  bathrooms?: number | null; salePrice?: number | null; rentPrice?: number | null;
}) {
  const [hoverIndex, setHoverIndex] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const allImages = [
    ...(coverImage ? [coverImage] : []),
    ...(images ?? []).map((i) => i.url),
  ];

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function startSlideshow() {
    if (allImages.length <= 1) { setHoverIndex(0); return; }
    setHoverIndex(0);
    timerRef.current = setInterval(() => {
      setHoverIndex((prev) => (prev + 1) % allImages.length);
    }, 1200);
  }

  function stopSlideshow() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setHoverIndex(-1);
  }

  const displayIndex = hoverIndex >= 0 ? hoverIndex : 0;
  const currentSrc = allImages[displayIndex];

  const fmtPrice = (v: number) => `R$ ${(v / 1000).toFixed(0)}.${v % 1000 ? String(v % 1000).padStart(3, "0") : "000"}`;

  return (
    <Link href={href} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl">
      <div
        className="relative aspect-[16/11] overflow-hidden bg-slate-100"
        onMouseEnter={startSlideshow}
        onMouseLeave={stopSlideshow}
      >
        {currentSrc ? (
          <img src={currentSrc} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300 text-sm">Sem foto</div>
        )}
        {allImages.length > 1 && hoverIndex >= 0 && (
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {allImages.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === hoverIndex ? "bg-white" : "bg-white/50"}`} />
            ))}
          </div>
        )}
      </div>
      <div className="space-y-2 p-5">
        <h3 className="font-semibold text-slate-800 group-hover:text-primary">{title}</h3>
        <p className="text-sm text-slate-500">{address}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {area && <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">{area}m²</span>}
          {bedrooms && <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">{bedrooms} quartos</span>}
          {bathrooms && <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">{bathrooms} banheiros</span>}
        </div>
        <div className="pt-1">
          {salePrice ? <p className="text-lg font-bold text-primary">{fmtPrice(salePrice)}</p> : null}
          {rentPrice && !salePrice ? <p className="text-lg font-bold text-primary">R$ {rentPrice.toLocaleString("pt-BR")}/mês</p> : null}
          {rentPrice && salePrice ? <p className="text-sm text-slate-400">ou R$ {rentPrice.toLocaleString("pt-BR")}/mês</p> : null}
        </div>
      </div>
    </Link>
  );
}
