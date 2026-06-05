import Link from "next/link";

export function Pagination({ page, totalPages, basePath, searchParams }: { page: number; totalPages: number; basePath: string; searchParams?: Record<string, string | undefined> }) {
  if (totalPages <= 1) return null;

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (searchParams) {
      for (const [key, val] of Object.entries(searchParams)) {
        if (val) params.set(key, val);
      }
    }
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 px-6 py-4">
      {page > 1 && (
        <Link href={buildHref(page - 1)} className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50">
          Anterior
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${p === page ? "bg-primary text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={buildHref(page + 1)} className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50">
          Próximo
        </Link>
      )}
    </div>
  );
}
