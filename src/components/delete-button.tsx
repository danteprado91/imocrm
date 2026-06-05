"use client";

export function DeleteButton({ action, label }: { action: () => void; label: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Excluir ${label.toLowerCase()}?`)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="rounded-lg border border-red-200 px-6 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
        Excluir
      </button>
    </form>
  );
}
