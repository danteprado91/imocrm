import Link from "next/link";
import { createCustomer } from "@/app/actions/customers";

export default function NovoClientePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/clientes" className="text-sm text-muted hover:text-slate-900 dark:text-slate-100">&larr; Voltar para clientes</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Novo Cliente</h1>
        <p className="mt-1 text-sm text-muted">Cadastre um novo cliente no sistema</p>
      </div>

      <form action={createCustomer} className="space-y-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Nome completo" name="name" required />
          <Field label="E-mail" name="email" type="email" />
          <Field label="Telefone" name="phone" />
          <Field label="CPF/CNPJ" name="document" />
          <Select label="Tipo" name="type" options={["Comprador", "Vendedor", "Locatário", "Locador"]} />
          <Field label="Data de nascimento" name="birthDate" />
        </div>

        <Field label="Endereço" name="address" className="w-full" />
        <Field label="Observações" name="notes" as="textarea" />

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            Salvar cliente
          </button>
          <Link href="/clientes" className="text-sm font-medium text-muted hover:text-slate-900 dark:text-slate-100">Cancelar</Link>
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

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <select id={name} name={name} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light">
        {options.map((opt) => <option key={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
