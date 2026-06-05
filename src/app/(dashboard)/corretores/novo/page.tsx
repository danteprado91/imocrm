import Link from "next/link";
import { createAgent } from "@/app/actions/agents";

export default function NovoCorretorPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/corretores" className="text-sm text-muted hover:text-slate-900 dark:text-slate-100">&larr; Voltar</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Novo Corretor</h1>
        <p className="mt-1 text-sm text-muted">Cadastre um novo corretor na equipe</p>
      </div>

      <form action={createAgent} className="space-y-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Nome completo" name="name" required />
          <Field label="E-mail" name="email" />
          <Field label="Telefone" name="phone" />
          <Field label="CPF" name="document" />
          <Field label="CRECI" name="creci" />
          <Field label="Comissão (%)" name="commission" type="number" />
        </div>
        <Field label="Observações" name="notes" as="textarea" />
        <div className="flex items-center gap-4 pt-4">
          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">Salvar corretor</button>
          <Link href="/corretores" className="text-sm font-medium text-muted hover:text-slate-900 dark:text-slate-100">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, as, className, type, required }: { label: string; name: string; as?: "textarea"; className?: string; type?: string; required?: boolean }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      {as === "textarea" ? (
        <textarea id={name} name={name} rows={4} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      ) : (
        <input id={name} name={name} type={type ?? "text"} required={required} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      )}
    </div>
  );
}
