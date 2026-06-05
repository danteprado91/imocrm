import Link from "next/link";
import { createProperty } from "@/app/actions/properties";
import { ImageUpload } from "@/components/image-upload";

export default function NovoImovelPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/imoveis" className="text-sm text-muted hover:text-slate-900 dark:text-slate-100">&larr; Voltar</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Novo Imóvel</h1>
      </div>

      <form action={createProperty} className="space-y-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Título" name="title" required />
          <Field label="Tipo" name="type" required />
          <Field label="Área (m²)" name="area" type="number" />
          <Field label="Quartos" name="bedrooms" type="number" />
          <Field label="Banheiros" name="bathrooms" type="number" />
          <Field label="Vagas" name="garageSpots" type="number" />
        </div>
        <Field label="Endereço" name="address" className="w-full" required />
        <Field label="Descrição" name="description" as="textarea" />
        <ImageUpload />
        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="Valor venda (R$)" name="salePrice" type="number" />
          <Field label="Valor aluguel (R$)" name="rentPrice" type="number" />
          <Select label="Status" name="status" options={["Disponível", "Vendido", "Alugado"]} />
        </div>
        <div className="flex items-center gap-4 pt-4">
          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">Salvar imóvel</button>
          <Link href="/imoveis" className="text-sm font-medium text-muted hover:text-slate-900 dark:text-slate-100">Cancelar</Link>
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
