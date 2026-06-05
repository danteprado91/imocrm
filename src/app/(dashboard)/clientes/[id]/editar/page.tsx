import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateCustomer } from "@/app/actions/customers";

export default async function EditarClientePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cliente = await prisma.customer.findUnique({ where: { id: Number(id) } });
  if (!cliente) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href={`/clientes/${id}`} className="text-sm text-muted hover:text-slate-900 dark:text-slate-100">&larr; Voltar para detalhes</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Editar Cliente</h1>
      </div>

      <form action={updateCustomer.bind(null, cliente.id)} className="space-y-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Nome completo" name="name" value={cliente.name} required />
          <Field label="E-mail" name="email" value={cliente.email ?? ""} />
          <Field label="Telefone" name="phone" value={cliente.phone ?? ""} />
          <Field label="CPF/CNPJ" name="document" value={cliente.document ?? ""} />
          <Field label="Tipo" name="type" value={cliente.type} />
          <Field label="Data de nascimento" name="birthDate" value={cliente.birthDate ?? ""} />
        </div>
        <Field label="Endereço" name="address" value={cliente.address ?? ""} className="w-full" />
        <Field label="Observações" name="notes" value={cliente.notes ?? ""} as="textarea" />
        <div className="flex items-center gap-4 pt-4">
          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">Salvar alterações</button>
          <Link href={`/clientes/${id}`} className="text-sm font-medium text-muted hover:text-slate-900 dark:text-slate-100">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, value, as, className, required }: { label: string; name: string; value?: string; as?: "textarea"; className?: string; required?: boolean }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      {as === "textarea" ? (
        <textarea id={name} name={name} rows={4} defaultValue={value} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      ) : (
        <input id={name} name={name} type="text" defaultValue={value} required={required} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      )}
    </div>
  );
}
