"use client";

import { useState, useRef } from "react";

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Erro ao enviar");
  return data.url;
}

export function ImageUpload({
  coverImage,
  extraImages,
}: {
  coverImage?: string;
  extraImages?: string[];
}) {
  const [cover, setCover] = useState(coverImage ?? "");
  const [gallery, setGallery] = useState<string[]>(extraImages ?? []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleCover(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadFile(file);
      setCover(url);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleGallery(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadFile(file);
      setGallery((prev) => [...prev, url]);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function removeGallery(index: number) {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Foto de capa</label>
        <div className="mt-1">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleCover(e.target.files?.[0] ?? null)} />
            {uploading && !gallery.length ? "Enviando..." : "Escolher capa"}
          </label>
        </div>
        <input type="hidden" name="coverImage" value={cover} />
        {cover && (
          <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <img src={cover} alt="Capa" className="h-40 w-full object-cover" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Fotos extras</label>
        <div className="mt-1">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleGallery(e.target.files?.[0] ?? null)} />
            {uploading ? "Enviando..." : "Adicionar foto"}
          </label>
        </div>
        <input type="hidden" name="extraImages" value={JSON.stringify(gallery)} />
        {gallery.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {gallery.map((url, i) => (
              <div key={i} className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                <img src={url} alt={`Foto ${i + 1}`} className="h-24 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGallery(i)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
