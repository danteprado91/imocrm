"use client";

export function ExportPdfButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-lg bg-slate-100 dark:bg-slate-700/50 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-600/50"
    >
      📄 Exportar PDF
    </button>
  );
}
